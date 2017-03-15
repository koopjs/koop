const utils = require('./utils')
module.exports = function convert (geojson = {}, options = {}) {
  var result = {}
  if (!geojson.type) return null
  switch (geojson.type) {
    case 'Point':
      result.x = geojson.coordinates[0]
      result.y = geojson.coordinates[1]
      if (geojson.coordinates[2]) {
        result.z = geojson.coordinates[2]
      }
      if (geojson.coordinates[3]) {
        result.m = geojson.coordinates[3]
      }
      break
    case 'MultiPoint':
      result.points = geojson.coordinates.slice(0)
      break
    case 'LineString':
      result.paths = [geojson.coordinates.slice(0)]
      break
    case 'MultiLineString':
      result.paths = geojson.coordinates.slice(0)
      break
    case 'Polygon':
      result.rings = utils.orientRings(geojson.coordinates.slice(0))
      break
    case 'MultiPolygon':
      result.rings = utils.flattenMultiPolygonRings(geojson.coordinates.slice(0))
      break
  }

  return result
}
