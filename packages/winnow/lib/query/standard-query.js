const _ = require('lodash')
const { filterAndTransform } = require('../filter-and-transform')
const { params: createSqlParams } = require('../sql-query-builder')
const packageFeatures = require('./package-features')

function standardQuery (features, sqlString, options = {}) {
  const { limit } = options
  const params = createSqlParams(features, options)
  const filtered = filterAndTransform(sqlString, params)

  if (options.skipLimitHandling || !options.limit) {
    return packageFeatures(filtered, options)
  }

  // options.limit is incremented by one in normalizeOptions.js; if filtered.length === options.limit, original limit option has been exceeded
  const limitExceeded = filtered.length === limit

  if (limitExceeded) {
    return conformToLimit(filtered, options)
  }

  return packageFeatures(filtered, options)
}

function conformToLimit (features, options) {
  // Pop off the last feature, so that feature array length is consistent with original limit option
  features.pop()

  if (options.collection) _.set(options, 'collection.metadata.limitExceeded', true)
  return packageFeatures(features, options)
}

module.exports = standardQuery
