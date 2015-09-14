var featureServices = require('./FeatureServices')
var arcServerInfo = {
  currentVersion: 10.21,
  fullVersion: '10.2.1',
  soapUrl: 'http://sampleserver6.arcgisonline.com/arcgis/services',
  secureSoapUrl: 'https://sampleserver6.arcgisonline.com/arcgis/services',
  authInfo: {
    isTokenBasedSecurity: true,
    tokenServicesUrl: 'https://sampleserver6.arcgisonline.com/arcgis/tokens/',
    shortLivedTokenValidity: 60
  }
}

/**
 * A base controller that we can use as a prototype
 * contains help methods to process complex query structures for request routing
 */
function Controller () {
  /**
   * Shared logic for handling Feature Service requests.
   * Most providers will use this method to figure out what request is being made.
   *
   * @param {object} req - incoming server request
   * @param {object} res - outgoing server response
   * @param {object} err - an error for some reason (this really shouldn't be here)
   * @param {object} data - some data to process
   */
  function processFeatureServer (req, res, err, data) {
    // TODO: don't delete properties of `req`
    // affects cache & query filtering in lib/Query
    delete req.query.geometry

    if (err) return res.status(500).jsonp(err)
    if (!data) return res.status(400).jsonp(new Error('No data found'))

    // check for info requests and respond like ArcGIS Server would
    var isInfoRequest = req._parsedUrl.pathname.substr(-4) === 'info'
    if (isInfoRequest) return res.jsonp(arcServerInfo)

    var layer = req.params.layer
    var method = req.params.method
    var query = req.query || {}

    // requests for specific layers - pass data and the query string
    if (featureServices[layer]) return featureServices[layer](data, query, _handleFeatureData)

    if (layer) {
      // pull out the layer data or return 404
      if (data[layer]) data = data[layer]
      else return res.status(404).jsonp(new Error('Layer not found'))
    }

    // we have a method call like "/layers"
    if (method && featureServices[method]) return featureServices[method](data, query, _handleFeatureData)

    // make a straight up feature service info request
    // we still pass the layer here to conform to info method, though it's undefined
    featureServices.info(data, layer, query, function (err, featureData) {
      if (err) return res.status(500).jsonp(err)
      res.jsonp(featureData)
    })

    /**
     * private function for handling data from featureServices methods
     *
     * @param {Error} err - error
     * @param {object} featureData - feature service data returned from featureServices method
     */
    function _handleFeatureData (err, featureData) {
      if (err) return res.status(400).jsonp(err)

      // limit response to 1000
      var over1000 = featureData.features && featureData.features.length > 1000
      if (over1000) featureData.features = featureData.features.splice(0, 1000)

      res.jsonp(featureData)
    }
  }

  return {
    processFeatureServer: processFeatureServer
  }
}

module.exports = Controller
