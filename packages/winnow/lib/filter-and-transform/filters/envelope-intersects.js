const _ = require('lodash')
const { calculateBounds, intersects, contains } = require('@terraformer/spatial')
const transformArray = require('../../geometry/transform-coordinate-array-to-polygon')
const convertFromEsri = require('../../geometry/transfrom-esri-geometry-to-geojson-geometry')

module.exports = function (featureGeometry = {}, filterGeometry = {}) {
  if (_.isEmpty(featureGeometry) || _.isEmpty(filterGeometry)) return false

  const normalizedFeatureGeometry = isGeoJsonGeometry(featureGeometry) ? featureGeometry : convertFromEsri(featureGeometry)

  const { type, coordinates = [] } = normalizedFeatureGeometry

  if (!type || coordinates.length === 0) return false

  const geometryFilterEnvelope = convertGeometryToEnvelope(filterGeometry)

  if (type === 'Point') return contains(geometryFilterEnvelope, normalizedFeatureGeometry)

  const featureEnvelope = convertGeometryToEnvelope(normalizedFeatureGeometry)
  return intersects(geometryFilterEnvelope, featureEnvelope)
}

function convertGeometryToEnvelope (geometry) {
  const bounds = calculateBounds(geometry)
  return transformArray(bounds)
}

function isGeoJsonGeometry ({ type, coordinates }) {
  return type && coordinates
}
