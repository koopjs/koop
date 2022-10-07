const _ = require('lodash');
const { normalizeArray } = require('./helpers');
/**
 * Normalize the fields option
 * @param {Object} options
 */
function normalizeFields (options) {
  const { returnIdsOnly, outFields, collection } = options;
  const idField = _.get(collection, 'metadata.idField');
  // returnIdsOnly overrules all other fields options values
  if (returnIdsOnly === true && idField) return [idField];
  if (returnIdsOnly === true) return ['OBJECTID'];

  const fields = options.fields || outFields;
  // * is Geoservices equivalent of "all fields", so set to undefined
  if (fields === '*') return undefined;
  return normalizeArray(fields);
}

module.exports = normalizeFields;
