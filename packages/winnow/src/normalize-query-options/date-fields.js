const _ = require('lodash');
/**
 * @param {object} collection - the GeoJSON object from Koop (with features omitted)
 * @param {*} requestedFields
 */
function deriveDateFields (collection, requestedFields) {
  if (!_.get(collection, 'metadata.fields')) return [];

  return collection.metadata.fields.filter(({ type, name }) => {
    return type === 'Date' && (requestedFields === undefined || requestedFields.indexOf(name) > -1);
  }).map(({ name }) => {
    return name;
  });
}

module.exports = deriveDateFields;
