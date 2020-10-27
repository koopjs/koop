const { createIntegerHash } = require('../helpers')

module.exports = function transformToEsriProperties (properties, geometry, dateFields, requiresObjectId, idField) {
  requiresObjectId = requiresObjectId === 'true'
  idField = idField === 'null' ? null : idField
  const transformedDateFields = transformDateFields(properties, dateFields)
  const transformedProperties = { ...properties, ...transformedDateFields }

  if (requiresObjectId) {
    if (!idField) {
      const OBJECTID = createIntegerHash(JSON.stringify({ properties: transformedProperties, geometry }))
      return { ...transformedProperties, OBJECTID }
    }

    if (shouldLogIdFieldWarning(properties[idField])) {
      console.warn(`WARNING: OBJECTIDs created from provider's "idField" (${idField}: ${properties[idField]}) are not integers from 0 to 2147483647`)
    }
  }
  return transformedProperties
}

function shouldLogIdFieldWarning (idField) {
  return process.env.NODE_ENV !== 'production' &&
    process.env.KOOP_WARNINGS !== 'suppress' &&
    (!Number.isInteger(idField) || idField > 2147483647)
}

function transformDateFields (properties, delimitedDateFields) {
  if (delimitedDateFields.length === 0) return properties
  const dateFields = delimitedDateFields.split(',')

  return dateFields.reduce((acc, field) => {
    const value = properties[field]
    acc[field] = value === null ? null : new Date(value).getTime()
    return acc
  }, {})
}
