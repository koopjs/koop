const _ = require('lodash');
const envelope = require('@turf/envelope').default;
const {
  getCollectionCrs,
  getGeometryTypeFromGeojson,
  normalizeExtent,
  normalizeSpatialReference,
  normalizeInputData,
  combineBodyQueryParameters,
  validateInfoRouteParams,
} = require('./helpers');
const logManager = require('./log-manager');
const ServerMetadata = require('./helpers/server-metadata');
const { generalResponseHandler } = require('./response-handlers');
const { normalizeCapabilities } = require('./helpers/normalize-capabilities');

function serverInfo(req, res, data) {
  const requestParameters = combineBodyQueryParameters(req.body, req.query);

  validateInfoRouteParams(requestParameters);

  const { layers, tables, relationships, ...restData } = normalizeInputData(data);

  const { inputCrs, sourceSR } = requestParameters;

  const metadata = normalizeMetadata(layers[0], tables[0], restData);
  const spatialReference = getSpatialReference(inputCrs, sourceSR, layers[0]);
  const capabilities = normalizeCapabilities({ ...restData, metadata });
  metadata.fullExtent = getExtent(metadata.extent, layers, spatialReference);
  metadata.initialExtent = getExtent(
    metadata.initialExtent || metadata.extent,
    layers,
    spatialReference,
  );

  // TODO: deprecate in favor or server-metadata-settings
  const appConfig = req.app?.locals?.config?.featureServer || {};

  const payload = ServerMetadata.create({
    ...appConfig,
    ...metadata,
    spatialReference,
    capabilities,
    currentVersion: appConfig.currentVersion,
    layers: layers.map(formatServerItemInfo),
    tables: tables.map((table, idx) => {
      return formatServerItemInfo(table, layers.length + idx);
    }),
    relationships: relationships.map(formatRelationshipInfo),
  });

  return generalResponseHandler(res, payload, requestParameters);
}

function normalizeMetadata(...args) {
  const flattened = args
    .map((arg) => {
      return flattenMetadata(arg);
    })
    .reduce((acc, cur) => {
      acc = {
        ...acc,
        ...cur,
      };
      return acc;
    }, {});
  return flattened;
}

function getSpatialReference(inputCrs, sourceSR, layer) {
  const spatialReference = inputCrs || sourceSR || getCollectionCrs(layer);

  if (!spatialReference) {
    return { wkid: 4326, latestWkid: 4326 };
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
        const { bbox } = envelope(layer);
        bbox.forEach((coordinate) => {
          if (!isFinite(coordinate)) {
            throw new Error(`Feature does not contain valid geometry`);
          }
        });
        return bbox;
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

function getExtent(metadataExtent, layers, spatialReference) {
  const extent = metadataExtent || calculateServiceExtentFromLayers(layers, spatialReference);

  try {
    return normalizeExtent(extent, spatialReference);
  } catch (error) {
    logManager.logger.warn(`Could not normalize extent: ${error}`);
  }
}

function formatServerItemInfo(json, defaultId) {
  const { metadata: { id, name, minScale = 0, maxScale = 0, defaultVisibility } = {} } = json;

  const geometryType = getGeometryTypeFromGeojson(json);

  const defaultName = geometryType ? `Layer_${id || defaultId}` : `Table_${id || defaultId}`;

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

module.exports = serverInfo;
