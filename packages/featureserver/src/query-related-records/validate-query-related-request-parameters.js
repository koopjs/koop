const joi = require('joi');

const formatSchema = joi.string().valid('json', 'pjson', 'pbf').default('json');

const spatialReferenceSchema = joi
  .object({
    wkid: joi.number().integer().required(),
    latestWkid: joi.number().integer(),
  })
  .unknown();

const queryRequestSchema = joi
  .object({
    resultRecordCount: joi.number().preferences({ convert: false }).optional(),
    resultOffset: joi.number().preferences({ convert: false }).optional(),
    returnGeometry: joi.boolean().optional(),
    outFields: joi.string().optional(),
    objectIds: joi.string().optional(),
    returnCountOnly: joi.boolean().optional(),
    orderByFields: joi.string().optional(),
    outSR: spatialReferenceSchema,
    f: formatSchema,
  })
  .unknown();

function validateQueryRequestParams(queryRequestParams) {
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
  validateQueryRequestParams,
};

function makeError(params) {
  const { message, details, code } = params;
  const err = new Error(message);
  err.code = code;
  err.details = details;
  return err;
}
