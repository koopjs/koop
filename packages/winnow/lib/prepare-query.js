const _ = require('lodash')
const sql = require('./alasql')
const {
  create: createSqlStatement,
  params: createSqlParams
} = require('./sql-query-builder')
const normalizeQueryOptions = require('./normalize-query-options')
const normalizeQueryInput = require('./normalize-query-input')
const { finishQuery } = require('./execute-query')

module.exports = function (options) {
  const normalizedOptions = normalizeQueryOptions(options)
  const paramsSplicer = prepareParamsSplicer(normalizedOptions)
  const sqlStatement = createSqlStatement(normalizedOptions)
  const query = sql.compile(sqlStatement)

  return function (input) {
    if (input.features) {
      normalizedOptions.collection = _.omit(input, 'features')
    }
    const features = normalizeQueryInput(input)
    const params = paramsSplicer(features)
    const filtered = query(params)
    return finishQuery(filtered, normalizedOptions)
  }
}

function prepareParamsSplicer (options) {
  const params = createSqlParams('$features$', options)
  const featuresIndex = params.findIndex(param => {
    return Array.isArray(param) && param[0] === '$features$'
  })
  return function setFeatures (features) {
    params[featuresIndex] = features
    return params
  }
}
