const _ = require('lodash');
const { getDataTypeFromValue } = require('../helpers');
const { logger } = require('../logger');

function logWarnings(geojson, format) {
  const { metadata = {}, features } = geojson;
  const esriFormat = format !== geojson;

  if (esriFormat && !metadata.idField) {
    logger.debug(
      'requested provider has no "idField" assignment. You will get the most reliable behavior from ArcGIS clients if the provider assigns the "idField" to a property that is an unchanging 32-bit integer. An OBJECTID field will be auto-generated in the absence of an "idField" assignment.',
    );
  }

  if (esriFormat && hasMixedCaseObjectIdKey(metadata.idField)) {
    logger.debug(
      'requested provider\'s "idField" is a mixed-case version of "OBJECTID". This can cause errors in ArcGIS clients.',
    );
  }

  if (metadata.fields && _.has(features, '[0].properties')) {
    warnOnMetadataFieldDiscrepancies(
      geojson.metadata.fields,
      geojson.features[0].properties,
    );
  }
}

function hasMixedCaseObjectIdKey(idField = '') {
  return idField.toLowerCase() === 'objectid' && idField !== 'OBJECTID';
}

/**
 * Compare fields generated from metadata to properties of a data feature.
 * Warn if differences discovered
 * @param {*} fieldDefinitions
 * @param {*} properties
 */
function warnOnMetadataFieldDiscrepancies(fieldDefinitions, featureProperties) {
  compareFieldDefintionsToFeature(fieldDefinitions, featureProperties);
  
  compareFeatureToFieldDefinitions(featureProperties, fieldDefinitions);
}

function compareFieldDefintionsToFeature(fieldDefinitions, featureProperties) {
  fieldDefinitions.forEach(({ name, alias, type }) => {
    // look for a defined field in the features properties
    const featureField = findFeatureProperty(featureProperties, name, alias);

    if (!featureField || hasTypeMismatch(type, featureField)) {
      logger.debug(
        `field definition "${name} (${type})" not found in first feature of provider's GeoJSON`,
      );
    }
  });
}

function compareFeatureToFieldDefinitions(featureProperties, fieldDefinitions) {
  Object.keys(featureProperties).forEach(key => {
    const definition = _.find(fieldDefinitions, ['name', key]) || _.find(fieldDefinitions, ['name', key]);

    if (!definition && key !== 'OBJECTID') {
      logger.debug(
        `requested provider's features have property "${key}" that was not defined in metadata fields array)`,
      );
    }
  });
}

function findFeatureProperty(properties, name, alias) {
  return properties[name] || properties[alias];
}

function hasTypeMismatch (definitionType, value) {
  const propertyType = getDataTypeFromValue(value);

  return definitionType !== propertyType &&
      !isEsriTypeMatchException(definitionType, propertyType);
}

function isEsriTypeMatchException (definitionType, propertyType) {
  if (definitionType === 'Date' || definitionType === 'Double') {
    return propertyType === 'Integer';
  }
}

module.exports = { logWarnings };
