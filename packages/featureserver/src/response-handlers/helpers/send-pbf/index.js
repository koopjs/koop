const {
  esriPBuffer: { FeatureCollectionPBuffer: FeatureCollectionProto },
} = require('./FeatureCollection.proto.js');
const logManager = require('../../../log-manager.js');
const { transformFeaturesForPbf } = require('./transform-features-for-pbf.js');

const FILENAME = 'results.pbf';

function sendPbf(res, jsonResponse, requestParameters) {
  const { returnExtentOnly } = requestParameters;

  if (returnExtentOnly === true) {
    const error = new Error('Bad Request');
    error.code = 400;
    throw error;
  }

  const buffer = getPbfBuffer(jsonResponse, requestParameters);

  res.set('content-type', 'application/x-protobuf');
  res.set('content-length', buffer.length);
  res.set('content-disposition', `inline;filename=${FILENAME}`);
  res.status(200);

  return res.end(buffer);
}

function getPbfBuffer(resultJson, requestParameters) {
  const pbfJson = convertToPbfJson(resultJson, requestParameters);
  const pbfMessage = FeatureCollectionProto.fromObject(pbfJson);
  verifyPbfMessage(pbfMessage);
  return FeatureCollectionProto.encode(pbfMessage).finish();
}

function verifyPbfMessage(pbfMessage) {
  const messageSpecViolations = FeatureCollectionProto.verify(pbfMessage);
  if (messageSpecViolations) {
    logManager.logger.debug(
      `FeatureCollection PBF specification violation: ${messageSpecViolations}`,
    );
  }
}

function convertToPbfJson(payload, requestParameters) {
  const { returnCountOnly, returnIdsOnly, quantizationParameters } =
    requestParameters;

  if (returnCountOnly === true) {
    return {
      queryResult: {
        Results: 'countResult',
        countResult: payload,
      },
    };
  }

  if (returnIdsOnly === true) {
    return {
      queryResult: {
        Results: 'idsResult',
        idsResult: payload,
      },
    };
  }

  return {
    queryResult: {
      Results: 'featureResult',
      featureResult: transformFeaturesForPbf(payload, quantizationParameters),
    },
  };
}

module.exports = {
  sendPbf,
};
