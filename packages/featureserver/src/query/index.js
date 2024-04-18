const { combineBodyQueryParameters } = require('../helpers');
const { queryResponseHandler } = require('../response-handlers');
const queryJson = require('./query-json');
const { validateQueryRequestParams } = require('./validate-query-request-parameters');

function queryHandler(req, res, data) {
  const requestParameters = combineBodyQueryParameters(req.body, req.query);

  validateQueryRequestParams(requestParameters);
  const payload = queryJson(data, requestParameters);
  return queryResponseHandler(res, payload, requestParameters);
}

module.exports = queryHandler;
