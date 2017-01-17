const FsInfo = require('./info.js')
const FsQuery = require('./query.js')
const Templates = require('./templates')

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
  if (req.query.callack) req.query.callback = sanitizeCallback(req.query.callback)

  // check for info requests and respond like ArcGIS Server would
  if (isInfoReq(req)) return res.status(200).send(Templates.render('server'))
  // if this is for a method we can handle like query
  const method = req.params && req.params.method
  switch (method) {
    case 'query': return execQuery(req, res, geojson)
    default: return execInfo(req, res, method, geojson)
  }
}

function isInfoReq (req) {
  req._parsedUrl.pathname.substr(-4) === 'info'
}

function execQuery (method, req, res, geojson) {
  let response
  try {
    response = FsQuery(geojson, req.query || {})
  } catch (e) {
    res.status(500).json({error: e.message})
  }
  if (req.query.callback) res.send(`${req.query.callback}(${JSON.stringify(response)})`)
  else res.status(200).json(response)
}

function execInfo (req, res, method, geojson) {
  const infoFunc = FsInfo[method]
  if (!infoFunc) return res.status(500).json({error: 'Method not supported'})
  let info
  try {
    info = infoFunc(geojson, req.query)
  } catch (e) {
    res.status(500).json({error: e.message})
  }
  if (req.query.callback) res.send(`${req.query.callback}(${JSON.stringify(info)})`)
  else res.status(200).json(info)
}

function sanitizeCallback (callback) {
  return callback.replace(/[^\w\d\.\(\)\[\]]/g, '')
}
