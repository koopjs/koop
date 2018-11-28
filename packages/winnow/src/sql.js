const Terraformer = require('terraformer')
const transformArray = require('./geometry/transform-array')
const convertToEsri = require('./geometry/convert-to-esri')
const convertFromEsri = require('./geometry/convert-from-esri')
const sql = require('alasql')
const geohash = require('ngeohash')
const centroid = require('@turf/centroid')
const _ = require('lodash')
const projectCoordinates = require('./geometry/project-coordinates')
const reducePrecision = require('./geometry/reduce-precision')

// Try to require farmhash, as it is an optional depenecy we can fall back to JavaScript only hashing library
let hashFunction
try {
  hashFunction = require('farmhash').hash32
} catch (e) {
  hashFunction = require('string-hash')
}

sql.MAXSQLCACHESIZE = 0

sql.fn.ST_Within = function (feature = {}, filterGeom = {}) {
  if (!(feature && feature.type && feature.coordinates && feature.coordinates.length > 0)) return false
  const filter = new Terraformer.Primitive(filterGeom)
  const TfFeature = new Terraformer.Primitive(feature)
  return filter.within(TfFeature)
}

sql.fn.ST_Contains = function (feature = {}, filterGeom = {}) {
  if (!(feature && feature.type && feature.coordinates && feature.coordinates.length > 0)) return false
  const filter = new Terraformer.Primitive(filterGeom)
  const TfFeature = new Terraformer.Primitive(feature)
  return filter.contains(TfFeature)
}

sql.fn.ST_Intersects = function (feature = {}, filterGeom = {}) {
  if (!feature) return false
  if (!(feature.type || feature.coordinates)) feature = convertFromEsri(feature) // TODO: remove ? temporary esri geometry conversion
  if (!(feature.type && feature.coordinates && feature.coordinates.length > 0)) return false
  if (feature.type === 'Point') return sql.fn.ST_Contains(feature, filterGeom)
  const filter = new Terraformer.Primitive(filterGeom)
  const TfFeature = new Terraformer.Primitive(feature)
  return filter.intersects(TfFeature)
}

sql.fn.ST_EnvelopeIntersects = function (feature = {}, filterGeom = {}) {
  if (!feature) return false
  if (!(feature.type || feature.coordinates)) feature = convertFromEsri(feature) // TODO: remove ? temporary esri geometry conversion
  if (!(feature.type && feature.coordinates && feature.coordinates.length > 0)) return false
  if (feature.type === 'Point') return sql.fn.ST_Contains(feature, filterGeom)
  const filter = new Terraformer.Primitive(filterGeom)
  const envelope = transformArray(new Terraformer.Primitive(feature).bbox())
  const TfFeature = new Terraformer.Polygon(envelope)
  return filter.intersects(TfFeature)
}

sql.fn.geohash = function (geometry = {}, precision) {
  if (!geometry || !geometry.type || !geometry.coordinates) return
  precision = precision || 8
  if (geometry.type !== 'Point') geometry = centroid(geometry).geometry
  const pnt = geometry.coordinates
  return geohash.encode(pnt[1], pnt[0], precision)
}

sql.fn.pick = function (properties, fields) {
  const parsedFields = fields.split(',')
  return _.pick(properties, parsedFields)
}

/**
 * Select a subset of properties and modify propterties to fit ESRI specs
 * @param {object} properties GeoJSON properties
 * @param {object} geometry GeoJSON geometry
 * @param {string} dateFields comma-delimited list of date fields
 * @param {string} requiresObjectId boolean-string flagging requirement of OBJECTID as part of properties
 * @param {string} idField name of attribute to be used as OBJECTID
 */
sql.fn.pickAndEsriFy = function (properties, geometry, fields, dateFields, requiresObjectId, idField) {
  const parsedFields = fields.split(',')
  const esriProperties = esriFy(properties, geometry, dateFields, requiresObjectId, idField)
  return _.pick(esriProperties, parsedFields)
}

sql.fn.esriFy = esriFy

sql.fn.esriGeom = function (geometry) {
  if (geometry && geometry.type) {
    return convertToEsri(geometry)
  }
}

sql.fn.project = function (geometry, projection) {
  if (!(geometry && geometry.coordinates) || !projection) return geometry
  try {
    return {
      type: geometry.type,
      coordinates: projectCoordinates(geometry.coordinates, { toSR: projection })
    }
  } catch (e) {
    return null
  }
}

sql.fn.reducePrecision = function (geometry, precision) {
  if (!(geometry && geometry.coordinates)) return geometry
  return {
    type: geometry.type,
    coordinates: reducePrecision(geometry.coordinates, precision)
  }
}

sql.aggr.hash = function (value, obj, acc) {
  obj = obj || {}
  if (obj[value]) obj[value]++
  else obj[value] = 1
  return obj
}

/**
 * Modify propterties to fit ESRI specs
 * @param {object} properties GeoJSON properties
 * @param {object} geometry GeoJSON geometry
 * @param {string} dateFields comma-delimited list of date fields
 * @param {string} requiresObjectId boolean-string flagging requirement of OBJECTID as part of properties
 * @param {string} idField name of attribute to be used as OBJECTID
 */
function esriFy (properties, geometry, dateFields, requiresObjectId, idField) {
  const parsedDateFields = (dateFields.length === 0) ? [] : dateFields.split(',')
  if (parsedDateFields.length) {
    parsedDateFields.forEach(field => {
      properties[field] = new Date(properties[field]).getTime()
    })
  }

  // If the object ID is not needed, return here
  if (requiresObjectId === 'false') return properties

  // Coerce idField
  idField = (idField === 'null') ? null : idField

  // If the idField for the model set use its value as OBJECTID
  if (idField) {
    if (process.env.NODE_ENV !== 'production' && process.env.KOOP_WARNINGS !== 'suppress' && (!Number.isInteger(properties[idField]) || properties[idField] > 2147483647)) {
      console.warn(`WARNING: OBJECTIDs created from provider's "idField" are not integers from 0 to 2147483647`)
    }
  } else {
    // Create an OBJECTID by creating a numeric hash from the stringified feature
    // Note possibility of OBJECTID collisions with this method still exists, but should be small
    properties.OBJECTID = createIntHash(JSON.stringify({ properties, geometry }))
  }
  return properties
}

/**
 * Create integer hash in range of 0 - 2147483647 from string
 * @param {*} inputStr - any string
 */
function createIntHash (inputStr) {
  // Hash to 32 bit unsigned integer
  const hash = hashFunction(inputStr)
  // Normalize to range of postive values of signed integer
  return Math.round((hash / 4294967295) * (2147483647))
}
module.exports = sql
