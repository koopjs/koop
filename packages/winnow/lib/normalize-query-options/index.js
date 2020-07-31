const _ = require('lodash')
const normalizeWhere = require('./where')
const normalizeFields = require('./fields')
const normalizeOrder = require('./order')
const normalizeAggregates = require('./aggregates')
const normalizeGroupBy = require('./group-by')
const normalizeClassification = require('./classification')
const normalizeCollection = require('./collection')
const deriveDateFields = require('./date-fields')
const normalizeSpatialPredicate = require('./spatial-predicate')
const normalizeOutputDataSpatialReference = require('./output-data-spatial-reference')

const {
  normalizeLimit,
  normalizeGeometry,
  normalizeOffset,
  normalizeIdField
} = require('./normalizeOptions')

function normalizeQueryOptions (options, features) {
  const {
    where,
    collection
  } = options
  const prepared = _.merge({}, options, {
    collection: normalizeCollection(collection, features),
    idField: normalizeIdField(options, features),
    where: normalizeWhere(where),
    geometry: normalizeGeometry(options),
    spatialPredicate: normalizeSpatialPredicate(options),
    fields: normalizeFields(options),
    order: normalizeOrder(options),
    aggregates: normalizeAggregates(options),
    groupBy: normalizeGroupBy(options),
    limit: normalizeLimit(options),
    projection: normalizeOutputDataSpatialReference(options),
    classification: normalizeClassification(options)
  })
  prepared.offset = normalizeOffset(options)
  prepared.dateFields = deriveDateFields(prepared.collection, prepared.fields)

  return prepared
}

module.exports = normalizeQueryOptions
