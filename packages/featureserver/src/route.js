const _ = require('lodash');
const layerInfo = require('./layer-metadata');
const query = require('./query');
const logManager = require('./log-manager');
const queryRelatedRecords = require('./queryRelatedRecords.js');
const generateRenderer = require('./generate-renderer');
const restInfo = require('./rest-info-route-handler');
const serverInfo = require('./server-info-route-handler');
const layersInfo = require('./layers-metadata');
const { generalResponseHandler, queryResponseHandler } = require('./response-handlers');
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

    // TODO move to each handler, as params and data will vary a lot
    validateInputs(params, geojson);

    req = { ...req, query: params };
    geojson.metadata = geojson.metadata || { maxRecordCount: 2000 };
    
    if (isRestInfoRequest(route)) {
      const result = restInfo(geojson, req);
      return generalResponseHandler(res, result, req.query);
    }
    
    if (isServerMetadataRequest(route)) {
      const result = serverInfo(geojson, req);
      return generalResponseHandler(res, result, req.query);
    } 
    
    if (isLayersMetadataRequest(route) || isRelationshipsMetadataRequest(route)) {
      const result = layersInfo(geojson, params);
      return generalResponseHandler(res, result, req.query);
    }
    
    if (isLayerMetadataRequest(method, route)) {
      const result = layerInfo(geojson, req);
      return generalResponseHandler(res, result, req.query);
    }
    
    if (method) {
      const operationResult = handleMethodRequest({ method, geojson, req });

      if (method === 'query') {
        return queryResponseHandler(res, operationResult, req.query);
      }
      
      return generalResponseHandler(res, operationResult, req.query);
    }

    const error = new Error('Not Found');
    error.code = 404;
    throw error;
  } catch (error) {
    logManager.logger.debug(error);
    const { code = 500 , message, details = [message] } = error;
    
    // Geoservice spec wraps all errors in a 200 response (!)
    return generalResponseHandler(res, {
      error: { code, message, details }
    }, req.query );
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

function isLayerMetadataRequest(method, url) {
  return (
    method === 'info' ||
    /\/FeatureServer\/\d+$/i.test(url) ||
    /\/FeatureServer\/\d+\/info$/i.test(url) ||
    /\/FeatureServer\/\d+\/$/.test(url)
  );
}
