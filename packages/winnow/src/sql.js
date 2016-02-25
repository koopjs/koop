const Terraformer = require('terraformer')
const sql = require('alasql')
const geohash = require('ngeohash')
const centroid = require('turf-centroid')
const _ = require('lodash')

sql.fn.ST_Within = function (feature, filterGeom) {
  const filter = new Terraformer.Primitive(filterGeom)
  const TfFeature = new Terraformer.Primitive(feature)
  return TfFeature.within(filter)
}

sql.fn.ST_Contains = function (feature, filterGeom) {
  const filter = new Terraformer.Primitive(filterGeom)
  const TfFeature = new Terraformer.Primitive(feature)
  return TfFeature.contains(filter)
}

sql.fn.ST_Intersects = function (feature, filterGeom) {
  const filter = new Terraformer.Primitive(filterGeom)
  const TfFeature = new Terraformer.Primitive(feature)
  return TfFeature.intersects(filter)
}

sql.fn.geohash = function (geometry, precision) {
  if (!geometry || !geometry.type) return
  precision = precision || 8
  if (geometry.type !== 'Point') geometry = centroid(geometry).geometry
  const pnt = geometry.coordinates
  return geohash.encode(pnt[1], pnt[0], precision)
}

sql.fn.pick = function (properties, fields) {
  fields = fields.split(',')
  return _.pick(properties, fields)
}

sql.aggr.hash = function (value, obj, acc) {
  obj = obj || {}
  // console.log(geometry, hash, previous, acc)
  if (obj[value]) obj[value]++
  else obj[value] = 1
  return obj
}

module.exports = sql
