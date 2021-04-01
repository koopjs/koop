const getGeometryTypeFromGeojson = require('./get-geometry-type-from-geojson')

module.exports = function normalizeInput (input = {}) {
  const { type, tables = [], layers = [] } = input

  if (type === 'FeatureCollection') {
    const geometryType = getGeometryTypeFromGeojson(input)
    if (geometryType) return { layers: [input], tables }
    return { tables: [input], layers }
  }
  return { layers, tables }
}
