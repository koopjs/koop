const fsInfo = require('./info.js')
const fsQuery = require('./query.js')

module.exports = route

/**
 * shared logic for handling Feature Service requests
 * most providers will use this mehtod to figure out what request is being made
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Object}   geojson
 */
function route (req, res, geojson, options) {
  delete req.query.geometry
  if (req.query.callack) req.query.callback = sanitizeCallback(req.query.callback)

  // check for info requests and respond like ArcGIS Server would
  if (isInfoReq(req)) return res.status(200).send(Templates.render('server'))
  // if this is for a method we can handle like query
  const serverMethod = getServerMethod(req.params)
  if (serverMethod) return execServerMethod(serverMethod, req, res, geojson)
  else return execInfo(res, req.query, geojson)
}


function isInfoReq (req) {
  req._parsedUrl.pathname.substr(-4) === 'info'
}

function getServerMethod (params) {
  if (params.method && featureServices[params.method]) return featureServices[params.method]
  else return false
}

function execServerMethod (method, req, res, geojson) {
  try {
    const response = method(geojson, req.query || {})

    if (req.query.callback) res.send(`${callback}(${JSON.stringify(d)})`)
    else res.status(200).json(d)

  } catch (e) {
    res.status(500).json({error: e.message})
  }

}

function execInfo (res, query, geojson) {
  try {
    const info = fsInfo(geojson, query)
    if (query.callback) res.send(`${query.callback}(${JSON.stringify(info)})`)
    else res.status(200).json(info)
  } catch (e) {
    res.status(500).json({error: e.message})
  }
}

function sanitizeCallback (callback) {
  return callback.replace(/[^\w\d\.\(\)\[\]]/g, '')
}
