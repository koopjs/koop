const _ = require('lodash')
const convertFromEsri = require('../geometry/convert-from-esri')
const transformArray = require('../geometry/transform-array')
const transformEnvelope = require('../geometry/transform-envelope')
const projectCoordinates = require('../geometry/project-coordinates')
const normalizeGeometrySpatialReference = require('./geometry-filter-spatial-reference')
const normalizeSourceSR = require('./source-data-spatial-reference')

function normalizeGeometry (options) {
  let geometry = options.geometry || options.bbox
  if (!geometry) return // ABORT
  let bboxCRS
  if (typeof geometry === 'string') {
    const split = geometry.split(',')
    geometry = split.slice(0, 4).map(parseFloat)
    bboxCRS = split[4]
  }
  if (Array.isArray(geometry)) {
    geometry = transformArray(geometry)
  } else if (geometry.xmin || geometry.xmin === 0) {
    geometry = transformEnvelope(geometry)
  } else if (geometry.x || geometry.rings || geometry.paths || geometry.points) {
    geometry = convertFromEsri(geometry)
  }
  const inSR = normalizeGeometrySpatialReference(options)
  const geometryFilterSR = bboxCRS || inSR
  const sourceSR = normalizeSourceSR(options.sourceSR)
  if (inSR) geometry.coordinates = projectCoordinates(geometry.coordinates, { fromSR: geometryFilterSR, toSR: sourceSR })
  return geometry
}

/**
 * Normalize the limit option; defaults to undefined
 * @param {object} options
 * @returns {integer} or undefined
 */
function normalizeLimit (options) {
  const limit = options.limit || options.resultRecordCount || options.count || options.maxFeatures
  // If there is a limit, add 1 to it so we can later calculate a limitExceeded. The result set will be resized accordingly, post SQL
  if (limit) return limit + 1
}

/**
 * Normalize the offset option. If no limit is defined, then return offset as undefined. ala-sql
 * requires OFFSET to be paired with a LIMIT
 * @param {object} options
 * @returns {integer} or undefined
 */
function normalizeOffset (options) {
  return (options.limit) ? (options.offset || options.resultOffset) : undefined
}

/**
 * Ensure idField is set if metadata doesn't have a value but a field named OBJECTID is present
 * @param {object} metadata
 */
function normalizeIdField (options, features = []) {
  const collection = options.collection || {}
  const metadata = collection.metadata || {}
  const feature = features[0] || {}
  const featureProperties = feature.properties || feature.attributes || {}
  let idField = null

  // First, check metadata for idField
  if (metadata.idField) idField = metadata.idField

  // Check metadata.fields for and OBJECTID property
  else if (_.find(metadata.fields, { name: 'OBJECTID' })) idField = 'OBJECTID'
  // Check features for an OBJECTID property that is not null
  else if (features.length > 0 && !_.isUndefined(featureProperties.OBJECTID) && !_.isNull(featureProperties.OBJECTID)) idField = 'OBJECTID'

  // If there are features, check that the idField is one of the properties
  if (process.env.NODE_ENV !== 'production' && process.env.KOOP_WARNINGS !== 'suppress' && idField && features.length > 0 && !featureProperties[idField]) {
    console.warn('WARNING: requested provider has "idField" assignment, but this property is not found in properties of all features.')
  }

  return idField
}

module.exports = {
  normalizeLimit,
  normalizeGeometry,
  normalizeOffset,
  normalizeIdField
}
