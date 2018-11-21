const _ = require('lodash')
const esriExtent = require('esri-extent')
const { geometryMap } = require('./geometry')
const moment = require('moment')
const DATE_FORMATS = [moment.ISO_8601]

module.exports = { isTable, getExtent, getGeomType, detectType, esriTypeMap }

/**
 * Determine if the layer is a Table
 *
 * @param {object} data
 * @return {boolean}
 */
function isTable (data) {
  // geometry indicates this in not a table
  const geometryType = (data.metadata && data.metadata.geometryType) || getGeomType(data)
  if (geometryType) return false

  // Check for a valid fullExtent. If unset, assume this is a Table
  const fullExtent = data.fullExtent || (data.metadata && data.metadata.fullExtent)
  if (_.isUndefined(fullExtent) || _.isUndefined(fullExtent.xmin) || _.isUndefined(fullExtent.ymin) || fullExtent.xmin === Infinity) return true

  // Otherwise assume a feature layer
  return false
}

function getExtent (geojson) {
  if (geojson.metadata && geojson.metadata.extent) return geojson.metadata.extent
  else return esriExtent(geojson)
}

const esriGeomTypes = {
  polygon: 'esriGeometryPolygon',
  linestring: 'esriGeometryPolyline',
  point: 'esriGeometryPoint'
}

function getGeomType (geojson = {}) {
  // TODO this should find the first non-null geometry
  if (geojson.metadata && geojson.metadata.geometryType) return geometryMap[geojson.metadata.geometryType]
  if (!geojson.features || !geojson.features[0]) return undefined
  const feature = geojson.features[0]
  if (!feature || !feature.geometry || !feature.geometry.type) return undefined
  const type = esriGeomTypes[feature.geometry.type.toLowerCase()]
  return type
}

/**
 * returns data type based on type of value passed
 *
 * @param {*} value - object to evaluate
 * @return {string} data type
 */
function detectType (value) {
  var type = typeof value

  if (type === 'number') {
    return Number.isInteger(value) ? 'Integer' : 'Double'
  } else if (type && moment(value, DATE_FORMATS, true).isValid()) {
    return 'Date'
  } else {
    return 'String'
  }
}

/**
 * returns converts type to ESRI field type
 * @param {string} type string representation of data type
 * @return {string} string representation of ESRI data type
 */
function esriTypeMap (type) {
  switch (type.toLowerCase()) {
    case 'double':
      return 'esriFieldTypeDouble'
    case 'integer':
      return 'esriFieldTypeInteger'
    case 'date':
      return 'esriFieldTypeDate'
    case 'blob':
      return 'esriFieldTypeBlob'
    case 'geometry':
      return 'esriFieldTypeGeometry'
    case 'globalid':
      return 'esriFieldTypeGlobalID'
    case 'guid':
      return 'esriFieldTypeGUID'
    case 'raster':
      return 'esriFieldTypeRaster'
    case 'single':
      return 'esriFieldTypeSingle'
    case 'smallinteger':
      return 'esriFieldTypeSmallInteger'
    case 'xml':
      return 'esriFieldTypeXML'
    case 'string':
    default:
      return 'esriFieldTypeString'
  }
}
