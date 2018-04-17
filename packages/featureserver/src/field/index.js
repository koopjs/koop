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
  const metadata = data.metadata || {}
  let responseFields = metadata.fields

  if (!metadata.fields && data.statistics) return computeFieldsFromProperties(data.statistics[0], template, options).fields
  else if (!metadata.fields) return computeAggFieldObject(data, template, options)

  // Add OBJECTID if it isn't already a metadata field
  if (!_.find(responseFields, {'name': 'OBJECTID'})) responseFields.push({name: 'OBJECTID'})

  // If outFields were specified and not wildcarded, create a subset of fields from metadata fields based on outFields param
  if (options.outFields && options.outFields !== '*') {
    // Split comma-delimited outFields
    const outFields = options.outFields.split(/\s*,\s*/)

    // Filter out fields that weren't included in the outFields param
    responseFields = responseFields.filter(field => {
      return outFields.includes(field.name)
    })
  }

  // Loop through the requested response fields and create a field object for each
  const fields = responseFields.map(field => {
    // Fields named OBJECTID get special definition with specific JSON template
    if (field.name === 'OBJECTID') {
      return templates.objectIDField
    }

    // Determine the ESRI field type
    const type = fieldMap[field.type.toLowerCase()] || field.type

    // Create the field object by overriding a template with field specific property values
    return Object.assign({}, templates.field, {
      name: field.name,
      type,
      alias: field.alias || field.name,
      // Add length property for strings and dates
      length: (type === 'esriFieldTypeString') ? 128 : (type === 'esriFieldTypeDate') ? 36 : undefined
    })
  })

  // Ensure the OBJECTID field is first in the array
  fields.unshift(fields.splice(fields.findIndex(field => field.name === 'OBJECTID'), 1)[0])

  return fields
}

/** @type {Array} accepted date formats used by moment.js */
const DATE_FORMATS = [moment.ISO_8601]

/**
 * builds esri json fields object from geojson properties.  Populates the `fields` array for layer info service
 *
 * @param  {object} props
 * @param  {string} template
 * @param  {object} options
 * @return {object} fields
 */
function computeFieldsFromProperties (props, template, options = {}) {
  // Loop through the properties and construct an array of field objects
  const fields = Object.keys(props).map((key, i) => {
    const type = fieldType(props[key])

    // Use field template and override. Add properties needed specifically for layer service
    return Object.assign({}, templates.field, {
      name: key,
      type: fieldType(props[key]),
      alias: key,
      editable: false,
      nullable: false,
      length: (type === 'esriFieldTypeString') ? 128 : (type === 'esriFieldTypeDate') ? 36 : undefined
    })
  })

  // If this is part of a layer service, add OBJECTID field if its not already a model field. Decorate the with additional properties needed for layer service
  if (template === 'layer' && !_.find(fields, { name: 'OBJECTID' })) {
    fields.push(Object.assign({}, templates.objectIDField, {
      editable: false,
      nullable: false
    }))
  }

  // Ensure the OBJECTID field is first in the array
  fields.unshift(fields.splice(fields.findIndex(field => field.name === 'OBJECTID'), 1)[0])

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
