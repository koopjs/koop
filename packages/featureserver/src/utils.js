const renderers = {
  polygon: require('./templates/renderers/polygon.json'),
  line: require('./templates/renderers/line.json'),
  point: require('./templates/renderers/point.json')
}

module.exports = { setGeomType, isTable }

/**
 * set esri geometry type of a feature layer based on geojson type
 *
 * @param {object} json
 * @param {object} feature
 */
function setGeomType (json, feature) {
  var isPolygon = feature && feature.geometry && (feature.geometry.type.toLowerCase() === 'polygon' || feature.geometry.type.toLowerCase() === 'multipolygon')
  var isLine = feature && feature.geometry && (feature.geometry.type.toLowerCase() === 'linestring' || feature.geometry.type.toLowerCase() === 'multilinestring')
  if (isPolygon) {
    json.geometryType = 'esriGeometryPolygon'
    if (json.drawingInfo) json.drawingInfo.renderer = renderers['polygon']
  } else if (isLine) {
    json.geometryType = 'esriGeometryPolyline'
    if (json.drawingInfo) json.drawingInfo.renderer = renderers['line']
  } else {
    json.geometryType = 'esriGeometryPoint'
    if (json.drawingInfo) json.drawingInfo.renderer = renderers['point']
  }

  return json
}

/**
 * if we have no extent, but we do have features, then it should be Table
 *
 * @param {object} json
 * @param {object} data
 * @return {boolean}
 */
function isTable (json, data) {
  var noExtent = (!json.fullExtent.xmin && !json.fullExtent.ymin) || json.fullExtent.xmin === Infinity
  var hasFeatures = data.features || data[0].features
  if (noExtent && !hasFeatures) return true
  else return false
}
