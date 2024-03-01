const _ = require('lodash');
const logManager = require('../log-manager');
/**
 * Ensure idField is set if metadata doesn't have a value but a field named OBJECTID is present
 * @param {object} metadata
 */
function normalizeIdField (options, features = []) {
  const metadata = _.get(options, 'collection.metadata');
  const idField = extractIdField(metadata, features[0]);

  if (shouldWarnIdFieldIsMissingFromData(idField, features)) {
    logManager.logger.debug('requested provider has "idField" assignment, but this property is not found in properties of all features.');
  }

  return idField;
}

function extractIdField ({ idField, fields } = {}, feature = {}) {
  if (idField) {
    return idField;
  }

  // metadata.idField is not set, but fields array includes OBJECTID, use that as idField
  if (_.find(fields, { name: 'OBJECTID' })) {
    return 'OBJECTID';
  }

  const properties = feature.properties || feature.attributes;
  if (_.has(properties, 'OBJECTID') && properties.OBJECTID !== null) { 
    return 'OBJECTID';
  }

  return null;
}

function shouldWarnIdFieldIsMissingFromData (idField, features) {
  if (!idField || features.length === 0) {
    return;
  }

  const propertiesFromFirstFeature = _.get(features, '[0].properties') || _.get(features, '[0].attributes', {});
  return propertiesFromFirstFeature[idField] === undefined;
}

module.exports = normalizeIdField;
