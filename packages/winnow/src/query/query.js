const {
  create: createSqlStatement
} = require('../sql-query-builder');
const normalizeQueryOptions = require('../normalize-query-options');
const normalizeQueryInput = require('./normalize-query-input');
const classificationQuery = require('./classification-query');
const standardQuery = require('./standard-query');

module.exports = function (input, options = {}) {
  const { options: normalizedOptions, features } = normalizeFeaturesAndOptions(input, options);
  const { aggregates, classification } = normalizedOptions;

  const sqlStatement = createSqlStatement(normalizedOptions);

  if (classification) return classificationQuery(features, sqlStatement, normalizedOptions);

  return standardQuery(features, sqlStatement, {
    skipLimitHandling: !!aggregates,
    ...normalizedOptions
  });
};

function normalizeFeaturesAndOptions (input, options) {
  if (isFeatureCollection(input)) {
    const { collection, features } = decoupleFeatureCollection(input);
    return {
      options: normalizeQueryOptions({ ...options, collection }, features),
      features
    };
  }

  const features = normalizeQueryInput(input);

  return {
    options: normalizeQueryOptions(options, features),
    features
  };
}

function decoupleFeatureCollection ({ features, ...collection }) {
  return { collection, features };
}

function isFeatureCollection (input) {
  return !!input.features;
}
