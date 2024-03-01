const { setLogger } = require('./log-manager');
const defaults = require('./metadata-defaults');

module.exports = {
  route: require('./route.js'),
  restInfo: require('./rest-info-route-handler'),
  serverInfo: require('./server-info-route-handler'),
  layerInfo: require('./layer-metadata'),
  layersInfo: require('./layers-metadata'),
  query: require('./query'),
  queryRelatedRecords: require('./queryRelatedRecords.js'),
  generateRenderer: require('./generate-renderer'),
  setLogger,
  setDefaults: defaults.setDefaults.bind(defaults)
};
