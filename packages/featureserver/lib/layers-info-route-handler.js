const _ = require('lodash')
const { calculateBounds } = require('@terraformer/spatial')
const {
  getCollectionCrs,
  getGeometryTypeFromGeojson,
  normalizeExtent,
  normalizeSpatialReference,
  normalizeInputData
} = require('./helpers')
const { computeFieldObject } = require('./field')
const { layerMetadata: layerMetadataDefaults, renderers: rendererDefaults } = require('./defaults')
const debug = process.env.KOOP_LOG_LEVEL === 'debug' || process.env.LOG_LEVEL === 'debug'

module.exports = function layersMetadata (providerResponse, queryParams = {}) {
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
    fields: computeFieldObject(geojson, 'layer', queryParams) || [],
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

function calculateExtent ({ isLayer, geojson, spatialReference }) {
  if (!isLayer) {
    return
  }

  try {
    const bounds = calculateBounds(geojson)
    return normalizeExtent(bounds, spatialReference)
  } catch (error) {
    if (debug) {
      console.log(`Could not calculate extent from data: ${error.message}`)
    }
  }
}

function getSpatialReference (geojson, {
  inputCrs,
  sourceSR
}) {
  if (!inputCrs && !sourceSR && _.isEmpty(geojson)) return
  const spatialReference = inputCrs || sourceSR || getCollectionCrs(geojson)

  if (!spatialReference) return

  const { latestWkid, wkid, wkt } = normalizeSpatialReference(spatialReference)

  if (wkid) {
    return { wkid, latestWkid }
  }

  return { wkt }
}
