const _ = require('lodash')
const {
  normalizeWhere,
  normalizeFields,
  normalizeOrder,
  normalizeAggregates,
  normalizeGroupBy } = require('./normalizeSQL')
const {
  normalizeCollection,
  normalizeDateFields,
  normalizeSpatialPredicate,
  normalizeLimit,
  normalizeGeometry,
  normalizeOffset,
  normalizeProjection

} = require('./normalizeOptions')
const { normalizeClassification } = require('./normalizeClassification')

function prepare (options, features) {
  const prepared = _.merge({}, options, {
    collection: normalizeCollection(options, features),
    where: normalizeWhere(options),
    geometry: normalizeGeometry(options),
    spatialPredicate: normalizeSpatialPredicate(options),
    fields: normalizeFields(options),
    order: normalizeOrder(options),
    aggregates: normalizeAggregates(options),
    groupBy: normalizeGroupBy(options),
    limit: normalizeLimit(options),
    projection: normalizeProjection(options),
    classification: normalizeClassification(options)
  })
  prepared.offset = normalizeOffset(options)
  prepared.dateFields = normalizeDateFields(prepared.collection, prepared.fields)
  prepared.idField = _.get(prepared.collection, 'metadata.idField') || null
  if (prepared.where === '1=1') delete prepared.where

  return prepared
}

module.exports = { prepare }
