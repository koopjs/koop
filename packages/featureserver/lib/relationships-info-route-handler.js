const _ = require('lodash')
const {
  calculateExtent,
  getGeometryTypeFromGeojson,
  getSpatialReference,
  normalizeExtent,
  normalizeInputData
} = require('./helpers')
const {
  LayerFields
} = require('./helpers/fields')
const { layerMetadata: layerMetadataDefaults, renderers: rendererDefaults } = require('./defaults')

module.exports = function relationshipsMetadata (providerResponse, queryParams = {}) {
  const { layers: layersInput, tables: tablesInput } = normalizeInputData(providerResponse)

  const layers = layersInput.map((layer, i) => {
    return formatResponse(layer, { queryParams, layerId: i, isLayer: true })
  })

  const tables = tablesInput.map((table, i) => {
    return formatResponse(table, { queryParams, layerId: layers.length + i })
  })

  return { layers, tables }
}

function formatResponse (geojson = {}, options = {}) {
  const { layerId, isLayer, queryParams } = options

  const {
    metadata = {},
    capabilities: {
      quantization,
      extract
    } = {}
  } = geojson

  const {
    id,
    name,
    description,
    idField,
    displayField,
    timeInfo,
    maxRecordCount,
    renderer,
    defaultVisibility,
    minScale,
    maxScale,
    hasStaticData
  } = metadata
  const geometryType = isLayer ? getGeometryTypeFromGeojson(geojson) : undefined
  const spatialReference = getSpatialReference(geojson, queryParams)
  const extent = metadata.extent ? normalizeExtent(metadata.extent, spatialReference) : calculateExtent({ isLayer, geojson, spatialReference })

  const json = {
    id: id || layerId,
    fields: LayerFields.create({ ...geojson, ...queryParams }) || [],
    type: isLayer ? 'Feature Layer' : 'Table',
    geometryType,
    drawingInfo: {
      renderer: renderer || rendererDefaults[geometryType],
      labelingInfo: null
    },
    spatialReference,
    extent,
    defaultVisibility,
    minScale,
    maxScale,
    quantization,
    extract,
    hasStaticData,
    name,
    description,
    objectIdField: idField,
    displayField: displayField || idField,
    uniqueIdField: idField,
    timeInfo,
    maxRecordCount,
    supportsCoordinatesQuantization: !!quantization
  }

  return _.defaults(json, {
    capabilities: extract ? `${layerMetadataDefaults.capabilities},Extract` : layerMetadataDefaults.capabilities
  }, layerMetadataDefaults)
}
