const {
  isTable,
  TableLayerMetadata,
  FeatureLayerMetadata
} = require('./helpers');

function layerMetadata (data = {}, options = {}) {
  if (isTable({ ...data, ...options })) {
    return TableLayerMetadata.create(data, options);
  }

  return FeatureLayerMetadata.create(data, options);
}

module.exports = layerMetadata;
