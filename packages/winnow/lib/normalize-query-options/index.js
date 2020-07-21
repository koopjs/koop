const _ = require('lodash')
const normalizeWhere = require('./where')
const normalizeFields = require('./fields')
const normalizeOrder = require('./order')
const normalizeAggregates = require('./aggregates')
const normalizeGroupBy = require('./group-by')

const {
  normalizeCollection,
  normalizeDateFields,
  normalizeSpatialPredicate,
  normalizeLimit,
  normalizeGeometry,
  normalizeOffset,
  normalizeProjection,
  normalizeIdField

} = require('./normalizeOptions')
const { normalizeClassification } = require('./normalizeClassification')

function normalizeQueryOptions (options, features) {
  const {
    where
  } = options
  const prepared = _.merge({}, options, {
    collection: normalizeCollection(options, features),
    idField: normalizeIdField(options, features),
    where: normalizeWhere(where),
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

  return prepared
}

module.exports = normalizeQueryOptions
