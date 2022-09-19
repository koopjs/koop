const _ = require('lodash')
const moment = require('moment')
const fieldMap = require('./field-map')
const createFieldAliases = require('./aliases')
const createStatFields = require('./statFields')

module.exports = { computeFieldsFromProperties, computeFieldObject, createStatFields, createFieldAliases }

const templates = {
  server: require('../../templates/server.json'),
  layer: require('../../templates/layer.json'),
  features: require('../../templates/features.json'),
  statistics: require('../../templates/statistics.json'),
  field: require('../../templates/field.json'),
  objectIDField: require('../../templates/oid-field.json')
}

// TODO this should be the only exported function
function computeFieldObject (data, template, options = {}) {
  let oid = false
  const metadata = data.metadata || {}
  let metadataFields = metadata.fields

  if (!metadataFields && data.statistics) return computeFieldsFromProperties(data.statistics[0], template, options).fields
  else if (!metadataFields) return computeAggFieldObject(data, template, options)

  if (options.outFields && options.outFields !== '*') {
    const outFields = options.outFields.split(/\s*,\s*/)
    metadataFields = metadata.fields.filter(field => {
      if (outFields.indexOf(field.name) > -1) return field
    })
  }
  const fields = metadataFields.map(field => {
    let type
    if (field.name === metadata.idField || field.name.toLowerCase() === 'objectid') {
      type = 'esriFieldTypeOID'
      oid = true
    }
    const template = _.cloneDeep(templates.field)
    return Object.assign({}, template, {
      name: field.name,
      type: type || fieldMap[field.type.toLowerCase()] || field.type,
      alias: field.alias || field.name
    })
  })
  if (!oid) fields.push(templates.objectIDField)
  return fields
}

/** @type {Array} accepted date formats used by moment.js */
const DATE_FORMATS = [moment.ISO_8601]

/**
 * builds esri json fields object from geojson properties
 *
 * @param  {object} props
 * @param  {string} template
 * @param  {object} options
 * @return {object} fields
 */
function computeFieldsFromProperties (props, template, options = {}) {
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
      type: 'esriFieldTypeOID',
      alias: 'OBJECTID'
    })
  }

  return { oidField: 'OBJECTID', fields }
}

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

function computeAggFieldObject (data, template, options = {}) {
  const feature = data.features && data.features[0]
  const properties = feature ? feature.properties || feature.attributes : options.attributeSample
  if (properties) return computeFieldsFromProperties(properties, template, options).fields
  else return []
}
