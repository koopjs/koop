const normalizeSpatialReference = require('./spatial-reference');
const { getCollectionCrs } = require('./helpers');
const logManager = require('../log-manager');

function normalizeOutputDataSpatialReference (options = {}) {
  const {
    srsname,
    srsName,
    projection,
    outputCrs,
    outSR,
    inputCrs,
    sourceSR,
    collection
  } = options;

  // if no output spatial reference set (outputCrs, projection, srsname, srsName, outSR), assume output will be same as input (inputCrs, sourceSR)
  const outputSpatialReference = outputCrs || projection || srsname || srsName || outSR || inputCrs || sourceSR || getCollectionCrs(collection) || 4326;

  const spatialReference = normalizeSpatialReference(outputSpatialReference);

  if (!spatialReference) {
    logManager.logger.debug(`spatial reference "${outputSpatialReference}" could not be normalized. Defaulting to EPSG:4326.`);
    // @TODO: throw error
  }

  return spatialReference || { wkid: 4326 };
}

module.exports = normalizeOutputDataSpatialReference;
