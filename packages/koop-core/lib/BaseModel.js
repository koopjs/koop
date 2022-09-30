var fs = require('fs')
var formatSpatialRef = require('format-spatial-ref')

/**
 * exposes shared functionality across providers
 * typically things that require direct access to koop
 * TODO: refactor so that koop app isn't passed in at all
 *
 * @param {Object} koop - instance of koop middleware app
 */
function Model (koop) {
  /**
   * log to central Koop log
   * configured at startup
   *
   * @param {string} level
   * @param {string} message
   */
  function log (level, message) {
    koop.log[level](message)
  }

  /**
   * lookup files in the central Koop files object
   * configured at startup
   */
  var files = koop.files

  /**
   * returns configured data dir for the cache
   *
   * @return {string}
   */
  function cacheDir () {
    return koop.Cache.data_dir
  }

  /**
   * a wrapper method that reduces the number of params
   * passed to exportFunctions
   * Helps keep backward compatability with the existing API
   *
   * @param {object} params
   * @param {object} options
   * @param {Function} callback
   */
  function exportFile (params, options, callback) {
    if (options && options.large) {
      exportLarge(params.format, params.id, params.key, params.type, options, callback)
    } else {
      exportToFormat(params.format, params.dir, params.key, params.data, options, callback)
    }
  }

  /**
   * exports data to the given format
   *
   * @param {string} format
   * @param {string} dir
   * @param {string} key
   * @param {object} data
   * @param {object} options
   * @param {Function} callback
   */
  function exportToFormat (format, dir, key, data, options, callback) {
    options.rootDir = koop.files.localDir

    koop.Exporter.exportToFormat(format, dir, key, data, options, function (err, result) {
      if (err) return callback(err, null)
      finishExport(format, key, options, result, callback)
    })
  }

  /**
   * TODO: missing description
   *
   * @param {string} format
   * @param {string} id
   * @param {string} key
   * @param {string} type
   * @param {object} options
   * @param {Function} callback
   */
  function exportLarge (format, id, key, type, options, callback) {
    options.rootDir = koop.files.localDir
    koop.Exporter.exportLarge(koop, format, id, key, type, options, finishExport, callback)
  }

  /**
   * calls Thumbnail generate to create a thumbnail
   *
   * @param {string} data
   * @param {string} key
   * @param {object} options
   * @param {Function} callback
   */
  function generateThumbnail (data, key, options, callback) {
    if (!koop.thumbnail) {
      return callback({
        code: 500,
        message: 'Thumbnail generation is not included in this instance of koop'
      }, null)
    }

    options.dir = options.dir || koop.files.localDir

    koop.thumbnail.generate(data, key, options, callback)
  }

  /**
   * gets/creates a tile from the url params and data
   *
   * @param {object} params
   * @param {object} data
   * @param {Function} callback
   */
  function tileGet (params, data, callback) {
    if (!koop.tiles) {
      return callback({
        code: 500,
        message: 'Tile generation is not included in this instance of koop'
      }, null)
    }

    params.dir = params.dir || koop.files.localDir
    delete data.info

    koop.tiles.getTile(params, data, callback)
  }

  /**
   * gets a plugin from the koop object
   * @param {string} name - plugin name
   * @return {function} plugin
   */
  function plugin (name) {
    return koop[name]
  }

  /**
   * TODO: missing description
   *
   * @param {object} params
   * @param {Function} callback
   */
  function getImageServiceTile (params, callback) {
    koop.tiles.getImageServiceTile(params, callback)
  }

  /**
   * TODO: missing description
   *
   * @param {object} params
   * @param {Function} callback
   */
  function getServiceTile (params, info, callback) {
    koop.tiles.getServiceTile(params, info, callback)
  }

  /**
   * TODO: missing description
   *
   * @param {string} format
   * @param {string} key
   * @param {object} options
   * @param {object} result
   * @param {Function} callback
   */
  function finishExport (format, key, options, result, callback) {
    function sendFile (err, result) {
      if (err) return callback(err, null)

      if (koop.files.s3) {
        try {
          // try to clean up local FS
          fs.unlinkSync(result.paths.rootNewFile)
          fs.unlinkSync(result.paths.rootJsonFile)
        } catch(e) {
          koop.log.debug('Trying to remove non-existant file: %s', e)
        }

        koop.files.exists(result.paths.path + '/' + key, result.paths.newFile, function (exists, path) {
          if (!exists) return callback('File did not get created.', null)
          return callback(null, path)
        })
      } else {
        callback(null, result.file)
      }
    }

    if (koop.files.s3) {
      var stream = fs.createReadStream(result.file)

      koop.files.write(result.paths.path + '/' + key, result.paths.newFile, stream, function (err) {
        if (err) return callback(err, result)

        if (!options.isFiltered) {
          koop.files.write(result.paths.latestPath, result.paths.newFile, fs.createReadStream(result.file), function (err) {
            if (err) {
              koop.log.error('Error writing file to s3: %s', err)
            }

            try {
              // try to clean up local FS
              fs.unlinkSync(result.paths.rootNewFile)
            } catch(e) {
              koop.log.debug('Trying to remove non-existant file: %s', e)
            }
            sendFile(null, result)
          })
        } else {
          sendFile(null, result)
        }
      })
    } else {
      sendFile(null, result)
    }
  }

  /**
   * TODO: missing description
   *
   * @param {string} key
   * @param {object} options
   * @param {Function} callback
   */
  function getGeoHash (key, options, callback) {
    if (!koop.Cache.db.geoHashAgg) return callback('The installed cache doesnt support geohash aggregation', null)

    var limit = options.limit || 100000
    var precision = options.precision || 8

    koop.Cache.db.geoHashAgg(key, limit, precision, options, callback)
  }

  function saveFile (path, file, data, callback) {
    koop.files.write(path, file, data, function (err) {
      if (err) return callback(err)
      return callback()
    })
  }

  /**
   * TODO: missing description
   *
   * @param {string} key
   * @param {options} options
   * @param {Function} callback
   */
  function getCount (key, options, callback) {
    koop.Cache.getCount(key, options, callback)
  }

  /**
   * TODO: missing description
   *
   * @param {string} key
   * @param {options} options
   * @param {Function} callback
   */
  function getExtent (key, options, callback) {
    koop.Cache.getExtent(key, options, callback)
  }

  return {
    log: log,
    files: files,
    cacheDir: cacheDir,
    exportToFormat: exportToFormat,
    exportLarge: exportLarge,
    exportFile: exportFile,
    finishExport: finishExport,
    parseSpatialReference: formatSpatialRef,
    tileGet: tileGet,
    plugin: plugin,
    generateThumbnail: generateThumbnail,
    getImageServiceTile: getImageServiceTile,
    getServiceTile: getServiceTile,
    getGeoHash: getGeoHash,
    saveFile: saveFile,
    getCount: getCount,
    getExtent: getExtent
  }
}

module.exports = Model
