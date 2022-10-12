const _ = require('lodash');

function selectFields (properties, delimitedFields) {
  const fields = delimitedFields.split(',');
  return _.pick(properties, fields);
}

module.exports = selectFields;
