const _ = require('lodash')
const Utils = require('../utils')
const chalk = require('chalk')

function logWarnings (geojson, format) {
  const { metadata = {}, features } = geojson
  const esriFormat = format !== geojson

  if (esriFormat && !metadata.idField) {
    console.warn(chalk.yellow('WARNING: requested provider has no "idField" assignment. You will get the most reliable behavior from ArcGIS clients if the provider assigns the "idField" to a property that is an unchanging 32-bit integer. Koop will create an OBJECTID field in the absence of an "idField" assignment.'))
  }

  if (esriFormat && hasMixedCaseObjectIdKey(metadata.idField)) {
    console.warn(chalk.yellow('WARNING: requested provider\'s "idField" is a mixed-case version of "OBJECTID". This can cause errors in ArcGIS clients.'))
  }

  // Compare provider metadata fields to feature properties
  // TODO: refactor
  if (metadata.fields && _.has(features, '[0].properties')) {
    warnOnMetadataFieldDiscrepancies(geojson.metadata.fields, geojson.features[0].properties)
  }
}

function hasMixedCaseObjectIdKey (idField = '') {
  return idField.toLowerCase() === 'objectid' && idField !== 'OBJECTID'
}

/**
 * Compare fields generated from metadata to properties of a data feature.
 * Warn if differences discovered
 * @param {*} metadataFields
 * @param {*} properties
 */
function warnOnMetadataFieldDiscrepancies (metadataFields, featureProperties) {
  // build a comparison collection from the data samples properties
  const featureFields = Object.keys(featureProperties).map(name => {
    return {
      name,
      type: Utils.detectType(featureProperties[name])
    }
  })

  // compare metadata to feature properties; identifies fields defined in metadata that are not found in feature properties
  // or that have a metadata type definition inconsistent with feature property's value
  metadataFields.forEach(field => {
    // look for a defined field in the features properties
    const featureField = _.find(featureFields, ['name', field.name]) || _.find(featureFields, ['name', field.alias])
    if (!featureField || (field.type !== featureField.type && !(field.type === 'Date' && featureField.type === 'Integer') && !(field.type === 'Double' && featureField.type === 'Integer'))) {
      console.warn(chalk.yellow(`WARNING: requested provider's metadata field "${field.name} (${field.type})" not found in feature properties)`))
    }
  })

  // compare feature properties to metadata fields; identifies fields found on feature that are not defined in metadata field array
  featureFields.forEach(field => {
    const noNameMatch = _.find(metadataFields, ['name', field.name])
    const noAliasMatch = _.find(metadataFields, ['alias', field.name])

    // Exclude warnings on feature fields named OBJECTID because OBJECTID may have been added by winnow in which case it should not be in the metadata fields array
    if (!(noNameMatch || noAliasMatch) && field.name !== 'OBJECTID') {
      console.warn(chalk.yellow(`WARNING: requested provider's features have property "${field.name} (${field.type})" that was not defined in metadata fields array)`))
    }
  })
}

module.exports = { logWarnings }
