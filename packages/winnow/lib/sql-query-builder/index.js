const createWhereClause = require('./where')
const createSelectSql = require('./select')
const Order = require('./order')
const GroupBy = require('./groupBy')

function create (options) {
  let baseSqlStatement = createSelectSql(options)
  const whereClause = createWhereClause(options)
  const order = Order.createClause(options)
  const groupBy = GroupBy.createClause(options)
  baseSqlStatement = `${baseSqlStatement}${whereClause}`

  // if (options.aggregates) return query
  if (options.groupBy && groupBy) baseSqlStatement += groupBy
  if (options.order || options.orderByFields) baseSqlStatement += order
  if (options.limit) baseSqlStatement += ` LIMIT ${options.limit}`
  if (options.offset) baseSqlStatement += ` OFFSET ${options.offset}` // handled in execute-query.js
  return baseSqlStatement
}

function params (features, options) {
  const params = []
  // NOTE: order matters here
  // Fields stage
  if (options.projection && !options.aggregates) params.push(options.projection)
  if (options.geometryPrecision) params.push(options.geometryPrecision)
  // From stage
  params.push(Array.isArray(features) ? features : [features])
  // Where stage
  if (options.geometry) params.push(options.geometry)
  return params
}

module.exports = { create, params }
