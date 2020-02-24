const Joi = require('@hapi/joi')
const METHODS_SCHEMA = Joi.array().items(Joi.string().valid('get', 'post', 'patch', 'put', 'delete', 'head').insensitive())

module.exports = function validateMethods (methods) {
  const result = METHODS_SCHEMA.validate(methods)
  if (result.error) throw new Error(`One or more route methods is not supported; ${result.error}`)
}
