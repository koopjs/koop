const _ = require('lodash')
const moment = require('moment')
const { isTable } = require('./utils')
const { computeFieldObject, createFieldAliases, createStatFields } = require('./field')
const { computeSpatialReference, computeExtent } = require('./geometry')
const { createClassBreakInfos, createUniqueValueInfos } = require('./generateRenderer/createClassificationInfos')

module.exports = { renderLayer, renderFeatures, renderStatistics, renderServer, renderStats, renderClassBreaks, renderUniqueValue }

const templates = {
  layer: require('../templates/layer.json'),
  features: require('../templates/features.json'),
  statistics: require('../templates/statistics.json'),
  server: require('../templates/server.json'),
  field: require('../templates/field.json'),
  objectIDField: require('../templates/oid-field.json')
}

const renderers = {
  esriGeometryPolygon: require('../templates/renderers/symbology/polygon.json'),
  esriGeometryPolyline: require('../templates/renderers/symbology/line.json'),
  esriGeometryPoint: require('../templates/renderers/symbology/point.json'),
  classBreaks: require('../templates/renderers/classification/classBreaks.json'),
  uniqueValue: require('../templates/renderers/classification/uniqueValue.json')
}

/**
 * loads a template layer json file and attaches fields
 *
 * @param {object} featureCollection
 * @param {object} options
 * @return {object} template
 */
function renderLayer (featureCollection = {}, options = {}) {
  const json = _.cloneDeep(templates.layer)
  const data = featureCollection
  const metadata = data.metadata || {}
  if (!json) throw new Error('Unsupported operation')

  // These two rely on geojson, while everything else relies on the source data
  if (json.fullExtent) json.fullExtent = json.initialExtent = json.extent = metadata.extent || options.extent
  else if (json.extent) json.extent = metadata.extent || options.extent

  json.id = parseInt(options.layer) || 0
  if (json.geometryType) json.geometryType = options.geometryType
  if (json.spatialReference) json.spatialReference = computeSpatialReference(options.spatialReference)
  if (json.name && metadata.name) json.name = metadata.name
  if (json.description && metadata.description) json.description = metadata.description
  if (json.extent && metadata.extent) json.extent = computeExtent(metadata.extent)
  if (json.fields) json.fields = computeFieldObject(data, 'layer', options)
  if (json.type) json.type = isTable(json, data) ? 'Table' : 'Feature Layer'
  if (json.drawingInfo) json.drawingInfo.renderer = renderers[json.geometryType]
  if (json.timeInfo) json.timeInfo = metadata.timeInfo
  if (json.maxRecordCount) json.maxRecordCount = metadata.maxRecordCount || 1000
  if (json.displayField) json.displayField = metadata.displayField || json.fields[0].name
  if (json.objectIdField) json.objectIdField = metadata.idField || 'OBJECTID'
  return json
}

function renderFeatures (featureCollection = {}, options = {}) {
  const json = _.cloneDeep(templates.features)
  const data = featureCollection
  if (!json) throw new Error('Unsupported operation')

  if (json.geometryType) json.geometryType = options.geometryType
  if (json.spatialReference) json.spatialReference = computeSpatialReference(options.spatialReference)
  if (json.fields) json.fields = computeFieldObject(data, 'layer', options)
  if (json.features) json.features = data.features
  return json
}

function renderStatistics (featureCollection = {}, options = {}) {
  const json = _.cloneDeep(templates.statistics)
  const data = featureCollection
  if (!json) throw new Error('Unsupported operation')

  if (json.fields) json.fields = computeFieldObject(data, 'statistics', options)
  if (json.features) json.features = data.features
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

function renderStats (data) {
  let stats = data.statistics
  if (!Array.isArray(stats)) stats = [stats]
  const fields = data.metadata ? computeFieldObject(data) : createStatFields(stats)
  return {
    displayFieldName: '',
    fieldAliases: createFieldAliases(stats),
    fields,
    features: createStatFeatures(stats)
  }
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

function renderClassBreaks (breaks, classificationDef, geomType) {
  if (!Array.isArray(breaks) || !Array.isArray(breaks[0])) throw new Error('Breaks must be an array of break ranges')
  const json = _.cloneDeep(renderers.classBreaks)
  if (classificationDef) {
    json.field = classificationDef.classificationField
    json.classificationMethod = classificationDef.classificationMethod
  }
  json.minValue = breaks[0][0] // lower bound of first class break
  json.classBreakInfos = createClassBreakInfos(breaks, classificationDef, geomType)
  return json
}

function renderUniqueValue (breaks, classificationDef, geomType) {
  const json = _.cloneDeep(renderers.uniqueValue)
  json.field1 = classificationDef.uniqueValueFields[0]
  json.fieldDelimiter = classificationDef.fieldDelimiter
  json.uniqueValueInfos = createUniqueValueInfos(breaks, classificationDef, geomType)
  return json
}
