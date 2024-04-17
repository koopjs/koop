const { setLogger } = require('./log-manager');
const defaults = require('./metadata-defaults');

module.exports = {
  route: require('./route.js'),
  restInfo: require('./rest-info-route-handler'),
  serverInfo: require('./server-info-route-handler'),
  layerInfo: require('./layer-info-handler.js'),
  layersInfo: require('./layers-info-handler'),
  query: require('./query'),
  queryRelatedRecords: require('./queryRelatedRecords.js'),
  generateRenderer: require('./generate-renderer'),
  setLogger,
  setDefaults: defaults.setDefaults.bind(defaults),
};
