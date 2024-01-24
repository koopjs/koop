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
  
  if (f === 'pjson') {
    return sendPrettyJson(res, payload);
  }
  
  if (f === 'pbf') {
    return sendPbf(res, payload, requestParameters);
  }

  // payload here might be Esri JSON or GeoJSON
  return res.status(200).json(payload);
};
