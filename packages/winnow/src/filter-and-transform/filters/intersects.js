const _ = require('lodash');
const { intersects, contains } = require('@terraformer/spatial');
const { arcgisToGeoJSON } = require('@terraformer/arcgis');

module.exports = function (featureGeometry = {}, filterGeometry = {}) {
  if (_.isEmpty(featureGeometry)) return false;
  const geometry = isGeoJsonGeometry(featureGeometry) ? featureGeometry : arcgisToGeoJSON(featureGeometry);
  const { type, coordinates = [] } = geometry;
  if (!type || !coordinates || coordinates.length === 0) return false;
  if (type === 'Point') return contains(filterGeometry, geometry);
  return intersects(filterGeometry, geometry);
};

function isGeoJsonGeometry ({ type, coordinates }) {
  return type && coordinates;
}
