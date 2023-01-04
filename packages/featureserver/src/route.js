const _ = require('lodash');
const layerInfo = require('./layer-metadata');
const query = require('./query');
const { logger } = require('./logger');
const queryRelatedRecords = require('./queryRelatedRecords.js');
const generateRenderer = require('./generate-renderer');
const restInfo = require('./rest-info-route-handler');
const serverInfo = require('./server-info-route-handler');
const layersInfo = require('./layers-metadata');
const relationshipsInfo = require('./relationships-info-route-handler');
const responseHandler = require('./response-handler');
const { validateInputs, normalizeRequestParameters } = require('./helpers');

module.exports = function route(req, res, geojson = {}) {
  const {
    params: { method },
    url,
    originalUrl,
  } = req;

  const [route] = (url || originalUrl).split('?');

  try {
    const params = normalizeRequestParameters(
      req.query,
      req.body,
      _.get(geojson, 'metadata.maxRecordCount'),
    );

    validateInputs(params, geojson);

    req = { ...req, query: params };
    geojson.metadata = geojson.metadata || { maxRecordCount: 2000 };

    let result;

    if (method) {
      result = handleMethodRequest({ method, geojson, req });
    } else if (isRestInfoRequest(route)) {
      result = restInfo(geojson, req);
    } else if (isServerMetadataRequest(route)) {
      result = serverInfo(geojson, req);
    } else if (isLayersMetadataRequest(route)) {
      result = layersInfo(geojson, params);
    } else if (isRelationshipsMetadataRequest(route)) {
      result = relationshipsInfo(geojson, params);
    } else if (isLayerMetadataRequest(route)) {
      result = layerInfo(geojson, req);
    } else {
      const error = new Error('Not Found');
      error.code = 404;
      throw error;
    }

    return responseHandler(req, res, 200, result);
  } catch (error) {
    logger.debug(error);
    return responseHandler(req, res, error.code || 500, {
      error: error.message,
    });
  }
};

function handleMethodRequest({ method, geojson, req }) {
  if (method === 'query') {
    return query(geojson, req.query);
  }

  if (method === 'queryRelatedRecords') {
    return queryRelatedRecords(geojson, req.query);
  }

  if (method === 'generateRenderer') {
    return generateRenderer(geojson, req.query);
  }

  if (method === 'info') {
    return layerInfo(geojson, req);
  }

  const error = new Error('Method not supported');
  error.code = 400;
  throw error;
}


function isRestInfoRequest(url) {
  return /\/rest\/info$/i.test(url);
}

function isServerMetadataRequest(url) {
  return (
    /\/FeatureServer$/i.test(url) ||
    /\/FeatureServer\/info$/i.test(url) ||
    /\/FeatureServer\/($|\?)/.test(url)
  );
}

function isLayersMetadataRequest(url) {
  return /\/FeatureServer\/layers$/i.test(url);
}

function isRelationshipsMetadataRequest(url) {
  return /\/FeatureServer\/relationships$/i.test(url);
}

function isLayerMetadataRequest(url) {
  return (
    /\/FeatureServer\/\d+$/i.test(url) ||
    /\/FeatureServer\/\d+\/info$/i.test(url) ||
    /\/FeatureServer\/\d+\/$/.test(url)
  );
}
