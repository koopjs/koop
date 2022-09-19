const joi = require('joi');

const esriExtentSchema = joi.object({
  xmin: joi.number().required(),
  xmax: joi.number().required(),
  ymin: joi.number().required(),
  ymax: joi.number().required(),
  type: joi.string().optional(),
  spatialReference: joi.object().keys({
    wkid: joi.number().integer().optional(),
    latestWkid: joi.number().integer().optional()
  }).optional()
}).unknown();

const simpleArraySchema = joi.array().items(joi.number().required()).min(4);
const cornerArraySchema = joi.array().items(joi.array().items(joi.number()).length(2)).length(2);

module.exports = function (input, spatialReference) {
  if (!input) return undefined;

  const { value: arrayExtent } = validate(input, simpleArraySchema);

  if (arrayExtent) {
    return simpleArrayToEsriExtent(arrayExtent, spatialReference);
  }

  const { value: cornerArrayExtent } = validate(input, cornerArraySchema);

  if (cornerArrayExtent) {
    return cornerArrayToEsriExtent(cornerArrayExtent, spatialReference);
  }

  const { value: esriExtent } = validate(input, esriExtentSchema);

  if (esriExtent) {
    return { spatialReference, ...esriExtent };
  }

  throw new Error(`Received invalid extent: ${JSON.stringify(input)}`);
};

function validate (input, schema) {
  const { error, value } = schema.validate(input);
  if (error) return { error };
  return { value };
}

function simpleArrayToEsriExtent (arrayExent, spatialReference) {
  return {
    xmin: arrayExent[0],
    ymin: arrayExent[1],
    xmax: arrayExent[2],
    ymax: arrayExent[3],
    spatialReference
  };
}

function cornerArrayToEsriExtent (cornerArrayExtent, spatialReference) {
  return {
    xmin: cornerArrayExtent[0][0],
    ymin: cornerArrayExtent[0][1],
    xmax: cornerArrayExtent[1][0],
    ymax: cornerArrayExtent[1][1],
    spatialReference
  };
}
