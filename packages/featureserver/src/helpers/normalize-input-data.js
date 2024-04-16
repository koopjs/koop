const _ = require('lodash');
const logManager = require('../log-manager');
const getGeometryTypeFromGeojson = require('./get-geometry-type-from-geojson');

module.exports = function normalizeInputForServerInfo(input = {}) {
  if (!_.isObject(input)) {
    logManager.logger.debug(`Unexpected input data: ${input}`);
    input = {};
  }

  // Might be standard geojson, or prepared server metadata object
  const { layers, tables, relationships, type, features, ...rest } = input;

  // Geometry type will be defined if standard geojson
  const geometryType = getGeometryTypeFromGeojson({ type, features, metadata: rest.metadata });

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
  const { tables, layers, relationships, type, features, ...rest } = input;
  if (tables) {
    return tables;
  }

  return type === 'FeatureCollection' && !geometryType ? [{ type, features, ...rest }] : [];
}
