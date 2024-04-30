const { normalizeRequestParameters } = require('../helpers');
const { generalResponseHandler } = require('../response-handlers');
const { buildRenderer } = require('./build-renderer');

module.exports = generateRenderer;

function generateRenderer(req, res, data) {
  const requestParams = normalizeRequestParameters(req.body, req.query);

  const payload = buildRenderer(data, requestParams);
  return generalResponseHandler(res, payload, requestParams);
}
