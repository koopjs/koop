module.exports = function responseHandler (req, res, statusCode, payload) {
  if (req.query.callback) {
    let sanitizedCallback = req.query.callback.replace(/[^\w\d\.\(\)\[\]]/g, '') // eslint-disable-line
    res.set('Content-Type', 'application/javascript')
    res.send(`${sanitizedCallback}(${JSON.stringify(payload)})`)
  } else res.status(statusCode).json(payload)
}
