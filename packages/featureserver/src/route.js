const FsInfo = require('./info.js')
const FsQuery = require('./query.js')
const FsGenerateRenderer = require('./generateRenderer')

module.exports = route

/**
 * shared logic for handling Feature Service requests
 * most providers will use this method to figure out what request is being made
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Object}   geojson
 */
function route (req, res, geojson, options) {
  req.query = req.query || {}
  req.query = coerceQuery(req.query)
  req.params = req.params || {}
  const metadata = geojson.metadata || {}

  Object.keys(req.query).forEach(key => {
    req.query[key] = tryParse(req.query[key])
  })

  if (req.query.callback) req.query.callback = sanitizeCallback(req.query.callback)
  if (isNaN(req.query.limit)) req.query.limit = metadata.maxRecordCount || 2000

  // if this is for a method we can handle like query
  const method = req.params && req.params.method
  switch (method) {
    case 'query':
      return execQuery(req, res, geojson, options)
    case 'generateRenderer':
      return execGenerateRenderer(req, res, geojson, options)
    default:
      return execInfo(req, res, method, geojson)
  }
}

function execQuery (req, res, geojson, options) {
  let response
  try {
    response = FsQuery(geojson, req.query || {})
  } catch (e) {
    if (process.env.NODE_ENV === 'test') console.trace(e)
    return res.status(e.code || 500).json({ error: e.message })
  }
  if (req.query.callback) res.send(`${req.query.callback}(${JSON.stringify(response)})`)
  else res.status(200).json(response)
}

function execGenerateRenderer (req, res, geojson, options) {
  let response
  try {
    response = FsGenerateRenderer(geojson, req.query || {})
  } catch (e) {
    if (process.env.NODE_ENV === 'test') console.trace(e)
    return res.status(e.code || 500).json({ error: e.message })
  }
  if (req.query.callback) res.send(`${req.query.callback}(${JSON.stringify(response)})`)
  else res.status(200).json(response)
}

function execInfo (req, res, method, geojson) {
  let info
  const url = (req.url || req.originalUrl).split('?')[0]
  try {
    if (/\/FeatureServer$/i.test(url)) {
      info = FsInfo.serverInfo(geojson, req.params)
    } else if (/\/FeatureServer\/\d+$/i.test(url)) {
      info = FsInfo.layerInfo(geojson, req.params)
    } else if (/\/FeatureServer\/layers$/i.test(url)) {
      info = FsInfo.layersInfo(geojson, req.query)
    } else {
      const error = new Error('Method not supported')
      error.code = 400
      throw error
    }
  } catch (e) {
    if (process.env.NODE_ENV === 'test') console.trace(e)
    return res.status(e.code || 500).json({ error: e.message })
  }
  if (req.query.callback) res.send(`${req.query.callback}(${JSON.stringify(info)})`)
  else res.status(200).json(info)
}

function sanitizeCallback (callback) {
  return callback.replace(/[^\w\d\.\(\)\[\]]/g, '') // eslint-disable-line
}

function tryParse (json) {
  try {
    return JSON.parse(json)
  } catch (e) {
    return json
  }
}

function coerceQuery (params) {
  Object.keys(params).forEach(param => {
    if (params[param] === 'false') params[param] = false
    else if (params[param] === 'true') params[param] = true
  })
  return params
}
