'use strict'
const info = require('./info.js')

module.exports = {
  route: require('./route.js'),
  serverInfo: info.serverInfo,
  serviceInfo: info.serviceInfo,
  layerInfo: info.layerInfo,
  query: require('./query.js')
}
