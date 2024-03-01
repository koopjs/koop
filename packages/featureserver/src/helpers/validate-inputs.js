const joi = require('joi');
const _ = require('lodash');
const geojsonhint = require('geojson-validation');
const logManager = require('../log-manager');
const { VALIDATE_GEOJSON } = process.env;

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
  return !_.isUndefined(VALIDATE_GEOJSON);
}

// TODO: move this out of feature server
function validateGeojson(geojson) {
  const geojsonErrors = geojsonhint.valid(geojson, true);
  if (geojsonErrors.length > 0) {
    logManager.logger.debug(
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
