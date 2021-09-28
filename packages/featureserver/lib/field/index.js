const _ = require('lodash')
const chalk = require('chalk')
const createFieldAliases = require('./aliases')
const createStatFields = require('./statFields')
const { detectType, esriTypeMap } = require('../utils')

// computeFieldCollection exported as computeFieldObject to maintain backward compatability. TODO: change on next major revision
module.exports = { computeFieldsFromProperties, computeFieldObject: computeFieldsCollection, createStatFields, createFieldAliases }

const templates = {
  server: require('../../templates/server.json'),
  layer: require('../../templates/layer.json'),
  features: require('../../templates/features.json'),
  statistics: require('../../templates/statistics.json'),
  field: require('../../templates/field.json'),
  objectIDField: require('../../templates/oid-field.json')
}

// TODO this should be the only exported function
/**
 * generate a collection of esri field objects based on metadata or from inspection of a sample feature
 * @param {object} data
 * @param {string} requestContext
 * @param {object} options
 * @return {[object]}
 */
function computeFieldsCollection (data, requestContext, options = {}) {
  const metadata = data.metadata || {}
  const feature = data.features && data.features[0]
  // Fields are being calculated from a single feature; TODO: should these be calculated using the whole dataset?
  const properties = feature ? feature.properties || feature.attributes : options.attributeSample

  // If no metadata fields defined, compute fields from data properties
  const fieldsOptions = Object.assign({}, options, { idField: metadata.idField })
  if (!metadata.fields && data.statistics) return computeFieldsFromProperties(data.statistics[0], requestContext, fieldsOptions).fields
  else if (!metadata.fields) return computeFieldsFromProperties(properties, requestContext, fieldsOptions).fields

  // Use metadata fields and request parameters to construct an array of requested fields
  const requestedFields = computeFieldsFromMetadata(metadata.fields, { outFields: options.outFields, idField: metadata.idField })

  // Loop through the requested response fields and create a field object for each
  const responsefields = requestedFields.map(field => {
    return computeFieldObject(field.name, {
      alias: field.alias,
      type: field.type,
      length: field.length,
      context: requestContext,
      idField: metadata.idField,
      domain: field.domain,
      editable: field.editable,
      nullable: field.nullable
    })
  })
  // Ensure the OBJECTID field is first in the array
  const idFieldIndex = responsefields.findIndex(field => field.type === templates.objectIDField.type)
  if (idFieldIndex !== -1) {
    responsefields.unshift(responsefields.splice(idFieldIndex, 1)[0])
  }

  return responsefields
}

/**
 * generate an esri field object
 * @param {string} name
 * @param {object} options
 * @return {object}
 */
function computeFieldObject (name, options = {}) {
  let outputField
  const { alias = name, type = 'string', length, context, idField, domain, editable = false, nullable } = options

  // Identify objectIdField with the name that matches the metadata idField or the default name "OBJECTID"
  if (name === idField || name === 'OBJECTID') {
    // objectIdField has special field object values that come from a template
    outputField = Object.assign({}, templates.objectIDField, { name, alias })

    // If this field is named OBJECTID, but the idField is assigned to something else, the type needs to be changed to avoid multiple fields of type "esriFieldTypeOID"
    if (name === 'OBJECTID' && idField && idField !== 'OBJECTID') outputField.type = esriTypeMap(type.toLowerCase())
  } else {
    // Determine the ESRI field type
    const esriType = esriTypeMap(type.toLowerCase())

    outputField = Object.assign({}, templates.field, {
      name,
      type: esriType,
      alias
    })

    // Use field length if defined, else defaults for String and Date types
    outputField.length = length || ((type.toLowerCase() === 'string') ? 128 : (type === 'Date') ? 36 : undefined)
  }

  // Layer service field objects have addition 'editable' and 'nullable' properties
  if (context === 'layer') {
    Object.assign(outputField, {
      editable: editable,
      domain: domain || null,
      nullable: typeof nullable !== 'undefined' ? nullable : false
    })
  }

  // Create the field object by overriding a template with field specific property values
  return outputField
}

/**
 * builds esri json fields collection from geojson properties
 *
 * @param  {object} props
 * @param  {string} requestContext
 * @param  {object} options
 * @return {object} fields
 */
function computeFieldsFromProperties (properties, requestContext, options = {}) {
  let oidField = 'OBJECTID'

  // If no properties, return an empty array
  if (!properties) return []

  // Loop through the properties and construct an array of field objects
  const fields = Object.keys(properties).map((key) => {
    return computeFieldObject(key, {
      alias: key,
      type: detectType(properties[key]),
      context: requestContext,
      idField: options.idField
    })
  })

  // If an idField has been set in metadata, ensure that the field is found in the feature properties
  let hasIdField
  if (options.idField) {
    hasIdField = _.find(fields, { name: options.idField })
    if (hasIdField) oidField = options.idField
    else console.warn(chalk.yellow(`WARNING: provider's "idField" is set to ${options.idField}, but this key is not found in the GeoJSON properties`))
  }

  // If this a layer service request and there is no set idField, add OBJECTID field if its not already a field. Decorate the with additional properties needed for layer service
  if (requestContext === 'layer' && !hasIdField && !_.find(fields, { name: 'OBJECTID' })) {
    fields.push(Object.assign({}, templates.objectIDField, {
      editable: false,
      nullable: false
    }))
  }

  // Ensure the idField field is first in the array
  fields.unshift(fields.splice(fields.findIndex(field => field.name === oidField), 1)[0])

  return { oidField, fields }
}

/**
 * builds esri json fields collection from metadata
 * @param {[Object]} metadataFields collection of fields defined in metadata
 * @return {[Object]} collection of esri json fields
 */
function computeFieldsFromMetadata (metadataFields, options = {}) {
  // Clone metadata to prevent mutation
  let responseFields = _.clone(metadataFields)

  let hasIdField
  if (options.idField) {
    hasIdField = _.find(metadataFields, { name: options.idField })
    if (!hasIdField) console.warn(chalk.yellow(`WARNING: provider's "idField" is set to ${options.idField}, but this field is not defined in metadata.fields`))
  }

  // If no idField and OBJECTID if it isn't already a metadata field, add it
  if (!hasIdField && !_.find(metadataFields, { name: 'OBJECTID' })) responseFields.push({ name: 'OBJECTID', type: 'integer' })

  // If outFields were specified and not wildcarded, create a subset of fields from metadata fields based on outFields param
  if (options.outFields && options.outFields !== '*') {
    // Split comma-delimited outFields
    const outFields = options.outFields.split(/\s*,\s*/)

    // Filter out fields that weren't included in the outFields param
    responseFields = responseFields.filter(field => {
      return outFields.includes(field.name)
    })
  }
  return responseFields
}
