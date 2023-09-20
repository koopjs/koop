const _ = require('lodash');
const { getDataTypeFromValue } = require('../helpers');
const logManager = require('../log-manager');

function logWarnings(geojson, format) {
  const { metadata = {}, features } = geojson;
  const esriFormat = format !== geojson;

  const properties = _.get(features, '[0].properties') || _.get(features, '[0].attributes');

  if (esriFormat && !metadata.idField && properties?.OBJECTID === undefined) {
    logManager.logger.debug(
      `provider data has no OBJECTID and has no "idField" assignment. You will get the most reliable behavior from ArcGIS clients if the provider assigns the "idField" to a property that is an integer in range 0 - ${Number.MAX_SAFE_INTEGER}. An OBJECTID field will be auto-generated in the absence of an "idField" assignment.`,
    );
  }

  if (esriFormat && hasMixedCaseObjectIdKey(metadata.idField)) {
    logManager.logger.debug(
      'requested provider has "idField" that is a mixed-case version of "OBJECTID". This can cause errors in ArcGIS clients.',
    );
  }

  if (metadata.fields && properties) {
    compareFieldDefintionsToFeature(metadata.fields, properties);
  
    compareFeatureToFieldDefinitions(properties, metadata.fields);
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
