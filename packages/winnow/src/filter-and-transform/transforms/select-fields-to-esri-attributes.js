const _ = require('lodash');
const toEsriAttributes = require('./to-esri-attributes');

function selectFieldsToEsriAttributes (properties, geometry, delimitedFields, dateFields, requiresObjectId, idField) {
  const transformedProperties = toEsriAttributes(properties, geometry, dateFields, requiresObjectId, idField);
  const fields = delimitedFields.split(',');
  return _.pick(transformedProperties, fields);
}

module.exports = selectFieldsToEsriAttributes;
