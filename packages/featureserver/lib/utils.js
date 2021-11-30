const esriExtent = require('esri-extent')
const moment = require('moment')
const DATE_FORMATS = [moment.ISO_8601]

module.exports = { getExtent, detectType, esriTypeMap }

function getExtent (geojson) {
  if (geojson.metadata && geojson.metadata.extent) return geojson.metadata.extent
  else return esriExtent(geojson)
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
