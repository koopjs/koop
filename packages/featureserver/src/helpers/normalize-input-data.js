const getGeometryTypeFromGeojson = require('./get-geometry-type-from-geojson');

module.exports = function normalizeInput (input = {}) {
  const {
    type,
    tables,
    layers,
    relationships,
  } = input;

  const geometryType = getGeometryTypeFromGeojson(input);

  return {
    layers: layers || type === 'FeatureCollection' && geometryType && [input] || [],
    tables: tables || type === 'FeatureCollection' && !geometryType && [input] || [],
    relationships: relationships || []
  };
};
