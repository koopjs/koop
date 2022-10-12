const { create: createSqlStatement } = require('../sql-query-builder');
const normalizeQueryOptions = require('../normalize-query-options');
const standardQuery = require('./standard-query');

module.exports = function uniqueValueQuery (features, { fields } = {}) {
  if (fields.length > 3) throw new Error('Cannot classify using more than three fields');

  fields.map(field => {
    if (!features[0].properties[field]) throw new Error(`Unknown field: ${field}`);
  });

  const uniqueValueOptions = {
    aggregates: [
      {
        type: 'count',
        field: fields[0], // arbitrary field choice
        name: 'count'
      }
    ],
    groupBy: fields
  };

  const options = normalizeQueryOptions(uniqueValueOptions, features);
  const sql = createSqlStatement(options);
  return standardQuery(features, sql, { ...options, skipLimitHandling: true });
};
