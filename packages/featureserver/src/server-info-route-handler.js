const _ = require('lodash');
const { calculateBounds } = require('@terraformer/spatial');
const {
  getCollectionCrs,
  getGeometryTypeFromGeojson,
  normalizeExtent,
  normalizeSpatialReference,
  normalizeInputData,
} = require('./helpers');
const logManager = require('./log-manager');
const ServerMetadata = require('./helpers/server-metadata');

function serverMetadataResponse(data, req = {}) {
  const { query: { inputCrs, sourceSR } = {} } = req;
  const providerMetadata = normalizeMetadataFromProvider(
    data,
    inputCrs,
    sourceSR,
  );

  // TODO: deprecate in favor or server-metadata-settings
  const appConfig = req.app?.locals?.config?.featureServer || {};

  return ServerMetadata.create({
    ...appConfig,
    ...providerMetadata,
    currentVersion: appConfig.currentVersion,
  });
}

function normalizeMetadataFromProvider(data, inputCrs, sourceSR) {
  const { layers, tables, relationships } = normalizeInputData(data);

  const collectionMetadata = flattenMetadata(data);

  const spatialReference = getSpatialReference(
    inputCrs,
    sourceSR,
    layers[0] || data,
  ) || { wkid: 4326, latestWkid: 4326 };

  const extent =
    collectionMetadata?.extent ||
    calculateServiceExtentFromLayers(layers, spatialReference);

  const metadata = {
    ...flattenMetadata(tables[0]),
    ...flattenMetadata(layers[0]),
    ...flattenMetadata(data),
    fullExtent: getExtent(extent, spatialReference),
    initialExtent: getExtent(
      collectionMetadata?.initialExtent || extent,
      spatialReference,
    ),
  };

  return {
    ...metadata,
    layers: layers.map(formatServerItemInfo),
    tables: tables.map((table, idx) => {
      return formatServerItemInfo(table, layers.length + idx);
    }),
    relationships: relationships.map(formatRelationshipInfo),
  };
}

function getSpatialReference(inputCrs, sourceSR, data) {
  const spatialReference = inputCrs || sourceSR || getCollectionCrs(data);

  if (!spatialReference) {
    return;
  }

  return normalizeSpatialReference(spatialReference);
}

function calculateServiceExtentFromLayers(layers, spatialReference) {
  try {
    if (layers.length === 0) {
      return;
    }

    const { xmins, xmaxs, ymins, ymaxs } = layers
      .filter((layer) => {
        return _.has(layer, 'features[0]');
      })
      .map((layer) => {
        const bounds = calculateBounds(layer);
        bounds.forEach(coordinate => {
          if (isNaN(coordinate)) {
            throw new Error(`Geometry coordinate is not a number: ${coordinate}`);
          }
        });
        return bounds;
      })
      .reduce(
        (accumulator, bounds) => {
          const [xmin, ymin, xmax, ymax] = bounds;
          accumulator.xmins.push(xmin);
          accumulator.xmaxs.push(xmax);
          accumulator.ymins.push(ymin);
          accumulator.ymaxs.push(ymax);
          return accumulator;
        },
        { xmins: [], xmaxs: [], ymins: [], ymaxs: [] },
      );

    return {
      xmin: Math.min(...xmins),
      xmax: Math.max(...xmaxs),
      ymin: Math.min(...ymins),
      ymax: Math.max(...ymaxs),
      spatialReference,
    };
  } catch (error) {
    logManager.logger.debug(`Could not calculate extent from data: ${error.message}`);
  }
}

function flattenMetadata(data) {
  const { features, type, metadata, ...rest } = data || {};

  return {
    ...metadata,
    ...rest,
  };
}

function getExtent(extent, spatialReference) {
  try {
    return normalizeExtent(extent, spatialReference);
  } catch (error) {
    logManager.logger.warn(`Could not normalize extent: ${ error }`);
  }
}

function formatServerItemInfo(json, defaultId) {
  const {
    metadata: { id, name, minScale = 0, maxScale = 0, defaultVisibility } = {},
  } = json;

  const geometryType = getGeometryTypeFromGeojson(json);

  const defaultName = geometryType
    ? `Layer_${id || defaultId}`
    : `Table_${id || defaultId}`;

  const retVal = {
    id: id || defaultId,
    name: name || defaultName,
    type: geometryType ? 'Feature Layer' : 'Table',
    parentLayerId: -1,
    defaultVisibility: defaultVisibility !== false,
    subLayerIds: null,
    minScale,
    maxScale,
  };

  if (geometryType) {
    retVal.geometryType = geometryType;
  }

  return retVal;
}

function formatRelationshipInfo(json, relationshipIndex) {
  const { id, name } = json;

  const defaultName = `Relationship_${id || relationshipIndex}`;
  return {
    id: id || relationshipIndex,
    name: name || defaultName,
  };
}

module.exports = serverMetadataResponse;
