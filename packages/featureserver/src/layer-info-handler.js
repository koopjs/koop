const {
  isTable,
  TableLayerMetadata,
  FeatureLayerMetadata,
  combineBodyQueryParameters,
  validateInfoRouteParams,
} = require('./helpers');
const { generalResponseHandler } = require('./response-handlers');

function layerInfo(req, res, data = {}) {
  const requestParameters = combineBodyQueryParameters(req.body, req.query);

  validateInfoRouteParams(requestParameters);

  const { inputCrs, sourceSR } = requestParameters;
  const payload = getPayload(data, { inputCrs, sourceSR });
  return generalResponseHandler(res, payload, requestParameters);
}

module.exports = layerInfo;

function getPayload(data, options) {
  if (isTable(data)) {
    return TableLayerMetadata.create(data, options);
  }

  return FeatureLayerMetadata.create(data, options);
}
