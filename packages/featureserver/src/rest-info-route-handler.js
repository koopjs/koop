const _ = require('lodash');
const defaults = require('./metadata-defaults');

function restInfo (data = {}, req) {
  const versionDefaults = defaults.restInfoDefaults();
  const currentVersion = _.get(req, 'app.locals.config.featureServer.currentVersion', versionDefaults.currentVersion);
  const fullVersion = _.get(req, 'app.locals.config.featureServer.fullVersion', versionDefaults.fullVersion);

  return {
    currentVersion,
    fullVersion,
    ...data
  };
}

module.exports = restInfo;
