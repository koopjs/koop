const _ = require('lodash')
const sql = require('./alasql')
const Query = require('./sql-query')
const normalizeQueryOptions = require('./normalize-query-options')
const { finishQuery } = require('./executeQuery')

module.exports = function (options) {
  options = normalizeQueryOptions(options)
  const statement = Query.create(options)
  const query = sql.compile(statement)
  const params = [null]
  if (options.projection) params.push(options.projection)
  if (options.geometryPrecision) params.push(options.geometryPrecision)
  if (options.geometry) params.push(options.geometry)

  return function (input) {
    /* Prepared queries can take either a collection object,
     a feature array, or a single feature.
     So detection is a little more complex */
    let features
    if (input.features) {
      options.collection = _.omit(input, 'features')
      features = input.features
    } else if (input.length) {
      features = input
    } else {
      // coerce to an array if this is a single feature
      features = [input]
    }
    params[0] = features
    const filtered = query(params)
    return finishQuery(filtered, options)
  }
}
