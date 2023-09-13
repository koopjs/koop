const { calculateBounds } = require('@terraformer/spatial');
const logManager = require('../log-manager');
const normalizeExtent = require('./normalize-extent');

function calculateExtent ({ isLayer, geojson, spatialReference }) {
  if (!isLayer) {
    return;
  }

  try {
    const bounds = calculateBounds(geojson);
    return normalizeExtent(bounds, spatialReference);
  } catch (error) {
    logManager.logger.debug(`Could not calculate extent from data: ${error.message}`);
  }
}

module.exports = calculateExtent;
