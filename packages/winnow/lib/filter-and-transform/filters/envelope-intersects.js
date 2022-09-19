const _ = require('lodash');
const { calculateBounds, intersects, contains } = require('@terraformer/spatial');
const bboxPolygon = require('@turf/bbox-polygon').default;
const { arcgisToGeoJSON } = require('@terraformer/arcgis');

module.exports = function (featureGeometry = {}, filterGeometry = {}) {
  if (_.isEmpty(featureGeometry) || _.isEmpty(filterGeometry)) return false;

  const normalizedFeatureGeometry = isGeoJsonGeometry(featureGeometry) ? featureGeometry : arcgisToGeoJSON(featureGeometry);

  const { type, coordinates = [] } = normalizedFeatureGeometry;

  if (!type || coordinates.length === 0) return false;

  const geometryFilterEnvelope = convertGeometryToEnvelopePolygon(filterGeometry);

  if (type === 'Point') return contains(geometryFilterEnvelope, normalizedFeatureGeometry);

  const featureEnvelope = convertGeometryToEnvelopePolygon(normalizedFeatureGeometry);
  return intersects(geometryFilterEnvelope, featureEnvelope);
};

function convertGeometryToEnvelopePolygon (geometry) {
  const bounds = calculateBounds(geometry);
  const { geometry: envelopePolygon } = bboxPolygon(bounds);
  return envelopePolygon;
}

function isGeoJsonGeometry ({ type, coordinates }) {
  return type && coordinates;
}
