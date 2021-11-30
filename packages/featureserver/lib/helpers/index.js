module.exports = {
  normalizeExtent: require('./normalize-extent'),
  normalizeInputData: require('./normalize-input-data'),
  normalizeSpatialReference: require('./normalize-spatial-reference'),
  getCollectionCrs: require('./get-collection-crs'),
  getGeometryTypeFromGeojson: require('./get-geometry-type-from-geojson'),
  isTable: require('./is-geojson-table')
}
