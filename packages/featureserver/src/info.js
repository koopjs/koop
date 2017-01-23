'use strict'
const Utils = require('./utils.js')
const esriExtent = require('esri-extent')
const Templates = require('./templates')

module.exports = { serverInfo, serviceInfo, layerInfo, layers }

function layerInfo (geojson, params) {
  let json = Templates.render('layer', geojson, params)
  json.name = geojson.name || 'Layer 0'
  json.description = geojson.description || ''

  // set the geometry based on the first feature
  // TODO: could clean this up or use a flag in the url to pull out feature of specific type like nixta
  json = Utils.setGeomType(json, (geojson && geojson.features) ? geojson.features[0] : null)

  json.fullExtent = json.initialExtent = json.extent = geojson.extent || esriExtent(geojson.features)
  if (Utils.isTable(json, geojson)) json.type = 'Table'

  return json
}

function serverInfo () {
  return Templates.render('server')
}

function serviceInfo (geojson, params) {
  // no layer, send the service json
  const json = Templates.render('service', geojson, params)

  json.fullExtent = json.initialExtent = json.extent = geojson.extent || esriExtent(geojson)
  const lyr = {
    id: 0,
    name: geojson.name || 'layer 1',
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
 * TODO: support many layers
 *
 * @param {object} data
 * @param {object} params
 */
function layers (data, params) {
  let layerJson
  let json
  if (!data.length) {
    layerJson = Templates.render('layer', data, params)
    layerJson.extent = layerJson.fullExtent = layerJson.initialExtent = esriExtent(data.features)
    json = { layers: [layerJson], tables: [] }
    return json
  } else {
    json = { layers: [], tables: [] }

    data.forEach(function (layer, i) {
      layerJson = Templates.render('layer', layer, params)
      layerJson.id = i
      layerJson.extent = layerJson.fullExtent = layerJson.initialExtent = esriExtent(layer.features)
      json.layers.push(layerJson)
    })
    return json
  }
}
