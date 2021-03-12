const { renderLayer } = require('./templates')

module.exports = { layerInfo, layersInfo }

function layerInfo (geojson, params) {
  return renderLayer(geojson, params)
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
    return renderLayer(layer, { params })
  })

  return json
}
