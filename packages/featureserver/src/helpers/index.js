module.exports = {
  normalizeExtent: require('./normalize-extent'),
  normalizeInputData: require('./normalize-input-data'),
  normalizeSpatialReference: require('./normalize-spatial-reference'),
  getCollectionCrs: require('./get-collection-crs'),
  getGeometryTypeFromGeojson: require('./get-geometry-type-from-geojson'),
  isTable: require('./is-geojson-table'),
  getSpatialReference: require('./get-spatial-reference'),
  TableLayerMetadata: require('./table-layer-metadata'),
  FeatureLayerMetadata: require('./feature-layer-metadata'),
  ...(require('./data-type-utils')),
  ...(require('./renderers')),
  ...(require('./validate-inputs')),
  ...(require('./normalize-request-params'))
};
