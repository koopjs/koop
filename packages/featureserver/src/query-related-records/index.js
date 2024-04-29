const defaults = require('../metadata-defaults');
const { queryResponseHandler } = require('../response-handlers');
const { queryJson } = require('./query-json');
const { validateQueryRequestParams } = require('./validate-query-related-request-parameters');
const { normalizeRequestParameters } = require('../helpers/normalize-request-params');

function queryHandler(req, res, data) {
  const requestParameters = normalizeRequestParameters(req.body, req.query);

  validateQueryRequestParams(requestParameters);
  const payload = queryJson(data, requestParameters);
  return queryResponseHandler(res, payload, {
    ...requestParameters,
    resultRecordCount:
      requestParameters.resultRecordCount ||
      data?.metadata?.maxRecordCount ||
      defaults.maxRecordCount(),
  });
}

module.exports = queryHandler;
