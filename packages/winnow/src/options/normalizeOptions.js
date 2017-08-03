const _ = require('lodash')
const convertFromEsri = require('../geometry/convert-from-esri')
const transformArray = require('../geometry/transform-array')
const transformEnvelope = require('../geometry/transform-envelope')
const projectCoordinates = require('../geometry/project-coordinates')
const detectFieldsType = require('../detect-fields-type')
const esriPredicates = {
  esriSpatialRelContains: 'ST_Contains',
  esriSpatialRelWithin: 'ST_Within',
  esriSpatialRelIntersects: 'ST_Intersects'
}

function normalizeCollection (options, features = []) {
  if (!options.collection) return undefined
  const collection = _.cloneDeep(options.collection)
  const metadata = collection.metadata || {}
  if (!metadata.fields && features[0]) metadata.fields = detectFieldsType(features[0].properties)
  let oidField
  if (features[0]) {
    oidField = Object.keys(features[0].properties).filter(key => {
      return /objectid/i.test(key)
    })[0]
  }
  if (oidField && !metadata.idField) metadata.idField = oidField
  collection.metadata = metadata
  return collection
}

function normalizeDateFields (collection) {
  let dateFields = []
  if (collection && collection.metadata && collection.metadata.fields) {
    collection.metadata.fields.forEach((field, i) => {
      if (field.type === 'Date') dateFields.push(field.name)
    })
  }
  return dateFields
}

function normalizeSpatialPredicate (options) {
  const predicate = options.spatialPredicate || options.spatialRel
  return esriPredicates[predicate] || predicate
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
  if (inSR) geometry.coordinates = projectCoordinates(geometry.coordinates, { inSR, outSR: 'EPSG:4326' })
  return geometry
}

function normalizeInSR (options) {
  let SR
  if (options.inSR) SR = options.inSR
  else if (options.geometry.spatialReference) {
    if (/WGS_1984_Web_Mercator_Auxiliary_Sphere/.test(options.geometry.spatialReference.wkt)) {
      SR = 3857
    } else {
      SR = options.geometry.spatialReference.latestWkid || options.geometry.spatialReference.wkid
    }
  }

  if (SR === 102100) return `EPSG:3857`
  else if (SR) return `EPSG:${SR}`
  else return 'EPSG:4326'
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

module.exports = {
  normalizeCollection,
  normalizeDateFields,
  normalizeSpatialPredicate,
  normalizeLimit,
  normalizeGeometry,
  normalizeOffset,
  normalizeProjection
}
