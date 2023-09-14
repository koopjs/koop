module.exports = function responseHandler (req, res, statusCode, payload) {
  if (typeof req.query.callback === 'string') {
    let sanitizedCallback = req.query.callback.replace(/[^\w\d\.\(\)\[\]]/g, '') // eslint-disable-line
    res.set('Content-Type', 'application/javascript');
    res.status(statusCode);
    return res.send(`${sanitizedCallback}(${JSON.stringify(payload)})`);
  }
  
  if (req.query?.f === 'pjson') {
    res.set('Content-type', 'application/json; charset=utf-8');
    res.status(statusCode);
    return res.send(JSON.stringify(payload, null, 2));
  }
  
  return res.status(statusCode).json(payload);
};
