const _ = require('lodash')
const { createIntegerHash } = require('../helpers')

module.exports = function transformToEsriProperties (inputProperties, geometry, delimitedDateFields, requiresObjectId, idField) {
  requiresObjectId = requiresObjectId === 'true'
  idField = idField === 'null' ? null : idField

  const dateFields = delimitedDateFields.split(',')
  const properties = transformProperties(inputProperties, dateFields)

  if (requiresObjectId && !idField) {
    return injectObjectId({ properties, geometry })
  } else if (requiresObjectId && shouldLogIdFieldWarning(properties[idField])) {
    console.warn(`WARNING: OBJECTIDs created from provider's "idField" (${idField}: ${inputProperties[idField]}) are not integers from 0 to 2147483647`)
  }

  return properties
}

function injectObjectId (feature) {
  const { properties } = feature
  const OBJECTID = createIntegerHash(JSON.stringify(feature))
  return {
    ...properties,
    OBJECTID
  }
}

function shouldLogIdFieldWarning (idField) {
  return process.env.NODE_ENV !== 'production' &&
    process.env.KOOP_WARNINGS !== 'suppress' &&
    (!Number.isInteger(idField) || idField > 2147483647)
}

function transformProperties (properties, dateFields) {
  return Object.entries(properties).reduce((transformedProperties, [key, value]) => {
    if (dateFields.includes(key)) {
      transformedProperties[key] = value === null ? null : new Date(value).getTime()
    } else if (_.isObject(value)) {
      transformedProperties[key] = JSON.stringify(value)
    } else {
      transformedProperties[key] = value
    }
    return transformedProperties
  }, {})
}
