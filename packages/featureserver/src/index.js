const info = require('./info.js')

module.exports = {
  route: require('./route.js'),
  serverInfo: info.serverInfo,
  layerInfo: info.layerInfo,
  layersInfo: info.layersInfo,
  query: require('./query.js')
}
