const transformEnvelope = require('./geometry/transform-envelope')

const esriPredicates = {
  esriSpatialRelContains: 'ST_Contains',
  esriSpatialRelWithin: 'ST_Within',
  esriSpatialRelIntersects: 'ST_Intersects'
}

function prepare (options) {
  return {
    where: normalizeWhere(options),
    geometry: normalizeGeometry(options),
    spatialPredicate: normalizeSpatialPredicate(options),
    fields: normalizeFields(options),
    order: normalizeOrder(options),
    aggregates: normalizeAggregates(options),
    groupBy: normalizeGroupBy(options),
    limit: normalizeLimit(options),
    offset: normalizeOffset(options),
    projection: normalizeProjection(options),
    esri: options.esri,
    toEsri: options.toEsri,
    collection: options.collection
  }
}

function normalizeWhere (options) {
  if (/1\s*=\s*1/.test(options.where)) return undefined
  else return options.where
}

function normalizeSpatialPredicate (options) {
  const predicate = options.spatialPredicate || options.spatialRel

  return esriPredicates[predicate] || predicate
}

function normalizeFields (options) {
  const fields = options.fields || options.outFields
  if (fields === '*') return undefined
  return typeof fields === 'string' ? [fields] : fields
}

function normalizeOrder (options) {
  const order = options.order || options.orderByFields
  return typeof order === 'string' ? [order] : order
}

function normalizeAggregates (options) {
  let aggregates = options.aggregates
  if (options.outStatistics) {
    aggregates = options.outStatistics.map((agg) => {
      return {
        type: agg.statisticType,
        field: agg.onStatisticField,
        name: agg.outStatisticFieldName
      }
    })
  }

  if (aggregates) {
    aggregates.forEach(agg => {
      if (!agg.name) agg.name = `${agg.type}_${agg.field}`
      agg.name = agg.name.replace(/\s/g, '_')
    })
  }

  return aggregates
}

function normalizeGroupBy (options) {
  const groupBy = options.groupBy || options.groupByFieldsForStatistics
  return typeof groupBy === 'string' ? [groupBy] : groupBy
}

function normalizeGeometry (options) {
  if (!options.geometry) return
  const geom = options.geometry
  const geometry = (geom.xmin && geom.ymax) ? transformEnvelope(geom) : geom
  return geometry
}

function normalizeLimit (options) {
  return options.limit || options.resultRecordCount
}

function normalizeOffset (options) {
  return options.offset || options.resultOffset
}

function normalizeProjection (options) {
  let projection
  if (options.projection) {
    projection = options.projection
  } else if (options.outSR) {
    projection = options.outSR.latestWkid || options.outSR.wkid || options.outSR.wkt
  }
  // Support the old esri code for web mercator
  if (projection === 102100) return `EPSG:3857`
  if (typeof projection !== 'number') return projection
  else return `EPSG:${projection}`
}

module.exports = { prepare }
