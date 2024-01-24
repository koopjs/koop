const { esriPBuffer: {
  FeatureCollectionPBuffer: FeatureCollectionProto
}} = require('./FeatureCollection.proto.js');
const { transformFeaturesForPbf } = require('./transform-features-for-pbf.js');

const FILENAME = 'results.pbf';

function sendPbf(res, payload, requestParameters) {
  const { returnExtentOnly } = requestParameters;

  if (returnExtentOnly === true) {
    const error = new Error('Bad Request');
    error.code = 400;
    throw error;
  }


  const pbfPayload = setPbfPayload(payload, requestParameters);
  const buffer = FeatureCollectionProto.encode(pbfPayload).finish();
  res.writeHead(200, [
    ['content-type', 'application/x-protobuf'],
    ['content-length', buffer.length],
    ['content-disposition', `inline;filename=${FILENAME}`],
  ]);

  return res.end(buffer);
}

function setPbfPayload(payload, requestParameters) {
  const { returnCountOnly, returnIdsOnly, quantizationParameters } = requestParameters;

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
