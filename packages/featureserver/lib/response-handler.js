module.exports = function responseHandler (req, res, statusCode, payload) {
  if (req.query.callback) {
    let sanitizedCallback = req.query.callback.replace(/[^\w\d\.\(\)\[\]]/g, '') // eslint-disable-line
    res.set('Content-Type', 'application/javascript')
    res.status(statusCode)
    res.send(`${sanitizedCallback}(${JSON.stringify(payload)})`)
  } else if (req.query && req.query.f === 'pjson') res.set('Content-type', 'application/json; charset=utf-8').status(statusCode).send(JSON.stringify(payload, null, 2))
  else res.status(statusCode).json(payload)
}
