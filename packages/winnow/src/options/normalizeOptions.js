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

/**
 * Identify Date-type fields and explicitly add to dateFields array if outFields query param contains
 * the date field name or if outFields is a wildcard (when outFields=*, preparedFields === undefined)
 *
 * @param {Object} collection metadata about the data source
 * @param String[] preparedFields - single element string array of delimited field names from "outFields" query param
 */
function normalizeDateFields (collection, preparedFields) {
  let dateFields = []
  if (collection && collection.metadata && collection.metadata.fields) {
    collection.metadata.fields.forEach((field, i) => {
      // If field is a Date and was included in requested fields (or requested fields are wildcard) add to array
      if (field.type === 'Date' && (preparedFields === undefined || preparedFields.indexOf(field.name) > -1)) {
        dateFields.push(field.name)
      }
    })
  }
  return dateFields
}

function normalizeSpatialPredicate (options) {
  const predicate = options.spatialPredicate || options.spatialRel
  return esriPredicates[predicate] || predicate
}

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
  const inSR = bboxCRS || normalizeInSR(options)
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

  if (/EPSG:/.test(SR)) return SR
  else if (SR === 102100) return `EPSG:3857`
  else if (SR) return `EPSG:${SR}`
  else return 'EPSG:4326'
}

function normalizeLimit (options) {
  return options.limit || options.resultRecordCount || options.count || options.maxFeatures
}

function normalizeOffset (options) {
  return options.offset || options.resultOffset
}

function normalizeProjection (options) {
  let projection
  // WFS :)
  if (options.srsname || options.srsName) return options.srsname || options.srsName
  // Winnow native
  if (options.projection) {
    projection = options.projection
  // GeoServices
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
