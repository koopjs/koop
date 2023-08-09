const { setLogger } = require('./logger');
const serverConfigurationOptions = require('./server-config-options');

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
  setServerConfigurationOptions: serverConfigurationOptions.set
};
