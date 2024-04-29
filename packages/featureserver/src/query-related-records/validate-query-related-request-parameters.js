const joi = require('joi');
const { sharedQueryParamSchema } = require('../helpers/shared-query-request-param-schema');

const queryRequestSchema = sharedQueryParamSchema
  .append({
    f: joi.string().valid('json', 'pjson').default('json'),
    relationshipId: joi.string().optional(),
  })
  .unknown();

function validateQueryRelatedRequestParams(queryRequestParams) {
  const { error } = queryRequestSchema.validate(queryRequestParams);

  if (error) {
    handleError(error);
  }
}

function handleError(error) {
  const [param] = error.details[0].path;
  const code = 400;
  const details = [error.details[0].message];

  if (param === 'quantizationParameters') {
    throw makeError({
      message: "'quantizationParameters' parameter is invalid",
      code,
      details,
    });
  }

  throw makeError({
    message: 'Invalid format',
    code,
    details,
  });
}

module.exports = {
  validateQueryRelatedRequestParams,
};

function makeError(params) {
  const { message, details, code } = params;
  const err = new Error(message);
  err.code = code;
  err.details = details;
  return err;
}
