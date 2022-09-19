const _ = require('lodash');
const getGeometryTypeFromGeojson = require('./get-geometry-type-from-geojson');

function hasValidFullExent (data) {
  // Check for a valid fullExtent. If unset, assume this is a Table
  const fullExtent = data.fullExtent || (data.metadata && data.metadata.fullExtent);
  if (_.isUndefined(fullExtent) || _.isUndefined(fullExtent.xmin) || _.isUndefined(fullExtent.ymin) || fullExtent.xmin === Infinity) return true;

  return false;
}

module.exports = function isTable (data = {}) {
// geometry indicates this in not a table
  const geometryType = getGeometryTypeFromGeojson(data);
  if (geometryType) return false;

  return hasValidFullExent(data);
};
