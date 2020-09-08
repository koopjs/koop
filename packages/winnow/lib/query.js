const _ = require('lodash')
const {
  create: createSqlStatement
} = require('./sql-query-builder')
const normalizeQueryOptions = require('./normalize-query-options')
const normalizeQueryInput = require('./normalize-query-input')
const { breaksQuery, aggregateQuery, standardQuery } = require('./execute-query')

module.exports = function (input, options = {}) {
  if (input.features) {
    options.collection = _.omit(input, 'features')
  }
  const features = normalizeQueryInput(input)
  const normalizedOptions = normalizeQueryOptions(options, features)
  const sqlStatement = createSqlStatement(normalizedOptions)

  if (normalizedOptions.classification) return breaksQuery(features, sqlStatement, normalizedOptions)
  if (normalizedOptions.aggregates) return aggregateQuery(features, sqlStatement, normalizedOptions)
  return standardQuery(features, sqlStatement, normalizedOptions)
}
