const joi = require('joi');

const formatSchema = joi.string().valid('json', 'pjson').default('json');

const spatialReferenceSchema = joi
  .object({
    wkid: joi.number().integer().required(),
    latestWkid: joi.number().integer(),
  })
  .unknown();

const esriExtentSchema = joi.object({
  xmin: joi.number().required(),
  xmax: joi.number().required(),
  ymin: joi.number().required(),
  ymax: joi.number().required(),
  spatialReference: spatialReferenceSchema.optional(),
});

const quantizationParametersSchema = joi.object({
  originPosition: joi.string().optional(),
  tolerance: joi.number().optional(),
  extent: esriExtentSchema.optional(),
  mode: joi.string().optional(),
});

const queryRequestSchema = joi
  .object({
    quantizationParameters: quantizationParametersSchema,
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
  // TODO: right now the only possible error is for quantizationParams
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

  if (param === 'f') {
    throw makeError({
      message: 'Invalid format',
      code,
      details,
    });
  }

  throw error;
}

module.exports = {
  validateQueryRequestParams,
};

function makeError(params) {
  const { message, details, code = 500 } = params;
  const err = new Error(message);
  err.code = code;
  err.details = details;
  return err;
}
