const Terraformer = require('terraformer')
const TfParser = require('terraformer-arcgis-parser')
const sql = require('alasql')
const geohash = require('ngeohash')
const centroid = require('@turf/centroid')
const _ = require('lodash')

sql.fn.ST_Within = function (feature, filterGeom) {
  if (!(feature && feature.type && feature.coordinates && feature.coordinates.length > 0)) return false
  const filter = new Terraformer.Primitive(filterGeom)
  const TfFeature = new Terraformer.Primitive(feature)
  return filter.within(TfFeature)
}

sql.fn.ST_Contains = function (feature, filterGeom) {
  if (!(feature && feature.type && feature.coordinates && feature.coordinates.length > 0)) return false
  const filter = new Terraformer.Primitive(filterGeom)
  const TfFeature = new Terraformer.Primitive(feature)
  return filter.contains(TfFeature)
}

sql.fn.ST_Intersects = function (feature, filterGeom) {
  if (!(feature && feature.type && feature.coordinates && feature.coordinates.length > 0)) return false
  if (feature.type === 'Point') return sql.fn.ST_Contains(feature, filterGeom)
  const filter = new Terraformer.Primitive(filterGeom)
  const TfFeature = new Terraformer.Primitive(feature)
  return filter.intersects(TfFeature)
}

sql.fn.geohash = function (geometry, precision) {
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
  return TfParser.convert(geometry)
}

sql.aggr.hash = function (value, obj, acc) {
  obj = obj || {}
  if (obj[value]) obj[value]++
  else obj[value] = 1
  return obj
}

module.exports = sql
