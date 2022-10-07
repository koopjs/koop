const _ = require('lodash');
const filterAndValidateClassificationFeatures = require('./filter-and-validate-classification-features');

function normalizeClassBreaks(features, classification) {
  const { normType: type } = classification;

  if (type === 'field') {
    return normalizeByField(features, classification);
  }

  if (type === 'log') {
    return normalizeByLog(features, classification);
  }

  if (type === 'percent') {
    return normalizeByPercent(features, classification);
  }

  throw new Error(`Normalization not supported: ${type}`);
}

function normalizeByField(
  features,
  { field: classificationField, normField: normalizationField },
) {
  if (!normalizationField) {
    throw new Error('Normalization field is undefined');
  }

  if (!classificationField) {
    throw new Error('Classification field is undefined');
  }

  const values = features
    .map((feature) => {
      if (
        shouldSkipFeatureForFieldNormalization({
          feature,
          classificationField,
          normalizationField,
        })
      ) {
        return;
      }

      validateNormalizationValues({
        feature,
        classificationField,
        normalizationField,
      });

      const valueToNormalizeBy =
        feature.properties[normalizationField] > 0
          ? feature.properties[normalizationField]
          : 1;

      return feature.properties[classificationField] / valueToNormalizeBy;
    })
    .filter((value) => {
      return !_.isUndefined(value);
    });

  if (!values || values.length === 0) {
    throw new Error(
      `Classification field "${classificationField}" and normalization field "${normalizationField}" were not found on any feature.`,
    );
  }
  return values;
}

function normalizeByLog(features, { field: classificationField }) {
  const values = filterAndValidateClassificationFeatures(
    features,
    classificationField,
  ).map((value) => {
    if (value <= 0) {
      return 0;
    }
    const logValue = Math.log10(value);
    return logValue < 0 ? 0 : logValue;
  });

  if (!values || values.length === 0) {
    throw new Error(
      `Classification field "${classificationField}" was not found on any feature.`,
    );
  }
  return values;
}

function normalizeByPercent(features, { field: classificationField }) {
  const values = filterAndValidateClassificationFeatures(
    features,
    classificationField,
  );

  const valueTotal = values.reduce((sum, value) => {
    return sum + value;
  }, 0);

  if (valueTotal <= 0)
    throw new Error(
      `Cannot normalize by percent because value total is not greater than 0: ${valueTotal}`,
    );

  return values.map((value) => {
    return (value / valueTotal) * 100;
  });
}

function shouldSkipFeatureForFieldNormalization({
  feature: { properties },
  classificationField,
  normalizationField,
}) {
  const value = properties[classificationField];
  const valueToNormalizeBy = properties[normalizationField];
  return (
    value === undefined ||
    value === null ||
    valueToNormalizeBy === undefined ||
    valueToNormalizeBy === null
  );
}

function validateNormalizationValues({
  feature: { properties },
  classificationField,
  normalizationField,
}) {
  const value = properties[classificationField];
  const valueToNormalizeBy = properties[normalizationField];
  if (!_.isNumber(value)) {
    throw new TypeError(
      `Cannot use non-numeric classificationField, ${classificationField}: "${value}"`,
    );
  }

  if (!_.isNumber(valueToNormalizeBy)) {
    throw new TypeError(
      `Cannot use non-numeric normalizationField, ${normalizationField}: "${valueToNormalizeBy}"`,
    );
  }
}

module.exports = normalizeClassBreaks;
