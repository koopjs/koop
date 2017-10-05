const Utils = require('./utils.js')
const { renderLayer, renderServer } = require('./templates')
const { geometryMap } = require('./geometry')

module.exports = { serverInfo, layerInfo, layersInfo }

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
  params.extent = Utils.getExtent(geojson)
  params.geometryType = Utils.getGeomType(geojson)
  return renderLayer(geojson, params)
}

function serverLayerInfo (geojson = {}, id) {
  const metadata = geojson.metadata || {}
  const geometryType = metadata.geometryType || Utils.getGeomType(geojson)
  return {
    id,
    name: geojson.metadata.name,
    parentLayerId: -1,
    defaultVisibility: true,
    subLayerIds: null,
    minScale: 0,
    maxScale: 0,
    geometryType: geometryMap[geometryType] || geometryType
  }
}

/**
 * deals with `/layers` method call
 *
 * @param {object} data
 * @param {object} params
 */
function layersInfo (server, params = {}) {
  let layerJson
  let data
  if (server.type === 'FeatureCollection') {
    data = [server]
  } else {
    data = server.layers
  }
  let json
  if (!data.length) {
    params.extent = Utils.getExtent(data)
    const metadata = data.metadata || {}
    params.geometryType = metadata.geometryType || Utils.getGeomType(data)
    layerJson = renderLayer(data, params)
    json = { layers: [layerJson], tables: [] }
  } else {
    json = { layers: [], tables: [] }
    data.forEach(function (layer, i) {
      params.extent = Utils.getExtent(layer)
      const metadata = layer.metadata || {}
      params.geometryType = metadata.geometryType || Utils.getGeomType(layer)
      layerJson = renderLayer(layer, params)
      // TODO move this to a rendered template
      layerJson.id = i
      json.layers.push(layerJson)
    })
  }
  return json
}
