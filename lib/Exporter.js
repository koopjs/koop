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

// exports large data via multi part file strategy
exports.exportLarge = function (koop, format, id, key, type, options, finish, done) {
  // exports large data via multi part file strategy
  if (!format) {
    return done('No format provided', null)
  } else if (!ogrFormats[format]) {
    return done('Unknown format', null)
  }

  // limit for file chunks
  options.limit = 5000

  var pages
  var fileCount = 0
  var dir = id + '_' + (options.layer || 0)
  var dbkey = type + ':' + id
  var table = dbkey + ':' + (options.layer || 0)
  var vrt = '<OGRVRTDataSource>'

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

  // create the files for out output
  // we always create a json file, then use it to convert to a file
  var paths = createPaths(dir, key, format, options)

  if (koop.config.export_workers) {
    koop.Cache.getInfo(table, function (err, info) {
      if (err) return done(err)

      var locked = false

      if (!info.export_lock) {
        info.export_lock = true
      } else {
        locked = true
      }

      info.status = 'processing'
      info.generating = {
        progress: 0 + '%'
      }

      _update(info, function (err, res) {
        if (err) return done(err)

        // return immediately with state: processing
        done(null, info)

        options.key = key
        options.dir = dir

        // do all the work inside the worker
        var task = {
          options: options,
          dbkey: dbkey,
          table: table,
          format: format,
          finish: finish,
          ogrFormat: ogrFormats[format],
          files: paths,
          pages: []
        }

        if (!locked) {
          var job = koop.Exporter.export_q.create('exports', task).save(function (err) {
            if (err) return done(err)
            koop.log.debug('added job to export queue ' + job.id)
          })

          job.on('progress', function (progress) {
            // the question is do we need to get the info from the db here?
            // TODO explore this in qa and its impact of DB load
            koop.Cache.getInfo(table, function (err, info) {
              if (err) return done(err)

              info.status = 'processing'

              if (info.generating) {
                info.generating.progress = progress + '%'
              }

              _update(info, function (err, res) {
                if (err) return done(err)
                koop.log.debug('job progress' + job.id + ' ' + progress + '%')
              })
            })
          })
        }
      })
    })
  } else {
    // proceed with logic here
    if (fs.existsSync(paths.rootVrtFile) && !options.ignore_cache) {
      // if we already have the vrtfile and we want a diff format
      koop.Cache.getInfo(table, function (err, info) {
        if (err) return done(err)

        info.status = 'processing'
        info.generating = {
          progress: 0 + '%'
        }

        _update(info, function (err, res) {
          if (err) return done(err)

          // return response
          done(null, info)

          // create large file from vrt
          _callOgr(paths.rootVrtFile, paths.rootNewFile, function (err, formatFile) {
            if (err) return done(err)

            delete info.status
            delete info.generating

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

        info.status = 'processing'
        info.generating = {
          progress: 0 + '%'
        }

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
}

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
      delete geojson.info
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

// executes OGR
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
        callback(err.message + ' ' + ogrParams, null)
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

            moveShapeFile(outFile, paths.base, options.name, _createZip)
          })
        } else {
          moveFile(outFile, paths.rootNewFile, callback)
        }
      }
    })
  })
}

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

function removeShapeFile (dir, name, callback) {
  async.each(shapefileParts, function (type, callback) {
    rm(dir + '/' + name + '.' + type, function (err) {
      callback(err)
    })
  }, function (err) {
    callback(err)
  })
}

function moveShapeFile (file, base, name, callback) {
  var shpdir = base + '/' + name
  async.each(shapefileParts, function (type, callback) {
    moveFile(shpdir + '/OGRGeoJSON' + '.' + type, base + '/' + name + '.' + type, function (err) {
      callback(err)
    })
  }, function (err) {
    callback(err)
  })
}

function moveFile (inFile, newFile, callback) {
  mv(inFile, newFile, function (err) {
    if (err) {
      callback(err)
    } else {
      callback(null, newFile)
    }
  })
}

function fixWkt (inWkt, wkid) {
  // we have issue projecting this WKID w/o a datum xform
  // FYI there may be other proj codes needed here
  var wkt
  switch (wkid) {
    case 3078:
      wkt = '+proj=omerc +lat_0=45.30916666666666 +lonc=-86 +alpha=337.25556 +k=0.9996 +x_0=2546731.496 +y_0=-4354009.816 + ellps=GRS80 +datum=NAD83 +units=m +no_defs'
      break
    case 2927:
      wkt = 'PROJCS["NAD83(HARN) / Washington South (ftUS)",GEOGCS["NAD83(HARN)",DATUM["NAD83_High_Accuracy_Regional_Network",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062],AUTHORITY["EPSG","6152"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4152"]],UNIT["US survey foot",0.3048006096012192,AUTHORITY["EPSG","9003"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",47.33333333333334],PARAMETER["standard_parallel_2",45.83333333333334],PARAMETER["latitude_of_origin",45.33333333333334],PARAMETER["central_meridian",-120.5],PARAMETER["false_easting",1640416.667],PARAMETER["false_northing",0],AUTHORITY["EPSG","2927"],AXIS["X",EAST],AXIS["Y",NORTH]]'
      break
    case 28992:
      wkt = '+title=Amersfoort/Amersfoort +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812'
      break
    default:
      wkt = inWkt
  }
  if (wkt.match(/UTM/)) return wkt.replace('TOWGS84[0,0,0,0,0,0,0]', 'TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062]')
  return wkt
}

function getOgrParams (format, inFile, outFile, geojson, options, callback) {
  // escape quotes in file names
  inFile = inFile.replace(/"/g, '"')
  outFile = outFile.replace(/"/g, '"')

  // replace the format extension for zip/shp so the shp gets created as a dir
  outFile = outFile.replace('\.zip', '')

  var cmd = ['ogr2ogr', '--config', 'SHAPE_ENCODING', 'UTF-8', '-f', ogrFormats[format], outFile, inFile]

  if (format === 'csv') {
    cmd = csvParams(geojson, cmd)
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

function csvParams (geojson, cmd) {
  // how would we even get here without geojson?? leaving this in only to prevent regressions
  if (!geojson) return cmd
  var hasPointGeom = geojson.features && geojson.features.length & geojson.features[0].geometry && geojson.features[0].geometry.type === 'Point'
  var hasXY = (geojson.features[0].properties['x'] && geojson.features[0].properties['y']) || (geojson.features[0].properties['X'] && geojson.features[0].properties['Y'])
  if (hasPointGeom && !hasXY) {
    cmd.push('-lco')
    cmd.push('WRITE_BOM=YES')
    cmd.push('-lco')
    cmd.push('GEOMETRY=AS_XY')
  }
  return cmd
}

function shapefileParams (cmd, options, callback) {
  if (options.outSR) options.sr = formatSpatialRef(options.outSR)
  if (options.sr || options.wkid) {
    addProjection(options, function (err, wkt) {
      if (err) return callback(err)
      cmd.push('-t_srs')
      cmd.push('"' + wkt + '"')
      // make sure field names are not truncated multiple times
      cmd.push('-fieldmap')
      cmd.push('identity')
      callback(null, cmd)
    })
  } else {
    cmd.push('-fieldmap')
    cmd.push('identity')
    callback(null, cmd)
  }
}

function finishOgrParams (cmd) {
  cmd.push('-update')
  cmd.push('-append')
  cmd.push('-skipfailures')
  cmd.push('-lco')
  cmd.push('ENCODING=UTF-8')
  return cmd.join(' ')
}

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
