const {
  restInfo,
  serverInfo,
  layerInfo,
  layersInfo
} = require('./lib/info.js')

module.exports = {
  route: require('./lib/route.js'),
  restInfo,
  serverInfo,
  layerInfo,
  layersInfo,
  query: require('./lib/query.js'),
  generateRenderer: require('./lib/generateRenderer'),
  error: require('./lib/error'),
  authenticate: require('./lib/authenticate')
}
