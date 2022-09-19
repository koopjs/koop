const _ = require('lodash');
const { geojsonToArcGIS } = require('@terraformer/arcgis');

module.exports = function convert (geometry = {}) {
  if (!geometry || !geometry.type) return null;

  const result = geojsonToArcGIS(_.clone(geometry));

  if (_.isEmpty(result)) return null;

  return _.omit(result, 'spatialReference');
};
