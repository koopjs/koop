const _ = require('lodash');

module.exports = function filterAndValidateClassificationFeatures (features, classificationField) {
  return features.filter(feature => {
    return !shouldSkipFeature({ feature, classificationField });
  }).map(feature => {
    validateClassificationValue(feature, classificationField);
    return Number(feature.properties[classificationField]);
  });
};

function validateClassificationValue ({ properties }, classificationField) {
  const value = properties[classificationField];
  if (_.isNaN(Number(value))) {
    throw new TypeError(`Cannot use non-numeric classificationField, ${classificationField}: "${value}"`);
  }
}

function shouldSkipFeature ({ feature: { properties }, classificationField }) {
  const value = properties[classificationField];
  return value === undefined || value === null;
}
