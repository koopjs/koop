const joi = require('joi');

const parameterSchema = joi
  .object({
    f: joi.string().valid('json', 'pjson').default('json'),
  })
  .unknown();

function validateInfoRouteParams(parameters) {
  const { error } = parameterSchema.validate(parameters);

  if (error) {
    const err = new Error('Invalid format');
    err.code = 400;
    throw err;
  }
}

module.exports = { validateInfoRouteParams };
