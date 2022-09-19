module.exports = {
  route: require('./lib/route.js'),
  restInfo: require('./lib/rest-info-route-handler'),
  serverInfo: require('./lib/server-info-route-handler'),
  layerInfo: require('./lib/layer-metadata'),
  layersInfo: require('./lib/layers-metadata'),
  query: require('./lib/query'),
  queryRelatedRecords: require('./lib/queryRelatedRecords.js'),
  generateRenderer: require('./lib/generate-renderer'),
  error: require('./lib/error'),
  authenticate: require('./lib/authenticate')
};
