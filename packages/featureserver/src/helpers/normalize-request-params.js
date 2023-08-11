const _ = require('lodash');
const defaults = require('../metadata-defaults');

function normalizeRequestParameters (
  query,
  body,
  maxRecordCount = defaults.maxRecordCount(),
) {
  const definedQueryParams = _.chain(query)
    .pickBy(isNotEmptyString)
    .mapValues(coerceStrings)
    .value();

  const definedBodyParams = _.chain(body)
    .pickBy(isNotEmptyString)
    .mapValues(coerceStrings)
    .value();

  const { resultRecordCount, ...params } = { ...definedQueryParams, ...definedBodyParams };


  return {
    ...params,
    resultRecordCount: resultRecordCount || maxRecordCount,
  };
}

function isNotEmptyString(str) {
  return !_.isString(str) || !_.isEmpty(str);
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
  } catch (e) {
    return value;
  }
}

module.exports = { normalizeRequestParameters };