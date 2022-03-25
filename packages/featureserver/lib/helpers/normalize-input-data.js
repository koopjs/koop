const getGeometryTypeFromGeojson = require('./get-geometry-type-from-geojson')

module.exports = function normalizeInput (input = {}) {
  const {
    type,
    tables = [],
    layers = [],
    relationships = []
  } = input

  if (type === 'FeatureCollection') {
    const geometryType = getGeometryTypeFromGeojson(input)
    if (geometryType) {
      return { layers: [input], tables, relationships }
    }
    return { tables: [input], layers, relationships }
  }

  return { layers, tables, relationships }
}
