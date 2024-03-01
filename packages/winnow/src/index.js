const { setLogger } = require('./log-manager');

const {
  filterAndTransform,
  prepareFilterAndTransform,
} = require('./filter-and-transform');
const { query, prepareQuery } = require('./query');

module.exports = {
  query,
  prepareQuery,
  querySql: filterAndTransform,
  prepareSql: prepareFilterAndTransform,
  setLogger
};
