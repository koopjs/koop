const getGeometryTypeFromGeojson = require('./get-geometry-type-from-geojson');

module.exports = function normalizeInputForServerInfo(input = {}) {
  // Might be standard geojson, or prepared server metadata object
  const { layers, tables, relationships, type, features, ...rest } = input;

  // Geometry type will be defined if standard geojson
  const geometryType = getGeometryTypeFromGeojson({ type, features });

  return {
    ...rest,
    layers: getLayers(input, geometryType),
    tables: getTables(input, geometryType),
    relationships: relationships || [],
  };
};

function getLayers(input, geometryType) {
  const { layers, type, features, tables, relationships, ...rest } = input;
  if (layers) {
    return layers;
  }

  return type === 'FeatureCollection' && geometryType ? [{ type, features, ...rest }] : [];
}

function getTables(input, geometryType) {
  const { tables, type, features } = input;
  if (tables) {
    return tables;
  }

  return type === 'FeatureCollection' && !geometryType ? [{ type, features }] : [];
}
