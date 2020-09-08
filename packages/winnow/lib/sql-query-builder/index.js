'use strict'
const Geometry = require('../geometry')
const Where = require('./where')
const Select = require('./select')
const Order = require('./order')
const GroupBy = require('./groupBy')

function create (options) {
  let query = Select.createClause(options)
  const where = Where.createClause(options)
  const geomFilter = Geometry.createClause(options)
  const order = Order.createClause(options)
  const groupBy = GroupBy.createClause(options)
  if (options.where || options.geometry) query += ' WHERE '
  if (options.where) query += where
  if (options.geometry && !where) query += geomFilter
  if (options.geometry && where) query += ` AND ${geomFilter}`
  // if (options.aggregates) return query
  if (options.groupBy && groupBy) query += groupBy
  if (options.order || options.orderByFields) query += order
  if (options.limit) query += ` LIMIT ${options.limit}`
  if (options.offset) query += ` OFFSET ${options.offset}` // handled in execute-query.js
  return query
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
