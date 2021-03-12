const _ = require('lodash')
const debug = process.env.KOOP_LOG_LEVEL === 'debug' || process.env.LOG_LEVEL === 'debug'

const esriLookup = {
  Point: 'esriGeometryPoint',
  MultiPoint: 'esriGeometryMultipoint',
  LineString: 'esriGeometryPolyline',
  MultiLineString: 'esriGeometryPolyline',
  Polygon: 'esriGeometryPolygon',
  MultiPolygon: 'esriGeometryPolygon',
  esriGeometryPoint: 'esriGeometryPoint',
  esriGeometryMultipoint: 'esriGeometryMultipoint',
  esriGeometryPolyline: 'esriGeometryPolyline',
  esriGeometryPolygon: 'esriGeometryPolygon'
}

module.exports = function getGeometryTypeFromGeojson ({ geometryType, metadata = {}, features = [] } = {}) {
  const type = geometryType || metadata.geometryType || findInFeatures(features)

  if (!type && debug) {
    console.log(`Input JSON has unsupported geometryType: ${type}`)
  }
  return esriLookup[type]
}

function findInFeatures (features) {
  const featureWithGeometryType = features.find(feature => {
    return _.get(feature, 'geometry.type')
  })

  if (!featureWithGeometryType) return

  return featureWithGeometryType.geometry.type
}
