const { within, contains, intersects, envelopeIntersects, hashedObjectIdComparator } = require('./filters')
const convertToEsriGeometry = require('../geometry/convert-to-esri')
const sql = require('alasql')
const {
  project,
  selectFields,
  selectFieldsToEsriAttributes,
  toGeohash,
  toEsriAttributes,
  toHash
} = require('./transforms')
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

sql.fn.selectFields = selectFields

sql.fn.selectFieldsToEsriAttributes = selectFieldsToEsriAttributes

sql.aggr.hash = toHash

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

module.exports = sql
