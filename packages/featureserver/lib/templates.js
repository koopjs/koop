const _ = require('lodash')
const { getExtent } = require('./utils')
const getGeometryTypeFromGeojson = require('./helpers/get-geometry-type-from-geojson')
const isTable = require('./helpers/is-geojson-table')
const { computeFieldObject } = require('./field')
const { normalizeSpatialReference, computeExtent } = require('./geometry')
const { createClassBreakInfos, createUniqueValueInfos } = require('./generateRenderer/createClassificationInfos')
const getCollectionCrs = require('./helpers/get-collection-crs')
module.exports = { renderLayer, renderClassBreaks, renderUniqueValue }

const templates = {
  layer: Object.assign(require('../templates/layer.json'), require('../templates/version.json')),
  features: require('../templates/features.json')
}

const renderers = {
  esriGeometryPolygon: require('../templates/renderers/symbology/polygon.json'),
  esriGeometryPolyline: require('../templates/renderers/symbology/line.json'),
  esriGeometryPoint: require('../templates/renderers/symbology/point.json'),
  esriGeometryMultipoint: require('../templates/renderers/symbology/point.json'),
  classBreaks: require('../templates/renderers/classification/classBreaks.json'),
  uniqueValue: require('../templates/renderers/classification/uniqueValue.json')
}

/**
 * Modifies a template layer json file with metadata, capabilities, and data from the model
 * @param {object} data - data from provider model
 * @param {object} options
 * @return {object} layer info
 */
function renderLayer (data = {}, { params = {}, query = {} } = {}) {
  const json = _.cloneDeep(templates.layer)
  const metadata = data.metadata || {}
  const capabilities = data.capabilities || {}
  // force an empty array of features if missing
  if (!data.features) {
    data.features = []
  }

  // Use options, metadata, and or feature data to override template values
  json.id = parseInt(params.layer) || 0
  json.fields = computeFieldObject(data, 'layer', params)
  json.type = isTable(data) ? 'Table' : 'Feature Layer'
  json.geometryType = getGeometryTypeFromGeojson(data)
  json.drawingInfo.renderer = metadata.renderer || renderers[json.geometryType]
  var spatialReference = getServiceSpatialReference(data, query)
  json.extent = metadata.extent ? computeExtent(metadata.extent, spatialReference) : computeExtent(getExtent(data), spatialReference)

  if (metadata.relationships) json.relationships = metadata.relationships
  if (metadata.name) json.name = metadata.name
  if (metadata.description) json.description = metadata.description
  if (metadata.idField) {
    json.objectIdField = metadata.idField
    json.displayField = metadata.idField
    json.uniqueIdField.name = metadata.idField
  }
  if (metadata.capabilities) { json.capabilities = metadata.capabilities }
  if (metadata.templates) { json.templates = metadata.templates }
  if (metadata.displayField) json.displayField = metadata.displayField
  if (metadata.timeInfo) json.timeInfo = metadata.timeInfo
  if (metadata.maxRecordCount) json.maxRecordCount = metadata.maxRecordCount || 2000
  if (metadata.id !== undefined) json.id = metadata.id
  if (metadata.defaultVisibility !== undefined) json.defaultVisibility = metadata.defaultVisibility
  if (metadata.minScale !== undefined) json.minScale = metadata.minScale
  if (metadata.maxScale !== undefined) json.maxScale = metadata.maxScale
  if (capabilities.quantization) json.supportsCoordinatesQuantization = true
  if (capabilities.extract) json.capabilities = `${json.capabilities},Extract`
  // Override the template value for hasStatic data if model metadata has this value set
  if (typeof metadata.hasStaticData === 'boolean') json.hasStaticData = metadata.hasStaticData
  return json
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

function getServiceSpatialReference (collection, {
  inputCrs,
  sourceSR
}) {
  const spatialReference = inputCrs || sourceSR || getCollectionCrs(collection) || 4326

  const { latestWkid, wkid, wkt } = normalizeSpatialReference(spatialReference)

  if (wkid) {
    return { wkid, latestWkid }
  }

  return { wkt }
}
