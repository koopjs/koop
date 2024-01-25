function sendCallbackResponse(res, payload, callbackString) {
  const sanitizedCallback = callbackString.replace(/[^\w\d\.\(\)\[\]]/g, '') // eslint-disable-line
  res.set('Content-Type', 'application/javascript');
  res.status(200);
  return res.send(`${sanitizedCallback}(${JSON.stringify(payload)})`);
}
module.exports = {
  sendCallbackResponse
};
