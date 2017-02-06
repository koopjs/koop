'use strict'
const Geometry = require('./geometry')
const Where = require('./where')
const Select = require('./select')
const Order = require('./order')

function create (options) {
  let query = Select.createClause(options)
  const where = Where.createClause(options)
  const geomFilter = Geometry.createClause(options)
  const order = Order.createClause(options)
  if (options.where || options.geometry) query += ' WHERE '
  if (options.where) query += where
  if (options.geometry && !where) query += geomFilter
  if (options.geometry && where) query += ` AND ${geomFilter}`
  if (options.order || options.orderByFields) query += order
  if (options.limit) query += ` LIMIT ${options.limit}`
  if (options.offset) query += ` OFFSET ${options.offset}`
  return query
}

function params (features, geometry) {
  const params = Array.isArray(features) ? [features] : [[features]]
  if (geometry) params.push(geometry)
  return params
}

module.exports = {create, params}
