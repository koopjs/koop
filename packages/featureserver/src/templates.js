const fields = require('./fields.js')
const _ = require('lodash')
const Utils = require('./utils')

module.exports = { render }

const templates = {
  server: require('../templates/server.json'),
  layer: require('../templates/layer.json'),
  service: require('../templates/server.json'),
  features: require('../templates/features.json'),
  statistics: require('../templates/statistics.json')
}

const renderers = {
  esriGeometryPolygon: require('../templates/renderers/polygon.json'),
  esriGeometryPolyline: require('../templates/renderers/line.json'),
  esriGeometryPoint: require('../templates/renderers/point.json')
}

/**
 * loads a template json file and attaches fields
 *
 * @param {string} tmpl
 * @param {object} data
 * @return {object} template
 */
function render (template, featureCollection = {}, options = {}) {
  const json = _.cloneDeep(templates[template])
  const data = featureCollection
  data.metadata = data.metadata || {}
  if (!json) throw new Error('Unsupported operation')

  // These two rely on geojson, while everything else relies on the source data
  if (json.fullExtent) json.fullExtent = json.initialExtent = json.extent = data.metadata.extent || options.extent
  else if (json.extent) json.extent = data.metadata.extent || options.extent

  if (json.geometryType) json.geometryType = options.geometryType
  if (json.name && data.metadata.name) json.name = data.metadata.name
  if (json.description && data.metadata.description) json.description = data.metadata.description
  if (json.extent && data.metadata.extent) json.extent = data.metadata.extent
  if (json.features) json.features = data.features
  if (json.fields) {
    const props = data.features[0].properties || data.features[0].attributes
    const fieldObj = fields(props, template, options)
    json.fields = fieldObj.fields
  }
  if (json.type) json.type = Utils.isTable(json, data) ? 'Table' : 'Feature Layer'
  if (json.drawingInfo) json.drawingInfo.renderer = renderers[json.geometryType]
  if (json.displayFieldName) json.displayFieldName = data.metadata.displayField || json.fields[0].name
  return json
}
