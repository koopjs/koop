const { within, contains, intersects, envelopeIntersects, hashedObjectIdComparator } = require('./filters')
const createIntHash = require('./helpers/create-integer-hash')
const convertToEsri = require('../geometry/convert-to-esri')
const sql = require('alasql')
const geohash = require('ngeohash')
const centroid = require('@turf/centroid').default
const _ = require('lodash')
const projectCoordinates = require('../geometry/project-coordinates')
const reducePrecision = require('../geometry/reduce-precision')

sql.MAXSQLCACHESIZE = 0

sql.fn.ST_Within = within

sql.fn.ST_Contains = contains

sql.fn.ST_Intersects = intersects

sql.fn.ST_EnvelopeIntersects = envelopeIntersects

sql.fn.hashedObjectIdComparator = hashedObjectIdComparator

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
 * Select a subset of properties and modify properties to fit ESRI specs
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
      const value = properties[field]
      properties[field] = value === null ? null : new Date(value).getTime()
    })
  }

  // If the object ID is not needed, return here
  if (requiresObjectId === 'false') return properties

  // Coerce idField
  idField = (idField === 'null') ? null : idField

  // If the idField for the model set use its value as OBJECTID
  if (idField) {
    if (process.env.NODE_ENV !== 'production' && process.env.KOOP_WARNINGS !== 'suppress' && (!Number.isInteger(properties[idField]) || properties[idField] > 2147483647)) {
      console.warn(`WARNING: OBJECTIDs created from provider's "idField" (${idField}: ${properties[idField]}) are not integers from 0 to 2147483647`)
    }
  } else {
    // Create an OBJECTID by creating a numeric hash from the stringified feature
    // Note possibility of OBJECTID collisions with this method still exists, but should be small
    properties.OBJECTID = createIntHash(JSON.stringify({ properties, geometry }))
  }
  return properties
}

module.exports = sql
