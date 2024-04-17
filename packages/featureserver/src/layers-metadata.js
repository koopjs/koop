const {
  normalizeInputData,
  TableLayerMetadata,
  FeatureLayerMetadata,
  combineBodyQueryParameters,
  validateInfoRouteParams,
} = require('./helpers');
const { generalResponseHandler } = require('./response-handlers');

module.exports = function layersMetadata(req, res, data) {
  const requestParameters = combineBodyQueryParameters(req.body, req.query);

  validateInfoRouteParams(requestParameters);

  const { layers: layersInput, tables: tablesInput, ...rest } = normalizeInputData(data);

  const layers = layersInput.map((layer, i) => {
    return FeatureLayerMetadata.create(layer, { layerId: i, ...rest });
  });

  const tables = tablesInput.map((table, i) => {
    return TableLayerMetadata.create(table, {
      layerId: layers.length + i,
      ...rest,
    });
  });

  generalResponseHandler(res, { layers, tables }, requestParameters);
  return;
};
