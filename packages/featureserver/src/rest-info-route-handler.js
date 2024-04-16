const _ = require('lodash');
const metadataDefaults = require('./metadata-defaults');
const { generalResponseHandler } = require('./response-handlers');
const { combineBodyQueryParameters, validateInfoRouteParams } = require('./helpers');

function restInfo(req, res, data = {}) {
  const { currentVersion, fullVersion } = getVersions(req.app.locals);

  const requestParams = combineBodyQueryParameters(req.body, req.query);

  validateInfoRouteParams(requestParams);

  return generalResponseHandler(
    res,
    {
      currentVersion,
      fullVersion,
      owningSystemUrl: data.owningSystemUrl,
      authInfo: {
        ...data.authInfo,
      },
    },
    requestParams,
  );
}

function getVersions(locals) {
  const versionDefaults = metadataDefaults.restInfoDefaults();
  const currentVersion = _.get(
    locals,
    'config.featureServer.currentVersion',
    versionDefaults.currentVersion,
  );

  const fullVersion = _.get(
    locals,
    'config.featureServer.fullVersion',
    versionDefaults.fullVersion,
  );
  return { currentVersion, fullVersion };
}

module.exports = restInfo;
