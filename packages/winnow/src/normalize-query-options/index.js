const _ = require('lodash');
const normalizeWhere = require('./where');
const normalizeFields = require('./fields');
const normalizeOrder = require('./order');
const normalizeAggregates = require('./aggregates');
const normalizeGroupBy = require('./group-by');
const normalizeClassification = require('./classification');
const normalizeCollection = require('./collection');
const deriveDateFields = require('./date-fields');
const normalizeSpatialPredicate = require('./spatial-predicate');
const normalizeOutputDataSpatialReference = require('./output-data-spatial-reference');
const normalizeSourceDataSpatialReference = require('./source-data-spatial-reference');
const normalizeGeometryFilter = require('./geometry-filter');
const normalizeIdField = require('./id-field');
const normalizeLimit = require('./limit');
const normalizeOffset = require('./offset');
const normalizeObjectIds = require('./object-ids');

function normalizeQueryOptions (options, features) {
  const {
    where,
    collection
  } = options;

  const normalizedOptions = _.merge({}, options, {
    collection: normalizeCollection(collection, features),
    idField: normalizeIdField(options, features),
    where: normalizeWhere(where),
    geometry: normalizeGeometryFilter(options),
    spatialPredicate: normalizeSpatialPredicate(options),
    fields: normalizeFields(options),
    order: normalizeOrder(options),
    aggregates: normalizeAggregates(options),
    groupBy: normalizeGroupBy(options),
    limit: normalizeLimit(options),
    outputCrs: normalizeOutputDataSpatialReference(options),
    inputCrs: normalizeSourceDataSpatialReference(options),
    classification: normalizeClassification(options),
    objectIds: normalizeObjectIds(options.objectIds)
  });
  normalizedOptions.offset = normalizeOffset(normalizedOptions);
  normalizedOptions.dateFields = deriveDateFields(normalizedOptions.collection, normalizedOptions.fields);

  return normalizedOptions;
}

module.exports = normalizeQueryOptions;
