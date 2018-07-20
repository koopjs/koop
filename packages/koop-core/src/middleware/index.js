/**
 * Middleware to trim whitespace from incoming string parameters
 * @param {object} req request object
 * @param {object} res response object
 * @param {function} next fire next middleware function
 */
function paramTrim (req, res, next) {
  Object.keys(req.query).map(param => {
    req.query[param] = (typeof req.query[param] === 'string' || req.query[param] instanceof String)
      ? req.query[param].trim() : req.query[param]
  })
  next()
}

/**
 * Parse any request query parameters that arrive as JSON strings
 * @param {object} req request object
 * @param {object} res response object
 * @param {function} next fire next middleware function
 */
function paramParse (req, res, next) {
  Object.keys(req.query).map(param => {
    req.query[param] = tryParse(req.query[param])
  })
  next()
}

/**
 * Coerce any string booleans to booleans
 * @param {object} req request object
 * @param {object} res response object
 * @param {function} next fire next middleware function
 */
function paramCoerce (req, res, next) {
  Object.keys(req.query).forEach(param => {
    if (req.query[param] === 'false') req.query[param] = false
    else if (req.query[param] === 'true') req.query[param] = true
  })
  next()
}

/**
 * Attempt to parse as JSON and return. If parsing fails, return input
 * @param {*} json
 * @returns {*}
 */
function tryParse (json) {
  try {
    return JSON.parse(json)
  } catch (e) {
    return json
  }
}

module.exports = {
  paramTrim, paramParse, paramCoerce
}
