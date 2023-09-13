const _ = require('lodash');
const { getDataTypeFromValue } = require('../helpers');
const logManager = require('../logger');

function logWarnings(geojson, format) {
  const { metadata = {}, features } = geojson;
  const esriFormat = format !== geojson;

  if (esriFormat && !metadata.idField) {
    logManager.logger.debug(
      'requested provider has no "idField" assignment. You will get the most reliable behavior from ArcGIS clients if the provider assigns the "idField" to a property that is an unchanging 32-bit integer. An OBJECTID field will be auto-generated in the absence of an "idField" assignment.',
    );
  }

  if (esriFormat && hasMixedCaseObjectIdKey(metadata.idField)) {
    logManager.logger.debug(
      'requested provider has "idField" that is a mixed-case version of "OBJECTID". This can cause errors in ArcGIS clients.',
    );
  }

  if (metadata.fields && _.has(features, '[0].properties')) {
    compareFieldDefintionsToFeature(metadata.fields, features[0].properties);
  
    compareFeatureToFieldDefinitions(features[0].properties, metadata.fields);
  }
}

function hasMixedCaseObjectIdKey(idField = '') {
  return idField.toLowerCase() === 'objectid' && idField !== 'OBJECTID';
}

function compareFieldDefintionsToFeature(fieldDefinitions, featureProperties) {
  fieldDefinitions.forEach(({ name, alias, type }) => {
    // look for a defined field in the features properties
    const featureField = findFeatureProperty(featureProperties, name, alias);

    if (!featureField || hasTypeMismatch(type, featureField)) {
      logManager.logger.debug(
        `field definition "${name} (${type})" not found in first feature of provider's GeoJSON`,
      );
    }
  });
}

function compareFeatureToFieldDefinitions(featureProperties, fieldDefinitions) {
  Object.keys(featureProperties).forEach(key => {
    const definition = _.find(fieldDefinitions, ['name', key]) || _.find(fieldDefinitions, ['name', key]);

    if (!definition && key !== 'OBJECTID') {
      logManager.logger.debug(
        `requested provider has feature with property "${key}" that was not defined in metadata fields array`,
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
