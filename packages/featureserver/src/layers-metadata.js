const {
  normalizeInputData,
  TableLayerMetadata,
  FeatureLayerMetadata
} = require('./helpers');

module.exports = function layersMetadata (data, options = {}) {
  const { layers: layersInput, tables: tablesInput } = normalizeInputData(data);

  const layers = layersInput.map((layer, i) => {
    return FeatureLayerMetadata.create(layer, { layerId: i, ...options });
  });

  const tables = tablesInput.map((table, i) => {
    return TableLayerMetadata.create(table, { layerId: layers.length + i, ...options });
  });

  return { layers, tables };
};
