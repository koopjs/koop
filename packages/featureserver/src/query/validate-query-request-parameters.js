const joi = require('joi');

const spatialReferenceSchema = joi.object({
  wkid: joi.number().integer().required(),
  latestWkid: joi.number().integer(),
}).unknown();

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


const queryRequestSchema = joi.object({
  quantizationParameters: quantizationParametersSchema
}).unknown();

function validate(queryRequestParams) {
  const { error } = queryRequestSchema.validate(queryRequestParams);

  if (error) {
    handleError(error);
  }
}

function handleError(error) {
  // TODO: right now the only possible error is for quantizationParams
  // const [param] = error.details[0].path;
  // if (param === 'quantizationParameters') {
  const err = new Error('\'quantizationParameters\' parameter is invalid');
  err.code = 400;
  err.details = [error.details[0].message];
  throw err;
  // }
  // throw error;
}
module.exports = {
  validate
};
