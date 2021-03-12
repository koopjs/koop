const {
  layerInfo,
  layersInfo
} = require('./lib/info.js')

module.exports = {
  route: require('./lib/route.js'),
  restInfo: require('./lib/rest-info-route-handler'),
  serverInfo: require('./lib/rest-info-route-handler'),
  layerInfo,
  layersInfo,
  query: require('./lib/query.js'),
  generateRenderer: require('./lib/generateRenderer'),
  error: require('./lib/error'),
  authenticate: require('./lib/authenticate')
}
