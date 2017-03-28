const proj4 = require('proj4')
const convertFromEsri = require('./geometry/convertFromEsri')
const transformArray = require('./geometry/transform-array')
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
    esriFields: options.esriFields,
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
  let geometry = options.geometry
  if (typeof geometry === 'string') {
    geometry = geometry.split(',').map(parseFloat)
  }
  if (Array.isArray(geometry)) {
    geometry = transformArray(geometry)
  } else if (geometry.xmin) {
    geometry = transformEnvelope(geometry)
  } else if (geometry.x || geometry.rings || geometry.paths || geometry.points) {
    geometry = convertFromEsri(geometry)
  }
  const inSR = normalizeInSR(options)
  if (inSR) geometry.coordinates = projectCoordinates(inSR, geometry.coordinates)
  return geometry
}

function normalizeInSR (options) {
  if (options.inSR) {
    return options.inSR
  } else if (options.geometry.spatialReference) {
    return options.geometry.spatialReference.latestWkid || options.geometry.spatialReference.wkid
  }
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
    projection = options.outSR.latestWkid || options.outSR.wkid || options.outSR.wkt || options.outSR
  }
  // Support the old esri code for web mercator
  if (projection === 102100) return 'EPSG:3857'
  if (typeof projection !== 'number') return projection
  else return `EPSG:${projection}`
}

function projectCoordinates (inSR, coordinates) {
  if (inSR === 102100) inSR = 3857
  if (Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0])) return coordinates.map(a => { return projectCoordinates(inSR, a) })
  else if (Array.isArray(coordinates[0]) && typeof coordinates[0][0] === 'number') return coordinates.map(a => { return projectCoordinates(inSR, a) })
  else return proj4(`EPSG:${inSR}`, 'EPSG:4326', coordinates)
}

module.exports = { prepare }
