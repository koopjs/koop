const { normalizeArray } = require('./helpers');

function normalizeGroupBy (options) {
  const groupBy = options.groupBy || options.groupByFieldsForStatistics;
  return normalizeArray(groupBy);
}

module.exports = normalizeGroupBy;
