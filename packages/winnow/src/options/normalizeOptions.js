const _ = require('lodash')
const projCodes = require('@esri/proj-codes')
const convertFromEsri = require('../geometry/convert-from-esri')
const transformArray = require('../geometry/transform-array')
const transformEnvelope = require('../geometry/transform-envelope')
const projectCoordinates = require('../geometry/project-coordinates')
const detectFieldsType = require('../detect-fields-type')
const esriPredicates = {
  esriSpatialRelContains: 'ST_Contains',
  esriSpatialRelWithin: 'ST_Within',
  esriSpatialRelIntersects: 'ST_Intersects',
  esriSpatialRelEnvelopeIntersects: 'ST_EnvelopeIntersects'
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

/**
 * Normalize the input spatial reference. Look on options.geometry object first.  If spatial reference not present, look in options.inSR
 * @param {object} options options object that may or may not have "geometry" and "inSR" properties
 * @returns {string} formatted string, "EPSG:<wkid>"
 */
function normalizeInSR (options) {
  let spatialReference
  // Look for in geometry option's spatial reference
  if (_.has(options, 'geometry.spatialReference')) {
    if (/WGS_1984_Web_Mercator_Auxiliary_Sphere/.test(options.geometry.spatialReference.wkt)) {
      spatialReference = 3857
    } else spatialReference = options.geometry.spatialReference.latestWkid || options.geometry.spatialReference.wkid
    // Validate spatial refernce
  } else if (options) {
    // test for EPSG string format
    if (/EPSG:/.test(options.inSR)) spatialReference = options.inSR.match(/EPSG:(.*)/)[1]
    // inSR may be an object with wkid or latestWkid properties
    else if (_.isPlainObject(options.inSR)) spatialReference = options.inSR.latestWkid || options.inSR.wkid
    else spatialReference = options.inSR
  }

  // Undefined spatial reference defaults to 4326
  if (!spatialReference) return 'EPSG:4326'
  // Special handling for 102100
  if (spatialReference === 102100) return 'EPSG:3857'
  // Validate any other submitted spatial reference.
  if (projCodes.lookup(spatialReference)) return `EPSG:${spatialReference}`
  else {
    console.warn(`WARNING: input spatialReference "${spatialReference}" is invalid. Defaulting to 4326.`)
    return 'EPSG:4326'
  }
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
  normalizeProjection,
  normalizeInSR
}
