const createWhereClause = require('./where')
const createSelectSql = require('./select')
const createOrderByClause = require('./order-by')
const createGroupByClause = require('./group-by')

function create (options) {
  const select = createSelectSql(options)
  const where = createWhereClause(options)
  const orderBy = createOrderByClause(options)
  const groupBy = createGroupByClause(options)
  const limit = options.limit ? ` LIMIT ${options.limit}` : ''
  const offset = options.offset ? ` OFFSET ${options.offset}` : ''
  return `${select}${where}${groupBy}${orderBy}${limit}${offset}`
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
