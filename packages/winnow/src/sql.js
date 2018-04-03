const Terraformer = require('terraformer')
const convertToEsri = require('./geometry/convert-to-esri')
const convertFromEsri = require('./geometry/convert-from-esri')
const sql = require('alasql')
const geohash = require('ngeohash')
const centroid = require('@turf/centroid')
const _ = require('lodash')
const projectCoordinates = require('./geometry/project-coordinates')
const reducePrecision = require('./geometry/reduce-precision')

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

sql.fn.geohash = function (geometry = {}, precision) {
  if (!geometry || !geometry.type || !geometry.coordinates) return
  precision = precision || 8
  if (geometry.type !== 'Point') geometry = centroid(geometry).geometry
  const pnt = geometry.coordinates
  return geohash.encode(pnt[1], pnt[0], precision)
}

sql.fn.pick = function (properties, fields) {
  fields = fields.split(',')
  return _.pick(properties, fields)
}

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
      coordinates: projectCoordinates(geometry.coordinates, { outSR: projection })
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

module.exports = sql
