const _ = require('lodash');

function normalizeRequestParameters(body, query) {
  const requestParams = combineBodyQueryParameters(body, query);

  return _.mapValues(requestParams, coerceStrings);
}

function coerceStrings(val) {
  if (val === 'false') {
    return false;
  }

  if (val === 'true') {
    return true;
  }

  return tryJsonParse(val);
}

function tryJsonParse(value) {
  try {
    return JSON.parse(value);
    // eslint-disable-next-line
  } catch (e) {
    return value;
  }
}

function combineBodyQueryParameters(body, query) {
  const definedQueryParams = _.pickBy(query, isNotEmptyString);
  const definedBodyParams = _.pickBy(body, isNotEmptyString);

  return {
    ...definedBodyParams,
    ...definedQueryParams,
  };
}

function isNotEmptyString(str) {
  return !_.isString(str) || !_.isEmpty(str);
}

module.exports = { normalizeRequestParameters };
