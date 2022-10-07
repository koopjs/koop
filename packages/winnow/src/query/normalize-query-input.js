const Joi = require('joi');

const featureSchema = Joi.object({
  geometry: Joi.object().allow(null).optional(),
  attributes: Joi.object().optional(),
  properties: Joi.object().optional()
}).or('attributes', 'properties').required().unknown();

function normalizeQueryInput (input) {
  if (isFeatureCollection(input)) {
    return input.features;
  }

  if (isFeatureArray(input)) {
    return input;
  }

  if (isFeature(input)) {
    return [input];
  }

  throw new Error('Could not normalize query input to feature array');
}

function isFeatureCollection (input = {}) {
  const featureCollectionSchema = Joi.object({
    features: Joi.array().required()
  }).unknown();

  const { error } = featureCollectionSchema.validate(input);

  if (!error && isFeatureArray(input.features)) return true;
}

function isFeatureArray (input) {
  if (Array.isArray(input) && input.length === 0) return true;

  const featureArraySchema = Joi.array().items(featureSchema).required();

  const { error } = featureArraySchema.validate(input);
  if (!error) return true;
}

function isFeature (input) {
  const { error } = featureSchema.validate(input);
  if (!error) return true;
}

module.exports = normalizeQueryInput;
