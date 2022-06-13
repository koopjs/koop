const _ = require('lodash')
const { calculateBounds } = require('@terraformer/spatial')
const {
  getCollectionCrs,
  getGeometryTypeFromGeojson,
  normalizeExtent,
  normalizeSpatialReference,
  normalizeInputData
} = require('./helpers')
const { serverMetadata: serverMetadataDefaults } = require('./defaults')
const {
  CURRENT_VERSION,
  FULL_VERSION
} = require('./constants')
const debug = process.env.KOOP_LOG_LEVEL === 'debug' || process.env.LOG_LEVEL === 'debug'

function serverMetadata (json, req = {}) {
  const {
    query = {}
  } = req

  const { extent, metadata = {}, ...rest } = json
  const {
    maxRecordCount,
    hasStaticData,
    copyrightText,
    description: providerLayerDescription,
    serviceDescription: providerServiceDescription
  } = { ...metadata, ...rest }
  const spatialReference = getSpatialReference(json, query)
  const { layers, tables, relationships } = normalizeInputData(json)
  // TODO reproject default extents when non WGS84 CRS is found or passed
  const fullExtent = getServiceExtent({ extent, metadata, layers, spatialReference })

  const {
    currentVersion = CURRENT_VERSION,
    fullVersion = FULL_VERSION,
    serviceDescription
  } = _.get(req, 'app.locals.config.featureServer', {})

  return _.defaults({
    currentVersion,
    fullVersion,
    spatialReference,
    fullExtent,
    initialExtent: fullExtent,
    layers: layers.map(layerInfo),
    tables: tables.map((json, idx) => {
      return tableInfo(json, layers.length + idx)
    }),
    relationships: relationships.map(relationshipInfo),
    supportsRelationshipsResource: relationships && relationships.length > 0,
    serviceDescription: serviceDescription || providerServiceDescription || providerLayerDescription,
    copyrightText: copyrightText,
    maxRecordCount: maxRecordCount || _.get(layers, '[0].metadata.maxRecordCount'),
    hasStaticData: typeof hasStaticData === 'boolean' ? hasStaticData : false
  }, serverMetadataDefaults)
}

function getServiceExtent ({ extent, metadata = {}, layers, spatialReference = { wkid: 4326, latestWkid: 4326 } }) {
  if (extent || metadata.extent) return normalizeExtent(extent || metadata.extent, spatialReference)
  return calculateServiceExtentFromLayers(layers, spatialReference)
}

function calculateServiceExtentFromLayers (layers, spatialReference) {
  try {
    if (layers.length === 0) {
      return
    }

    const layerBounds = layers.filter(layer => {
      return _.has(layer, 'features[0]')
    }).map(calculateBounds)

    if (layerBounds.length === 0) return

    const { xmins, xmaxs, ymins, ymaxs } = layerBounds.reduce((accumulator, bounds) => {
      const [xmin, ymin, xmax, ymax] = bounds
      accumulator.xmins.push(xmin)
      accumulator.xmaxs.push(xmax)
      accumulator.ymins.push(ymin)
      accumulator.ymaxs.push(ymax)
      return accumulator
    }, { xmins: [], xmaxs: [], ymins: [], ymaxs: [] })

    return {
      xmin: Math.min(...xmins),
      xmax: Math.max(...xmaxs),
      ymin: Math.min(...ymins),
      ymax: Math.max(...ymaxs),
      spatialReference
    }
  } catch (error) {
    if (debug) {
      console.log(`Could not calculate extent from data: ${error.message}`)
    }
  }
}

function layerInfo (json = {}, defaultId) {
  return formatInfo(json, defaultId, 'layer')
}

function tableInfo (json = {}, defaultId) {
  return formatInfo(json, defaultId, 'table')
}

function formatInfo (json = {}, defaultId, type) {
  const {
    metadata: {
      id,
      name,
      minScale = 0,
      maxScale = 0,
      defaultVisibility
    } = {}
  } = json

  const defaultName = type === 'layer' ? `Layer_${id || defaultId}` : `Table_${id || defaultId}`
  return {
    id: id || defaultId,
    name: name || defaultName,
    parentLayerId: -1,
    defaultVisibility: defaultVisibility !== false,
    subLayerIds: null,
    minScale,
    maxScale,
    geometryType: type === 'layer' ? getGeometryTypeFromGeojson(json) : undefined
  }
}

function relationshipInfo (json = {}, relationshipIndex) {
  const {
    id,
    name
  } = json

  const defaultName = `Relationship_${id || relationshipIndex}`
  return {
    id: id || relationshipIndex,
    name: name || defaultName
  }
}

function getSpatialReference (collection, {
  inputCrs,
  sourceSR
}) {
  if (!inputCrs && !sourceSR && _.isEmpty(collection)) return
  const spatialReference = inputCrs || sourceSR || getCollectionCrs(collection)

  if (!spatialReference) return

  const { latestWkid, wkid, wkt } = normalizeSpatialReference(spatialReference)

  if (wkid) {
    return { wkid, latestWkid }
  }

  return { wkt }
}

module.exports = serverMetadata
