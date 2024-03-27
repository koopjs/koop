const _ = require('lodash');
const { filterAndTransform } = require('../filter-and-transform');
const { params: createSqlParams } = require('../sql-query-builder');
const packageFeatures = require('./package-features');

function standardQuery(features, sqlString, options = {}) {
  const { limit } = options;
  const params = createSqlParams(features, options);
  const filtered = filterAndTransform(sqlString, params);

  // 1) For GeoService API queries there is always a limit
  // 2) options.limit is incremented by one in normalizeOptions.js; if filtered.length === options.limit, original limit option has been exceeded
  if (options.skipLimitHandling || !limit || filtered.length !== limit) {
    return packageFeatures(filtered, options);
  }

  modifyForLimit(filtered, options);

  return packageFeatures(filtered, options);
}

function modifyForLimit(features, options) {
  // Pop off the last feature, so that feature array length is consistent with original limit option
  features.pop();

  if (options.collection) {
    _.set(options, 'collection.metadata.exceededTransferLimit', true);
  }
}

module.exports = standardQuery;
