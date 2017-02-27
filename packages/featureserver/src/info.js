const Utils = require('./utils.js')
const Templates = require('./templates')

function layerInfo (geojson, params) {
  params.extent = Utils.getExtent(geojson)
  params.geometryType = Utils.getGeomType(geojson)
  return Templates.render('layer', geojson, params)
}

function serverInfo () {
  return Templates.render('server')
}

function serviceInfo (geojson, params = {}) {
  // no layer, send the service json
  params.extent = Utils.getExtent(geojson)
  params.geometryType = Utils.getGeomType(geojson)
  const json = Templates.render('service', geojson, params)
  // TODO move this to a rendered template
  const lyr = {
    id: 0,
    name: geojson.metadata && geojson.metadata.name || 'layer 1',
    parentLayerId: -1,
    defaultVisibility: true,
    subLayerIds: null,
    minScale: 99999.99,
    maxScale: 0
  }
  if (Utils.isTable(json, geojson)) json.tables[0] = lyr
  else json.layers[0] = lyr
  return json
}

/**
 * deals with `/layers` method call
 *
 * @param {object} data
 * @param {object} params
 */
function layers (data, params) {
  let layerJson
  let json
  if (!data.length) {
    params.extent = Utils.getExtent(data)
    params.geometryType = Utils.getGeomType((data && data.features) ? data.features[0] : null)
    layerJson = Templates.render('layer', data, params)
    json = { layers: [layerJson], tables: [] }
  } else {
    json = { layers: [], tables: [] }
    data.forEach(function (layer, i) {
      params.extent = Utils.getExtent(layer)
      params.geometryType = Utils.getGeomType((layer && layer.features) ? layer.features[0] : null)
      layerJson = Templates.render('layer', layer, params)
      // TODO move this to a rendered template
      layerJson.id = i
      json.layers.push(layerJson)
    })
  }
  return json
}

module.exports = { serverInfo, serviceInfo, layerInfo, layers }
