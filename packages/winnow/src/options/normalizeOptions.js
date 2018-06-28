const _ = require('lodash')
const srs = require('srs')
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
  const inSR = normalizeInSR(options)
  const geometryFilterSR = bboxCRS || inSR
  const sourceSR = normalizeSourceSR(options.sourceSR)
  if (inSR) geometry.coordinates = projectCoordinates(geometry.coordinates, { fromSR: geometryFilterSR, toSR: sourceSR })
  return geometry
}

/**
 * Normalize the input spatial reference for a geometry filter. Look on options.geometry object first.
 * If spatial reference not present, look in options.inSR.  Defaults to EPSG:4326
 * @param {object} options options object that may or may not have "geometry" and "inSR" properties
 * @returns {string} EPSG:<wkid> or srs WKT; defaults to EPSG:4326
 */
function normalizeInSR (options) {
  // Look for geometry option's spatial reference
  let spatialReference
  if (_.has(options, 'geometry.spatialReference')) spatialReference = normalizeSR(options.geometry.spatialReference)
  else spatialReference = normalizeSR(options.inSR)

  if (spatialReference) return ((spatialReference.wkid) ? `EPSG:${spatialReference.wkid}` : spatialReference.wkt)
  return `EPSG:4326`
}

/**
 * Normalize source data spatial reference; defaults to EPSG:4326
 * @param {*} input
 * @returns {string} EPSG:<wkid> or srs WKT; defaults to EPSG:4326
 */
function normalizeSourceSR (input) {
  let spatialReference = normalizeSR(input)
  if (spatialReference) return ((spatialReference.wkid) ? `EPSG:${spatialReference.wkid}` : spatialReference.wkt)
  return `EPSG:4326`
}

/**
 * Normalize a spatial reference object.  Use wkids for spatial references know too proj4, otherwise include the wkt (if available)
 * @param {*} input
 * @returns {object} normalized spatial reference object with wkid or wkt (or undefined)
 */
function normalizeSR (input) {
  // The following WKIDs are known to proj4
  const knownWkids = [4326, 4269, 3857, 3785, 900913, 102113]
  let inputWkid

  // Search input for a wkid
  if (Number.isInteger(input) || Number.isInteger(Number(input))) inputWkid = Number(input)
  else if (/EPSG:/.test(input)) inputWkid = Number(input.match(/EPSG:(.*)/)[1])
  else if (input && (input.latestWkid || input.wkid)) inputWkid = input.latestWkid || input.wkid

  // When required input is undefined, return undefined
  if (!input || (_.isObject(input) && !inputWkid && !input.wkt)) return

  // 102100 is the old code for 3857 but not recognized for proj4
  if (inputWkid === 102100) inputWkid = 3857

  // If the input wkid is one of the set known to proj4, return it in an object
  if (knownWkids.includes(inputWkid)) return { wkid: inputWkid }

  // Input may be or include a WKT spatial reference
  const wkt = input.wkt || input
  try {
    let parsedSRS = srs.parse(wkt)
    if (!parsedSRS.valid) throw new Error('Invalid WKT')
    if (knownWkids.includes(parsedSRS.srid)) return { wkid: parsedSRS.srid }
    return { wkt }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`WARNING: A spatial reference unknown to proj4 was passed without a valid WKT definition`)
    }
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
  normalizeSR,
  normalizeInSR,
  normalizeSourceSR
}
