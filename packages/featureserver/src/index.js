const info = require('./info.js')

module.exports = {
  route: require('./route.js'),
  restInfo: info.restInfo,
  serverInfo: info.serverInfo,
  layerInfo: info.layerInfo,
  layersInfo: info.layersInfo,
  query: require('./query.js'),
  generateRenderer: require('./generateRenderer'),
  error: require('./error'),
  authenticate: require('./authenticate')
}
