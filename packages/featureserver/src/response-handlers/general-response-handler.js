const { sendCallbackResponse, sendPrettyJson } = require('./helpers');

module.exports = function generalResponseHandler(res, payload, requestParameters) {
  const { f, callback } = requestParameters;

  if (typeof callback === 'string') {
    return sendCallbackResponse(res, payload, callback);
  }

  if (f === 'pjson') {
    return sendPrettyJson(res, payload);
  }

  // payload here might be Esri JSON or GeoJSON
  return res.status(200).json(payload);
};
