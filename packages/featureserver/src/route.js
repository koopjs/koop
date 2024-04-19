const layerInfo = require('./layer-info-handler.js');
const query = require('./query');
const logManager = require('./log-manager');
const queryRelatedRecords = require('./queryRelatedRecords.js');
const generateRenderer = require('./generate-renderer');
const restInfo = require('./rest-info-route-handler');
const serverInfo = require('./server-info-route-handler');
const layersInfo = require('./layers-info-handler');
const { generalResponseHandler } = require('./response-handlers');
const { validateInputs, normalizeRequestParameters } = require('./helpers');

module.exports = function route(req, res, geojson = {}) {
  const {
    params: { method },
    url,
    originalUrl,
  } = req;

  const [route] = (url || originalUrl).split('?');

  try {
    req.query = normalizeRequestParameters(req.body, req.query);

    // TODO move to each handler, as params and data will vary a lot
    validateInputs(req.query, geojson);

    if (isRestInfoRequest(route)) {
      return restInfo(req, res, geojson);
    }

    if (isServerMetadataRequest(route)) {
      return serverInfo(req, res, geojson);
    }

    if (isLayersMetadataRequest(route) || isRelationshipsMetadataRequest(route)) {
      return layersInfo(req, res, geojson);
    }

    if (isLayerMetadataRequest(method, route)) {
      return layerInfo(req, res, geojson);
    }

    if (method === 'query') {
      return query(req, res, geojson);
    }

    if (method === 'generateRenderer') {
      return generateRenderer(req, res, geojson);
    }

    if (method === 'queryRelatedRecords') {
      const operationResult = queryRelatedRecords(geojson, req.query);
      return generalResponseHandler(res, operationResult, req.query);
    }

    const error = new Error('Invalid URL');
    error.code = 400;
    throw error;
  } catch (error) {
    logManager.logger.debug(error);
    const { code = 500, message, details = [message] } = error;

    // Geoservice spec wraps all errors in a 200 response (!)
    return generalResponseHandler(
      res,
      {
        error: { code, message, details },
      },
      req.query,
    );
  }
};

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
