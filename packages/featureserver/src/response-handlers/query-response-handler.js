const {
  sendCallbackResponse,
  sendPrettyJson,
  sendPbf
} = require('./helpers');

module.exports = function queryResponseHandler (res, payload, requestParameters) {
  const {f, callback } = requestParameters;

  if (typeof callback === 'string') {
    return sendCallbackResponse(res, payload, callback);
  }
  
  if (f === 'pbf') {
    return sendPbf(res, payload, requestParameters);
  }

  if (f === 'pjson') {
    return sendPrettyJson(res, payload);
  }
  
  return res.status(200).json(payload);
};
