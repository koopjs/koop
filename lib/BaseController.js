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
   * shared logic for handling Feature Service requests
   * most providers will use this mehtod to figure out what request is being made
   *
   * @param {object} req - incoming server request
   * @param {object} res - outgoing server response
   * @param {object} err - an error for some reason (this really shouldn't be here)
   * @param {object} data - some data to process
   */
  function processFeatureServer (req, res, err, data) {
    if (err) return res.status(500).jsonp(err)
    if (!data) return res.status(400).jsonp(new Error('No data found'))

    // check for info requests and respond like ArcGIS Server would
    if (req._parsedUrl.pathname.substr(-4) === 'info') return res.jsonp(arcServerInfo)

    if (featureServices[req.params.layer]) {
      // requests for specific layers - pass data and the query string
      featureServices[req.params.layer](data, req.query || {}, _handleFeatureData)
    } else {
      // have a layer
      if (req.params.layer && data[req.params.layer]) {
        // pull out the layer data
        data = data[req.params.layer]
      } else if (req.params.layer && !data[req.params.layer]) {
        return res.status(404).jsonp(new Error('Layer not found'))
      }

      if (req.params.method && featureServices[req.params.method]) {
        // we have a method call like "/layers"
        featureServices[req.params.method](data, req.query || {}, _handleFeatureData)
      } else {
        // make a straight up feature service info request
        // we still pass the layer here to conform to info method, though its undefined
        featureServices.info(data, req.params.layer, req.query, function (err, d) {
          if (err) return res.status(500).jsonp(err)
          res.jsonp(d)
        })
      }
    }

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
