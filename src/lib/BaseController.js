const featureServices = require('./FeatureServices')

/**
 * A base controller that we can use as a prototype
 * contains help methods to process complex query structures for request routing
 */
function Controller () {
  /**
   * shared logic for handling Feature Service requests
   * most providers will use this mehtod to figure out what request is being made
   *
   * @param  {Object}   req
   * @param  {Object}   res
   * @param  {Object}   geojson
   */
  function processFeatureServer (req, res, geojson) {
    delete req.query.geometry

    // check for info requests and respond like ArcGIS Server would
    if (isInfoReq(req)) return res.status(200).send(serverInfoResponse)
    // if this is for a method we can handle like query
    const serverMethod = getServerMethod(req.params)
    if (serverMethod) return execServerMethod(serverMethod, req, res, geojson)
    // make a straight up feature service info request
    // we still pass the layer here to conform to info method, though its undefined
    else return execInfo(geojson, req.params.layer, req.query, res)
  }

  return {processFeatureServer}
}

const serverInfoResponse = {
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

function isInfoReq (req) {
  req._parsedUrl.pathname.substr(-4) === 'info'
}

function getServerMethod (params) {
  if (params.method && featureServices[params.method]) return featureServices[params.method]
  else return false
}

function execServerMethod (method, req, res, geojson) {
  // we have a method call like "/layers"
  method(geojson, req.query || {}, function (err, d) {
    // limit response to 1000
    if (err) return res.status(400).send(err)
    if (!geojson) return res.status(400).json({error: 'No data passed to feature server method'})
    if (d.features && d.features.length > 1000) d.features = d.features.splice(0, 1000)
    if (req.query.callback) {
      const callback = sanitizeCallback(req.query.callback)
      return res.send(callback + '(' + JSON.stringify(d) + ')')
    }
    res.status(200).json(d)
  })
}

function execInfo (geojson, layer, query, res) {
  featureServices.info(geojson, layer, query, function (err, d) {
    if (err) return res.status(500).send(err)
    if (query.callback) return res.send(query.callback + '(' + JSON.stringify(d) + ')')
    res.status(200).json(d)
  })
}

function sanitizeCallback (callback) {
  return callback.replace(/[^\w\d\.\(\)\[\]]/g, '')
}

module.exports = Controller
