const _ = require('lodash');
const joi = require('joi');
const metadataDefaults = require('./metadata-defaults');
const { generalResponseHandler } = require('./response-handlers');
const { combineBodyQueryParameters } = require('./helpers');

const parameterSchema = joi
  .object({
    f: joi.string().valid('json', 'pjson').default('json'),
  })
  .unknown();

function restInfo(req, res, data = {}) {
  const { currentVersion, fullVersion } = getVersions(req.app.locals);

  const requestParams = combineBodyQueryParameters(req.body, req.query);

  validate(requestParams);

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

function validate(parameters) {
  const { error } = parameterSchema.validate(parameters);

  if (error) {
    const err = new Error('Invalid format');
    err.code = 400;
    throw err;
  }
}

module.exports = restInfo;
