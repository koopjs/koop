const esriExtent = require('esri-extent')
const { geometryMap } = require('./geometry')

module.exports = { isTable, getExtent, getGeomType }

/**
 * if we have no extent, but we do have features, then it should be Table
 *
 * @param {object} json
 * @param {object} data
 * @return {boolean}
 */
function isTable (json, data) {
  if (json.geometryType || (json.metadata && json.metadata.geometryType)) return false
  var noExtent = !json.fullExtent || !json.fullExtent.xmin || !json.fullExtent.ymin || json.fullExtent.xmin === Infinity
  var hasFeatures = data.features || data[0].features
  if (noExtent && hasFeatures) return true
  else return false
}

function getExtent (geojson) {
  if (geojson.metadata && geojson.metadata.extent) return geojson.metadata.extent
  else return esriExtent(geojson)
}

const esriGeomTypes = {
  polygon: 'esriGeometryPolygon',
  linestring: 'esriGeometryPolyline',
  point: 'esriGeometryPoint'
}

function getGeomType (geojson = {}) {
  // TODO this should find the first non-null geometry
  if (geojson.metadata && geojson.metadata.geometryType) return geometryMap[geojson.metadata.geometryType]
  if (!geojson.features || !geojson.features[0]) return undefined
  const feature = geojson.features[0]
  if (!feature || !feature.geometry || !feature.geometry.type) return undefined
  const type = esriGeomTypes[feature.geometry.type.toLowerCase()]
  return type
}
