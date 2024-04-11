const _ = require('lodash');

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

module.exports = { combineBodyQueryParameters };
