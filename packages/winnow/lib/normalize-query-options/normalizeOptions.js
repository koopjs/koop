const _ = require('lodash')
const wktParser = require('wkt-parser')
const esriProjCodes = require('@esri/proj-codes')
const convertFromEsri = require('../geometry/convert-from-esri')
const transformArray = require('../geometry/transform-array')
const transformEnvelope = require('../geometry/transform-envelope')
const projectCoordinates = require('../geometry/project-coordinates')
const esriPredicates = {
  esriSpatialRelContains: 'ST_Contains',
  esriSpatialRelWithin: 'ST_Within',
  esriSpatialRelIntersects: 'ST_Intersects',
  esriSpatialRelEnvelopeIntersects: 'ST_EnvelopeIntersects'
}
const wkidLookup = {}

/**
 * Identify Date-type fields and explicitly add to dateFields array if outFields query param contains
 * the date field name or if outFields is a wildcard (when outFields=*, preparedFields === undefined)
 *
 * @param {Object} collection metadata about the data source
 * @param String[] preparedFields - single element string array of delimited field names from "outFields" query param
 */
function normalizeDateFields (collection, preparedFields) {
  const dateFields = []
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
  return 'EPSG:4326'
}

/**
 * Normalize source data spatial reference; defaults to EPSG:4326
 * @param {*} input
 * @returns {string} EPSG:<wkid> or srs WKT; defaults to EPSG:4326
 */
function normalizeSourceSR (input) {
  const spatialReference = normalizeSR(input)
  if (spatialReference) return ((spatialReference.wkid) ? `EPSG:${spatialReference.wkid}` : spatialReference.wkt)
  if (process.env.NODE_ENV !== 'production' && process.env.KOOP_WARNINGS !== 'suppress' && input && !spatialReference) {
    console.log(`WARNING: spatial reference "${input}" could not be normalized. Defaulting to EPSG:4326.`)
  }
  return 'EPSG:4326'
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

  // If here, WKID is not known to proj4, so we need its WKT spatial reference in order to do downstream reprojections.  First check in local lookup
  let wkt = wkidLookup[inputWkid]
  if (wkt) return { wkt }

  // If the wkid was not found in the local lookup, check the Esri lookups
  const esriResult = esriProjCodes.lookup(inputWkid)
  if (esriResult) {
    // Add the WKT to the local lookup so we don't need to scan the Esri lookups next time (we have a local lookup, because it will contain a smaller set of wkids than the Esri lookups)
    wkidLookup[inputWkid] = esriResult.wkt
    return { wkt: esriResult.wkt }
  }

  // If here and the inputWkid is defined without a wkt, the input was an unknown wkid without a wkt
  if (inputWkid && !input.wkt && process.env.NODE_ENV !== 'production') {
    console.log(`WARNING: An unknown spatial reference was detected: ${input}`)
  }

  // Input may already be or include a WKT spatial reference
  wkt = input.wkt || input

  // If wkt includes 'WGS_1984_Web_Mercator_Auxiliary_Sphere' return wkid 3857
  if (/WGS_1984_Web_Mercator_Auxiliary_Sphere/.test(wkt)) return { wkid: 3857 }

  try {
    wktParser(wkt)
    return { wkt }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`WARNING: An un-parseable WKT spatial reference was detected: ${wkt}`)
    }
  }
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
  normalizeDateFields,
  normalizeSpatialPredicate,
  normalizeLimit,
  normalizeGeometry,
  normalizeOffset,
  normalizeProjection,
  normalizeSR,
  normalizeInSR,
  normalizeSourceSR,
  normalizeIdField
}
