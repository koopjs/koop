const joi = require('joi');
const geojsonhint = require('geojson-validation');
const { logger } = require('../logger');
const { KOOP_LOG_LEVEL, LOG_LEVEL } = process.env;

const queryParamSchema = joi
  .object({
    resultRecordCount: joi.number().optional(),
  })
  .unknown();

const geojsonMetadataSchema = joi
  .object({
    maxRecordCount: joi.number().preferences({ convert: false }).optional(),
  })
  .unknown();

function validate(params, geojson) {
  validateGeojsonMetadata(geojson.metadata);

  validateRequestParams(params);

  if (shouldValidateGeojson()) {
    validateGeojson(geojson);
  }
}

function shouldValidateGeojson() {
  return LOG_LEVEL === 'debug' || KOOP_LOG_LEVEL === 'debug';
}

function validateGeojson(geojson) {
  const geojsonErrors = geojsonhint.valid(geojson, true);
  if (geojsonErrors.length > 0) {
    logger.debug(
      `source data for contains invalid GeoJSON; ${geojsonErrors[0]}`,
    );
  }
}

function validateGeojsonMetadata(metadata = {}) {
  const { error } = geojsonMetadataSchema.validate(metadata);
  if (error) {
    error.code = 500;
    throw error;
  }
}

function validateRequestParams(params) {
  const { error } = queryParamSchema.validate(params);

  if (error) {
    error.code = 400;
    throw error;
  }
}

module.exports = {
  validateInputs: validate,
};
