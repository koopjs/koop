const _ = require('lodash');
const { getDataTypeFromValue } = require('../helpers');
const { logger } = require('../logger');

function logWarnings(geojson, format) {
  const { metadata = {}, features } = geojson;
  const esriFormat = format !== geojson;

  if (esriFormat && !metadata.idField) {
    logger.debug(
      'requested provider has no "idField" assignment. You will get the most reliable behavior from ArcGIS clients if the provider assigns the "idField" to a property that is an unchanging 32-bit integer. Koop will create an OBJECTID field in the absence of an "idField" assignment.',
    );
  }

  if (esriFormat && hasMixedCaseObjectIdKey(metadata.idField)) {
    logger.debug(
      'requested provider\'s "idField" is a mixed-case version of "OBJECTID". This can cause errors in ArcGIS clients.',
    );
  }

  // Compare provider metadata fields to feature properties
  // TODO: refactor
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
  // build a comparison collection from the data samples properties
  const featureFields = Object.keys(featureProperties).map((name) => {
    return {
      name,
      type: getDataTypeFromValue(featureProperties[name]),
    };
  });

  compareFieldDefintionsToFeature(fieldDefinitions, featureProperties);
  
  // compare feature properties to metadata fields; identifies fields found on feature that are not defined in metadata field array
  featureFields.forEach((field) => {
    const noNameMatch = _.find(fieldDefinitions, ['name', field.name]);
    const noAliasMatch = _.find(fieldDefinitions, ['alias', field.name]);

    // Exclude warnings on feature fields named OBJECTID because OBJECTID may have been added by winnow in which case it should not be in the metadata fields array
    if (!(noNameMatch || noAliasMatch) && field.name !== 'OBJECTID') {
      logger.debug(
        `requested provider's features have property "${field.name} (${field.type})" that was not defined in metadata fields array)`,
      );
    }
  });
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
