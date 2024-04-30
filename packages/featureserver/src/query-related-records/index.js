const defaults = require('../metadata-defaults');
const { queryResponseHandler } = require('../response-handlers');
const {
  validateQueryRelatedRequestParams,
} = require('./validate-query-related-request-parameters');
const { normalizeRequestParameters } = require('../helpers/normalize-request-params');
const { queryRelatedRecords } = require('./query-related-records');

function queryHandler(req, res, data) {
  const requestParameters = normalizeRequestParameters(req.body, req.query);

  validateQueryRelatedRequestParams(requestParameters);
  const payload = queryRelatedRecords(data, requestParameters);
  return queryResponseHandler(res, payload, {
    ...requestParameters,
    resultRecordCount:
      requestParameters.resultRecordCount ||
      data?.metadata?.maxRecordCount ||
      defaults.maxRecordCount(),
  });
}

module.exports = queryHandler;
