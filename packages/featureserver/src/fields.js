const moment = require('moment')
module.exports = fields

/** @type {Array} accepted date formats used by moment.js */
const DATE_FORMATS = [moment.ISO_8601]

/**
 * returns esri field type based on type of value passed
 *
 * @param {*} value - object to evaluate
 * @return {string} esri field type
 */
function fieldType (value) {
  var type = typeof value

  if (type === 'number') {
    return isInt(value) ? 'esriFieldTypeInteger' : 'esriFieldTypeDouble'
  } else if (typeof value === 'string' && moment(value, DATE_FORMATS, true).isValid()) {
    return 'esriFieldTypeDate'
  } else {
    return 'esriFieldTypeString'
  }
}

/**
 * is the value an integer?
 *
 * @param  {Number} value
 * @return {Boolean} is it an integer
 */
function isInt (value) {
  return Math.round(value) === value
}

/**
 * builds esri json fields object from geojson properties
 *
 * @param  {object} props
 * @param  {string} template
 * @param  {object} options
 * @return {object} fields
 */
function fields (props, template, options) {
  const fields = Object.keys(props).map((key, i) => {
    const type = fieldType(props[key])
    const field = { name: key, type: type, alias: key }

    if (type === 'esriFieldTypeString') field.length = 128
    else if (type === 'esriFieldTypeDate') field.length = 36
    return field
  })
  if (template === 'layer' && Object.keys(props).indexOf('OBJECTID') < 0) {
    fields.push({
      name: 'OBJECTID',
      type: 'esriFieldTypeInteger',
      alias: 'OBJECTID'
    })
  }

  return { oidField: 'OBJECTID', fields }
}
