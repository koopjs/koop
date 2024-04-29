const joi = require('joi');

const spatialReferenceSchema = joi
  .object({
    wkid: joi.number().integer().required(),
    latestWkid: joi.number().integer(),
  })
  .unknown();

const sharedQueryParamSchema = joi
  .object({
    resultRecordCount: joi.number().preferences({ convert: false }).optional(),
    resultOffset: joi.number().preferences({ convert: false }).optional(),
    returnGeometry: joi.boolean().optional(),
    outFields: joi.string().optional(),
    objectIds: joi.string().optional(),
    returnCountOnly: joi.boolean().optional(),
    orderByFields: joi.string().optional(),
    outSR: spatialReferenceSchema,
  })
  .unknown();

module.exports = {
  sharedQueryParamSchema,
};
