const { generalResponseHandler } = require('./response-handlers');
const { combineBodyQueryParameters, validateInfoRouteParams } = require('./helpers');

// A Koop service is available whenever its route is reachable, so report the started state
const STATUS = {
  configuredState: 'STARTED',
  realTimeState: 'STARTED',
};

module.exports = function status(req, res) {
  const requestParameters = combineBodyQueryParameters(req.body, req.query);

  validateInfoRouteParams(requestParameters);

  return generalResponseHandler(res, { ...STATUS }, requestParameters);
};
