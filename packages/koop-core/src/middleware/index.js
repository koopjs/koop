/**
 * Middleware to trim whitespace from incoming string parameters
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function paramTrim(req, res, next) {
  Object.keys(req.query).map(param=>{
    req.query[param] = (typeof req.query[param] == 'string' || req.query[param] instanceof String) 
        ? req.query[param].trim() : req.query[param]
    })
  next()
}

module.exports = {
  paramTrim
}