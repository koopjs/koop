const Utils = require('./utils.js')
const { renderRestInfo, renderLayer, renderServer } = require('./templates')
const { geometryMap } = require('./geometry')

module.exports = { restInfo, serverInfo, layerInfo, layersInfo }

/**
 * Pass on request for rest/info to rendering function
 * @param {object} dataSourceRestInfo rest-info object that will supplement/override templated rest/info response
 * return JSON response
 */
function restInfo (dataSourceRestInfo) {
  return renderRestInfo(dataSourceRestInfo)
}

function serverInfo (server, params = {}) {
  let layers
  if (server.type === 'FeatureCollection') {
    layers = [server]
  } else {
    layers = server.layers
  }
  server.extent = server.extent || Utils.getExtent(layers[0])

  const serverLayers = layers.reduce(
    (collection, layer, i) => {
      const info = serverLayerInfo(layer, i)
      if (info.geometryType) collection.layers.push(info)
      else collection.tables.push(info)
      return collection
    },
    { layers: [], tables: [] }
  )

  return renderServer(server, serverLayers)
}

function layerInfo (geojson, params) {
  return renderLayer(geojson, params)
}

function serverLayerInfo (geojson = {}, id) {
  const metadata = geojson.metadata || {}
  const geometryType = metadata.geometryType || Utils.getGeomType(geojson)
  return {
    id: metadata.id !== undefined ? metadata.id : id,
    name: metadata.name || `Layer_${id}`,
    parentLayerId: -1,
    defaultVisibility: metadata.defaultVisibility !== false,
    subLayerIds: null,
    minScale: metadata.minScale !== undefined ? metadata.minScale : 0,
    maxScale: metadata.maxScale !== undefined ? metadata.maxScale : 0,
    geometryType: geometryMap[geometryType] || geometryType
  }
}

/**
 * Generate layer info JSON for `/layers` method call
 *
 * @param {object} server
 * @param {object} params
 */
function layersInfo (server, params = {}) {
  const json = { layers: [], tables: [] }
  let layers

  if (server.type === 'FeatureCollection') {
    layers = [server]
  } else if (Array.isArray(server.layers)) {
    layers = server.layers
  } else return json

  json.layers = layers.map((layer, i) => {
    params.layer = i
    return renderLayer(layer, params)
  })

  return json
}
