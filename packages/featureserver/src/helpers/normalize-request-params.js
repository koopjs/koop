const _ = require('lodash');
const defaults = require('../metadata-defaults');
const { combineBodyQueryParameters } = require('./combine-body-query-params');

function normalizeRequestParameters(query, body, maxRecordCount = defaults.maxRecordCount()) {
  const requestParams = combineBodyQueryParameters(body, query);

  const { resultRecordCount, ...params } = _.mapValues(requestParams, coerceStrings);

  return {
    ...params,
    resultRecordCount: resultRecordCount || maxRecordCount,
  };
}

function coerceStrings(val) {
  if (val === 'false') {
    return false;
  }

  if (val === 'true') {
    return true;
  }

  return tryParse(val);
}

function tryParse(value) {
  try {
    return JSON.parse(value);
    // eslint-disable-next-line
  } catch (e) {
    return value;
  }
}

module.exports = { normalizeRequestParameters };
