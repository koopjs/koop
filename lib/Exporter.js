// Exports data as any supported format
// take in a format, file key, geojson, and callback
var fs = require('fs')
var mkdirp = require('mkdirp')
var async = require('async')
var crypto = require('crypto')
var mv = require('mv')
var formatSpatialRef = require('format-spatial-ref')
var rm = require('rimraf')
var exec = require('child_process').exec
var SR = require('spatialreference')
var _ = require('lodash')
var ExportJob = require('./ExportJob')
var ogrFormats = {
  kml: 'KML',
  zip: '"ESRI Shapefile"',
  csv: 'CSV',
  json: 'GeoJSON',
  geojson: 'GeoJSON',
  gpkg: 'GPKG'
}
var shapefileParts = [
  'shp',
  'dbf',
  'shx',
  'prj',
  'cpg',
  'shp.xml'
]

/**
 * Creates filter based on row ids
 * Since ids are handled differently in the Caches (not feature proprties but table props instead)
 * its more effencient to page over large tables using row ids than feature.property.objectIds
 *
 * @param {object} options
 * @returns {string} idFilter
 */
function createIdFilter (options) {
  var idFilter
  if (options && options.offset && options.limit) {
    idFilter = ' id >= ' + options.offset + ' AND id < ' +
      (parseInt(options.offset, 10) + parseInt(options.limit, 10))
  }
  return idFilter
}

/**
 * Exports a file by collecting geojson chunks from the database and using VRT files as input
 *
 * @param {object} koop - a Koop object passed in for its cache methods
 * @param {string} format - the format of file to export
 * @param {string} id - the item item used to select from the cache and update info
 * @param {string} key - a unique hash representing the filters used to select data from the cache
 * @param {string} type - the provider type being exported
 * @param {object} options - options used to filter the data from the db
 * @param {function} finish - a function used to complete the export operation
 * @param {function} done - a callback to execute
 */
exports.exportLarge = function (koop, format, id, key, type, options, finish, done) {
  if (!format || !ogrFormats[format]) return done('Bad format', null)

  // limit for file chunks
  options.limit = 5000

  var pages
  var fileCount = 0
  var dir = id + '_' + (options.layer || 0)
  var dbkey = type + ':' + id
  var table = dbkey + ':' + (options.layer || 0)
  var vrt = '<OGRVRTDataSource>'
  // create the files for out output
  // we always create a json file, then use it to convert to a file
  var paths = createPaths(dir, key, format, options)

  if (koop.config.export_workers) {
    var job = {
      options: options,
      table: table,
      paths: paths,
      format: format,
      key: key,
      dir: dir,
      finish: finish,
      dbKey: dbkey,
      ogrFormat: ogrFormats[format],
      pages: []
    }
    var helpers = {
      cache: koop.Cache,
      log: koop.log,
      queue: koop.Exporter.export_q
    }
    koop.log.debug(_.omit(job, 'finish'))
    var exportJob = new ExportJob(helpers, job, done)
    return exportJob.start()
  }

  function _update (info, cb) {
    koop.Cache.updateInfo(table, info, function (err, success) {
      if (err) return cb(err)
      cb()
    })
  }

  // call ogr in a separate process
  function _callOgr (inFile, outFile, callback) {
    var params = {
      inFile: inFile,
      outFile: outFile,
      paths: paths,
      format: format
    }

    callOgr(params, null, options, callback)
  }

  // creates a json chunk of the data and if we have all
  // then we write the VRT file and return
  function collect (file, json, callback) {
    fileCount++

    if (json) {
      delete json.info
    }
    var exists = fs.existsSync(file)
    if (exists) {
      fs.unlinkSync(file)
    }
    fs.writeFile(file, JSON.stringify(json), function () {
      vrt += '<OGRVRTLayer name="OGRGeoJSON"><SrcDataSource>' + file + '</SrcDataSource></OGRVRTLayer>'

      if (fileCount === pages) {
        vrt += '</OGRVRTDataSource>'

        fs.writeFile(paths.rootVrtFile, vrt, function () {
          // CALL OGR
          _callOgr(paths.rootVrtFile, paths.rootNewFile, function (err, formatFile) {
            if (err) return callback(err)

            koop.Cache.getInfo(table, function (err, info) {
              if (err) return callback(err)

              delete info.status
              delete info.generating

              // FINISH the UPLOAD
              finish(format, key, options, {paths: paths, file: formatFile}, function () {
                _update(info, function (err, res) {
                  if (err) return callback(err)
                })
              })
            })
          })
        })
      }
      callback()
    })
  }

  var q = async.queue(function (task, cb) {
    var opts = {
      idFilter: createIdFilter(options),
      layer: options.layer,
      where: options.where,
      geometry: options.geometry,
      bypassProcessing: true
    }

    koop.Cache.db.select(dbkey, opts, function (err, data) {
      if (err) return cb(err)
      collect(task.file, data[0], cb)
    })
  }, 1)

  // proceed with logic here
  if (fs.existsSync(paths.rootVrtFile) && !options.ignore_cache) {
    // if we already have the vrtfile and we want a diff format
    koop.Cache.getInfo(table, function (err, info) {
      if (err) return done(err)

      info.generating[key][format] = true
      _update(info, function (err, res) {
        if (err) return done(err)

        // return response
        done(null, info)

        // create large file from vrt
        _callOgr(paths.rootVrtFile, paths.rootNewFile, function (err, formatFile) {
          if (err) return done(err)

          delete info.generating[key][format]

          finish(format, key, options, { paths: paths, file: formatFile }, function () {
            _update(info, function (err, res) {
              if (err) return done(err)
            })
          })
        })
      })
    })
  } else {
    // we have nothing; generate new data
    koop.Cache.getInfo(table, function (err, info) {
      if (err) return done(err)
      info.generating[key].progress = 0 + '%'

      _update(info, function (err, res) {
        if (err) return done(err)

        // return info and move on as async
        done(null, info)

        mkdirp(paths.base, function () {
          koop.Cache.getCount(table, options, function (err, count) {
            if (err) {
              console.log('error getting count')
              return done(err)
            }

            pages = Math.ceil(count / options.limit)
            var noop = function () {}

            for (var i = 0; i < pages; i++) {
              var offset = (i * (options.limit)) + 1
              var op = { file: paths.base + '/part.' + i + '.json', offset: offset }
              q.push(op, noop)
            }
          })
        })
      })
    })
  }
}

/**
 * Exports geojson to another format
 *
 * @param {string} format - the file format to return
 * @param {string} dir - the directory to export the file into
 * @param {string} key - a unique hash representing filters placed on the data
 * @param {object} geojson - geojson used as input
 * @param {object} options - options to pass to callOGR
 * @param {function} callback - calls back with an error or a file path
 */
exports.exportToFormat = function (format, dir, key, geojson, options, callback) {
  if (!format) {
    return callback('No format provided', null)
  } else if (!ogrFormats[format]) {
    return callback('Unknown format', null)
  }

  // create the files for out output
  // we always create a json file, then use it to convert to a file
  var paths = createPaths(dir, key, format, options)

  // executes OGR
  function _callOgr (inFile, outFile, callback) {
    var params = {
      inFile: inFile,
      outFile: outFile,
      paths: paths,
      format: format
    }

    callOgr(params, geojson, options, callback)
  }

  // create a json file on disk
  // if we want json just send it back
  // else use the json file to convert to other formats
  mkdirp(paths.base, function () {
    if (!fs.existsSync(paths.rootJsonFile)) {
      if (geojson.info) delete geojson.info
      var json = JSON.stringify(geojson).replace(/esri/g, '')
      fs.writeFile(paths.rootJsonFile, json, function (err) {
        if (err) return callback(err)

        _callOgr(paths.rootJsonFile, paths.rootNewFile, function (err, file) {
          callback(err, {paths: paths, file: file})
        })
      })
    } else {
      if (format === 'json' || format === 'geojson') {
        callback(null, {paths: paths, file: paths.rootJsonFile})
      } else {
        _callOgr(paths.rootJsonFile, paths.rootNewFile, function (err, file) {
          callback(err, {paths: paths, file: file})
        })
      }
    }
  })
}

/**
 * Wrapper around command line utility OGR2OGR
 *
 * @param {object} params - parameters including the format and file paths
 * @param {object} geojson - a sample of the geojson that will be exported to another format
 * @param {object} options - contains a name for the file and metadata if it exists
 * @param {function} callback - calls back with an error or the exported file
 */
function callOgr (params, geojson, options, callback) {
  var format = params.format
  var paths = params.paths
  var inFile = params.inFile
  var outFile = params.outFile
  var metadata = options.metadata

  // we already have the file, just return it
  if (fs.existsSync(outFile)) return callback(null, outFile)

  getOgrParams(format, inFile, outFile, geojson, options, function (err, cmd) {
    if (err) return callback(err)
    exec(cmd, function (err) {
      if (err) {
        callback(err.message + ': ' + cmd, null)
      } else {
        if (format === 'zip') {
          // mkdir for base path (dir + key) to store shp
          mkdirp(paths.base, function () {
            if (!options.name) {
              options.name = paths.tmpName
            }

            // cp each file into dir with new name
            function _createZip () {
              var newZipTmp = paths.base + '/' + options.name + paths.tmpName + '.zip'
              var newZip = paths.base + '/' + options.name + '.zip'
              var cmd = ['zip', '-rj', '"' + newZipTmp + '"', paths.base + '/', '--exclude=*.json*', '--exclude=*.vrt'].join(' ')
              exec(cmd, function (err) {
                if (err) return callback(err)

                moveFile(newZipTmp, newZip, callback)
                removeShapeFile(paths.base, options.name, function (err) {
                  if (err) console.log('error removing shpfile ' + err)
                })
              })
            }

            if (metadata) {
              fs.writeFileSync(paths.base + '/' + options.name + '.xml', metadata)
            }

            moveShapeFile(paths.base, options.name, _createZip)
          })
        } else {
          moveFile(outFile, paths.rootNewFile, callback)
        }
      }
    })
  })
}

/**
 * Creates a set of paths used in the export process
 *
 * @param {string} dir - the base directory to create paths
 * @param {string} key - a unique key representing filters placed on the data
 * @param {string} format - the format to be exported
 * @param {object} options - contains a name and/or a root directory
 */
function createPaths (dir, key, format, options) {
  var paths = {}
  // we use temp names to write new files then move
  // them into place once they are written
  var current_date = (new Date()).valueOf().toString()
  var random = Math.random().toString()
  paths.tmpName = crypto.createHash('sha1').update(current_date + random).digest('hex')

  paths.root = options.rootDir || './'
  paths.path = ['files', dir].join('/')
  paths.latestPath = ['latest', 'files', dir].join('/')
  paths.base = [paths.root, paths.path, key].join('/')

  paths.jsonFile = (options.name || key) + '.json'
  // the VRT file must use the key to support large filters
  // the file has to be unique to the filter
  paths.vrtFile = key + '.vrt'
  paths.newFile = (options.name || key) + '.' + format

  paths.rootJsonFile = [paths.base, paths.jsonFile].join('/')
  paths.rootVrtFile = [paths.base, paths.vrtFile].join('/')
  paths.rootNewFile = [paths.base, paths.newFile].join('/')

  return paths
}

/**
 * Removes the shapefile parts from the local disk after a zip has been written
 *
 * @param {string} dir - the directory where the shapefile parts are stored
 * @param {string} name - the name of the shapefile parts
 * @param {function} callback - calls back with an error or nothing
 */
function removeShapeFile (dir, name, callback) {
  async.each(shapefileParts, function (type, callback) {
    rm(dir + '/' + name + '.' + type, function (err) {
      callback(err)
    })
  }, function (err) {
    callback(err)
  })
}

/**
 * Moves shapefile parts into a folder
 *
 * @param {string} base - the base directory where files are stored
 * @param {string} name - the name of the file to move
 * @param {function} callback - calls back with an error or nothing
 */
function moveShapeFile (base, name, callback) {
  var shpdir = base + '/' + name
  async.each(shapefileParts, function (type, callback) {
    moveFile(shpdir + '/OGRGeoJSON' + '.' + type, shpdir + '.' + type, function (err) {
      callback(err)
    })
  }, function (err) {
    callback(err)
  })
}

/**
 * Moves a file into a new directory
 *
 * @param {string} inFile - the old file path
 * @param {string} newFile - the new filepath to write
 * @param {function} callback - calls back with an error or the new file path
 */
function moveFile (inFile, newFile, callback) {
  mv(inFile, newFile, function (err) {
    if (err) {
      callback(err)
    } else {
      callback(null, newFile)
    }
  })
}
/**
 * Fixes incorrect WKT Strings
 *
 * @param {string} inWkt - The original well-known text for the projection
 * @param {integer} wkid - The well-known id for the projection
 * @private
 */
function fixWkt (inWkt, wkid) {
  // we have issue projecting this WKID w/o a datum xform
  // FYI there may be other proj codes needed here
  var wkt
  switch (wkid) {
    case 3078:
      wkt = '+proj=omerc +lat_0=45.30916666666666 +lonc=-86 +alpha=337.25556 +k=0.9996 +x_0=2546731.496 +y_0=-4354009.816 + ellps=GRS80 +datum=NAD83 +units=m +no_defs'
      break
    case 28992:
      wkt = '+title=Amersfoort/Amersfoort +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812'
      break
    case 5514:
      wkt = 'PROJCS["S-JTSK_Krovak_East_North",GEOGCS["GCS_S_JTSK",DATUM["Jednotne_Trigonometricke_Site_Katastralni",SPHEROID["Bessel_1841",6377397.155,299.1528128]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]],PROJECTION["Krovak"],PARAMETER["False_Easting",0],PARAMETER["False_Northing",0],PARAMETER["Pseudo_Standard_Parallel_1",78.5],PARAMETER["Scale_Factor",0.9999],PARAMETER["Azimuth",30.28813975277778],PARAMETER["Longitude_Of_Center",24.83333333333333],PARAMETER["Latitude_Of_Center",49.5],PARAMETER["X_Scale",-1],PARAMETER["Y_Scale",1],PARAMETER["XY_Plane_Rotation",90],UNIT["Meter",1],AUTHORITY["EPSG","102067"]]'
      break
    default:
      wkt = inWkt
  }
  // per Melita Kennedy @esri This is the correct datum transformation to NAD83 for the variant of WGS84 used in recent data. See also: http://www.epsg-registry.org/
  if (wkt.match(/NAD83/)) return wkt.replace('TOWGS84[0,0,0,0,0,0,0]', 'TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062]')
  if (wkt.match(/UTM/)) return wkt.replace('TOWGS84[0,0,0,0,0,0,0]', 'TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062]')
  return wkt
}

/**
 * Gets a set of OGR Paramters for an export

 * @param {string} format - the output format
 * @param {string} inFile - the geojson or vrt to use as a source
 * @param {string} outFile - the file to write
 * @param {object} geojson - a geojson object used in the xform
 * @param {object} options - potentially contains a fields object
 */
function getOgrParams (format, inFile, outFile, geojson, options, callback) {
  // escape quotes in file names
  inFile = inFile.replace(/"/g, '"')
  outFile = outFile.replace(/"/g, '"')

  // replace the format extension for zip/shp so the shp gets created as a dir
  outFile = outFile.replace('\.zip', '')

  var cmd = ['ogr2ogr', '--config', 'SHAPE_ENCODING', 'UTF-8', '-f', ogrFormats[format], outFile, inFile]

  var feature = _.find(geojson.features, function (feature) {
    return feature.geometry !== null
  })

  if (feature && feature.geometry) {
    options.geometryType = feature.geometry.type
  } else {
    options.geometryType = 'NONE'
  }

  if (format === 'csv') {
    options.fields = Object.keys(geojson.features[0].properties)
    cmd = csvParams(cmd, options)
    callback(null, finishOgrParams(cmd))
  } else if (format === 'zip' || format === 'shp') {
    // only project features for shp when wkid != 4326 or 3857 or 102100
    shapefileParams(cmd, options, function (err, cmd) {
      if (err) callback(err)
      callback(null, finishOgrParams(cmd))
    })
  } else {
    callback(null, finishOgrParams(cmd))
  }
}

/**
 * Add parameters specific to a csv export
 *
 * @param {array} cmd - an array of OGR command parts to modify
 * @param {object} options - may contain fields
 * @return {array}
 * @private
 */
function csvParams (cmd, options) {
  var hasPointGeom = options.geometryType === 'Point'
  var fields = options.fields.join('|').toLowerCase().split('|')
  var hasXY = _.include(fields, 'x') || _.include(fields, 'y')
  if (hasPointGeom && !hasXY) {
    cmd.push('-lco WRITE_BOM=YES')
    cmd.push('-lco GEOMETRY=AS_XY')
  }
  return cmd
}

/**
 * Add parameters specific to a csv export
 *
 * @param {string} cmd - an array of OGR command parts to modify
 * @param {object} options - may contain a wkid or wkt
 * @param {function} callback - calls back back with a modified command array or an error
 * @private
 */
function shapefileParams (cmd, options, callback) {
  // make sure geometries are still written even if the first is null
  cmd.push('-nlt ' + options.geometryType.toUpperCase())
  if (options.outSr) options.sr = formatSpatialRef(options.outSr)
  if (options.sr || options.wkid) {
    addProjection(options, function (err, wkt) {
      if (err) return callback(err)
      cmd.push('-t_srs \'' + wkt + '\'')
      // make sure field names are not truncated multiple times
      cmd.push('-fieldmap identity')
      callback(null, cmd)
    })
  } else {
    cmd.push('-fieldmap identity')
    callback(null, cmd)
  }
}

/**
 * Adds final parameters to the OGR function call
 * @param {array} cmd - an array of OGR command parts to modify
 * @return {string} the final OGR command
 */
function finishOgrParams (cmd) {
  cmd.push('-update')
  cmd.push('-append')
  cmd.push('-skipfailures')
  cmd.push('-lco')
  cmd.push('ENCODING=UTF-8')
  return cmd.join(' ')
}

/**
 * Gets projection information for a shapefile exprot
 * @param {object} options - contains info on spatial reference, wkid and wkt
 * @param {function} callback - calls back with an error or wkt
 * @private
 */
function addProjection (options, callback) {
  // if there is a passed in WKT just use that
  if (!options.sr) options.sr = {}
  if (options.sr.wkt) return callback(null, options.sr.wkt)
  var sr = new SR({db: options.db, logger: options.logger})
  var wkid = options.sr.latestWkid || options.sr.wkid || options.wkid
  sr.wkidToWkt(wkid, function (err, wkt) {
    callback(err, fixWkt(wkt, wkid))
  })
}

exports.createIdFilter = createIdFilter
exports.createPaths = createPaths
exports.callOgr = callOgr
exports.moveFile = moveFile
exports.moveShapeFile = moveShapeFile
exports.getOgrParams = getOgrParams
