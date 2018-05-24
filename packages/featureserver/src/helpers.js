module.exports = { responseHandler }

/**
 * Handle responses; special treatment for requests with "callback" query parameter
 * @param {object} req request object
 * @param {object} res response object
 * @param {integer} statusCode response status code
 * @param {object} payload response payload
 */
function responseHandler (req, res, statusCode, payload) {
  if (req.query.callback) {
    let sanitizedCallback = req.query.callback.replace(/[^\w\d\.\(\)\[\]]/g, '') // eslint-disable-line
    res.set('Content-Type', 'application/javascript')
    res.send(`${sanitizedCallback}(${JSON.stringify(payload)})`)
  } else res.status(statusCode).json(payload)
}
