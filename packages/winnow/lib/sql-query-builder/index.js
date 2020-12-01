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

function params (features, { sourceDataCoordinateSystem, projection, aggregates, geometry, geometryPrecision }) {
  const params = []
  // NOTE: order matters here
  // select fragment: transform function parameters here
  if (projection && !aggregates) params.push(sourceDataCoordinateSystem, projection)
  if (geometryPrecision) params.push(geometryPrecision)
  // from fragment: features parameter here
  params.push(Array.isArray(features) ? features : [features])
  // where fragment: geometry filter parameter here
  if (geometry) params.push(geometry)
  return params
}

module.exports = { create, params }
