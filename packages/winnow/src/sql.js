const Terraformer = require('terraformer')
const sql = require('alasql')
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

module.exports = sql
