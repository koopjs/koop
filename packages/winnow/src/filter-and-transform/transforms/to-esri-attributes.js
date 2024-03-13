const _ = require('lodash');
const logManager = require('../../log-manager');
const { createIntegerHash } = require('../helpers');

module.exports = function transformToEsriProperties (properties, geometry, delimitedDateFields, requiresObjectId, idField) {
  requiresObjectId = requiresObjectId === 'true';
  idField = idField === 'null' ? null : idField;

  const dateFields = delimitedDateFields.split(',');

  if (requiresObjectId && !idField) {
    properties = injectObjectId({ properties, geometry });
  } else if (requiresObjectId && shouldLogIdFieldDataTypeWarning(properties[idField])) {
    logManager.logger.debug(`Unique-identifier ("${idField}") has a value (${properties[idField]}) that is not an integer-type, it is a ${typeof properties[idField]}; this may cause problems in some clients.`);
  } else if (requiresObjectId && shouldLogIdFieldRangeWarning(properties[idField])) {
    logManager.logger.debug(`Unique-identifier ("${idField}") has a value (${properties[idField]}) that is not a valid integer range (0 to ${Number.MAX_SAFE_INTEGER}); this may cause problems in some clients.`);
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

function shouldLogIdFieldDataTypeWarning (idFieldValue) {
  return idFieldValue && !Number.isInteger(idFieldValue);
}

function shouldLogIdFieldRangeWarning (idFieldValue) {
  return idFieldValue && (idFieldValue < 0 || idFieldValue > Number.MAX_SAFE_INTEGER);
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
