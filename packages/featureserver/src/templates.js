const _ = require('lodash')
const moment = require('moment')
const Utils = require('./utils')
const field = require('./field')

module.exports = { render, renderServer, renderStatistics }

const templates = {
  server: require('../templates/server.json'),
  layer: require('../templates/layer.json'),
  features: require('../templates/features.json'),
  statistics: require('../templates/statistics.json'),
  field: require('../templates/field.json'),
  objectIDField: require('../templates/oid-field.json')
}

const renderers = {
  esriGeometryPolygon: require('../templates/renderers/polygon.json'),
  esriGeometryPolyline: require('../templates/renderers/line.json'),
  esriGeometryPoint: require('../templates/renderers/point.json')
}

const defaultSR = { wkid: 4326 }
const mercatorSR = { wkid: 102100, latestWkid: 3857 }

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
  const metadata = data.metadata || {}
  if (!json) throw new Error('Unsupported operation')

  // These two rely on geojson, while everything else relies on the source data
  if (json.fullExtent) json.fullExtent = json.initialExtent = json.extent = metadata.extent || options.extent
  else if (json.extent) json.extent = metadata.extent || options.extent

  if (json.geometryType) json.geometryType = options.geometryType
  if (json.spatialReference) json.spatialReference = computeSpatialReference(options.spatialReference)
  if (json.name && metadata.name) json.name = metadata.name
  if (json.description && metadata.description) json.description = metadata.description
  if (json.extent && metadata.extent) json.extent = computeExtent(metadata.extent)
  if (json.features) json.features = data.features
  if (json.fields) json.fields = field.computeFieldObject(data, template, options)
  if (json.type) json.type = Utils.isTable(json, data) ? 'Table' : 'Feature Layer'
  if (json.drawingInfo) json.drawingInfo.renderer = renderers[json.geometryType]
  if (json.timeInfo) json.timeInfo = metadata.timeInfo
  if (json.maxRecordCount) json.maxRecordCount = metadata.maxRecordCount || 1000
  if (json.displayField) json.displayField = metadata.displayField || json.fields[0].name
  if (json.objectIdField) json.objectIdField = metadata.idField || 'OBJECTID'
  return json
}

function renderServer (server, { layers, tables }) {
  const json = _.cloneDeep(templates.server)
  json.fullExtent = json.initialExtent = computeExtent(server.extent || json.fullExtent)
  json.serviceDescription = server.description
  json.layers = layers
  json.tables = tables
  json.maxRecordCount = server.maxRecordCount || (layers[0].metadata && layers[0].metadata.maxRecordCount) || 1000
  json.hasStaticData = !!server.hasStaticData
  return json
}

function renderStatistics (data) {
  let stats = data.statistics
  if (!Array.isArray(stats)) stats = [stats]
  const fields = data.metadata ? field.computeFieldObject(data) : createStatFields(stats)
  return {
    displayFieldName: '',
    fieldAliases: createFieldAliases(stats),
    fields,
    features: createStatFeatures(stats)
  }
}

function computeSpatialReference (sr) {
  if (!sr) return defaultSR
  else if (sr === 4326 || sr.wkid === 4326 || sr.latestWkid === 4326) return defaultSR
  else if (sr === 102100 || sr === 3857 || sr.wkid === 102100 || sr.latestWkid === 3857) return mercatorSR
  else if (typeof sr === 'number') return { wkid: sr }
  else {
    return {
      wkid: sr.wkid || sr.latestWkid,
      latestWkid: sr.latestWkid || sr.wkid
    }
  }
}

function computeExtent (input) {
  let coords
  if (input.xmin) return input
  if (Array.isArray(input)) {
    if (Array.isArray(input[0])) coords = input
    else coords = [[input[0], input[1]], [input[2], input[3]]]
  } else {
    throw new Error('invalid extent passed in metadata')
  }
  return {
    xmin: coords[0][0],
    ymin: coords[0][1],
    xmax: coords[1][0],
    ymax: coords[1][1],
    spatialReference: {
      wkid: 4326,
      latestWkid: 4326
    }
  }
}

function createFieldAliases (stats) {
  const fields = Object.keys(stats[0])
  return fields.reduce((aliases, field) => {
    aliases[field] = field
    return aliases
  }, {})
}

function createStatFields (stats) {
  return Object.keys(stats[0]).map(field => {
    const sample = _.find(stats, s => {
      return stats[field] !== null
    })
    const statField = {
      name: field,
      type: detectType(sample[field]),
      alias: field
    }
    if (statField.type === 'esriFieldTypeString') statField.length = 254
    return statField
  }, {})
}

function detectType (value) {
  if (!value) return null
  else if (moment(value, [moment.ISO_8601], true).isValid()) return 'esriFieldTypeDate'
  else if (typeof value === 'string') return 'esriFieldTypeString'
  else if (typeof value === 'number') return 'esriFieldTypeDouble'
}

function createStatFeatures (stats) {
  return stats.map(attributes => {
    const transformed = Object.keys(attributes).reduce((attrs, key) => {
      if (attributes[key] instanceof Date || moment(attributes[key], [moment.ISO_8601], true).isValid()) {
        attrs[key] = new Date(attributes[key]).getTime()
      } else {
        attrs[key] = attributes[key]
      }
      return attrs
    }, {})
    return { attributes: transformed }
  })
}
