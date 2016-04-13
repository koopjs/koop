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

    options.dir = options.dir

    koop.thumbnail.generate(data, key, options, callback)
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
    log: koop.log,
    fs: koop.fs,
    parseSpatialReference: formatSpatialRef,
    plugin: plugin,
    generateThumbnail: generateThumbnail,
    getImageServiceTile: getImageServiceTile,
    getServiceTile: getServiceTile,
    getGeoHash: getGeoHash,
    getCount: getCount,
    getExtent: getExtent
  }
}

module.exports = Model
