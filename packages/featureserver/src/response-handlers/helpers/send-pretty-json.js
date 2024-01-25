
function sendPrettyJson(res, payload) {
  res.set('Content-Type', 'application/json; charset=utf-8');
  res.status(200);
  return res.send(JSON.stringify(payload, null, 2));
}

module.exports = {
  sendPrettyJson
};
