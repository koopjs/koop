const { sendCallbackResponse, sendPrettyJson } = require('./helpers');

module.exports = function generalResponseHandler(res, payload, requestParameters) {
  const { f, callback } = requestParameters;

  if (typeof callback === 'string') {
    return sendCallbackResponse(res, payload, callback);
  }

  if (f === 'pjson') {
    return sendPrettyJson(res, payload);
  }

  return res.status(200).json(payload);
};
