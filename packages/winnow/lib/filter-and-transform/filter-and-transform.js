const { within, contains, intersects, envelopeIntersects, hashedObjectIdComparator } = require('./filters')
const convertToEsriGeometry = require('../geometry/convert-to-esri')
const sql = require('alasql')
const _ = require('lodash')
const { project, toGeohash, toEsriAttributes } = require('./transforms')
const reducePrecision = require('../geometry/reduce-precision')

sql.MAXSQLCACHESIZE = 0

sql.fn.ST_Within = within

sql.fn.ST_Contains = contains

sql.fn.ST_Intersects = intersects

sql.fn.ST_EnvelopeIntersects = envelopeIntersects

sql.fn.hashedObjectIdComparator = hashedObjectIdComparator

sql.fn.project = project

sql.fn.geohash = toGeohash

sql.fn.toEsriAttributes = toEsriAttributes

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
sql.fn.pickAndTransformToEsriAttributes = function (properties, geometry, fields, dateFields, requiresObjectId, idField) {
  const parsedFields = fields.split(',')
  const transformedProperties = toEsriAttributes(properties, geometry, dateFields, requiresObjectId, idField)
  return _.pick(transformedProperties, parsedFields)
}

sql.fn.esriGeom = function (geometry) {
  if (geometry && geometry.type) {
    return convertToEsriGeometry(geometry)
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
module.exports = sql
