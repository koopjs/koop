module.exports = { serverInfo, layerInfo, layersInfo }

const Utils = require('./utils.js')
const Templates = require('./templates')

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

  return Templates.renderServer(server, serverLayers)
}

function layerInfo (geojson, params) {
  params.extent = Utils.getExtent(geojson)
  params.geometryType = Utils.getGeomType(geojson)
  return Templates.render('layer', geojson, params)
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
    geometryType
  }
}

/**
 * deals with `/layers` method call
 *
 * @param {object} data
 * @param {object} params
 */
function layersInfo (data, params = {}) {
  let layerJson
  let json
  if (!data.length) {
    params.extent = Utils.getExtent(data)
    params.geometryType = Utils.getGeomType(data && data.features ? data.features[0] : null)
    layerJson = Templates.render('layer', data, params)
    json = { layers: [layerJson], tables: [] }
  } else {
    json = { layers: [], tables: [] }
    data.forEach(function (layer, i) {
      params.extent = Utils.getExtent(layer)
      params.geometryType = Utils.getGeomType(layer && layer.features ? layer.features[0] : null)
      layerJson = Templates.render('layer', layer, params)
      // TODO move this to a rendered template
      layerJson.id = i
      json.layers.push(layerJson)
    })
  }
  return json
}
