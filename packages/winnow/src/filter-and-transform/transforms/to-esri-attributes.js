const _ = require('lodash');
const logManager = require('../../logger');
const { createIntegerHash } = require('../helpers');

module.exports = function transformToEsriProperties (properties, geometry, delimitedDateFields, requiresObjectId, idField) {
  requiresObjectId = requiresObjectId === 'true';
  idField = idField === 'null' ? null : idField;

  const dateFields = delimitedDateFields.split(',');

  if (requiresObjectId && !idField) {
    properties = injectObjectId({ properties, geometry });
  }

  if (requiresObjectId && shouldLogIdFieldWarning(properties[idField])) {
    logManager.logger.debug(`OBJECTIDs created from provider's "idField" (${idField}: ${properties[idField]}) are not integers from 0 to 2147483647`);
  }

  return transformProperties(properties, dateFields);
};

function injectObjectId (feature) {
  const { properties, geometry } = feature;
  const OBJECTID = createIntegerHash(JSON.stringify({ properties, geometry }));
  return {
    ...properties,
    OBJECTID
  };
}

function shouldLogIdFieldWarning (idFieldValue) {
  return idFieldValue && (!Number.isInteger(idFieldValue) || idFieldValue > 2147483647);
}

function transformProperties (properties, dateFields) {
  return Object.entries(properties).reduce((transformedProperties, [key, value]) => {
    if (dateFields.includes(key)) {
      transformedProperties[key] = value === null ? null : new Date(value).getTime();
    } else if (_.isObject(value)) {
      transformedProperties[key] = JSON.stringify(value);
    } else {
      transformedProperties[key] = value;
    }
    return transformedProperties;
  }, {});
}
