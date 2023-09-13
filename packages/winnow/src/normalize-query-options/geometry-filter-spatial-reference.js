const _ = require('lodash');
const logManager = require('../log-manager');
const { normalizeArray } = require('./helpers');
const normalizeSpatialReference = require('./spatial-reference');

/**
 * Normalize the input spatial reference for a geometry filter. Look on options.geometry object first.
 * If spatial reference not present, look in options.inSR.  Defaults to EPSG:4326 (which is known to Proj4)
 * @param {object} options options object that may or may not have "geometry" and "inSR" properties
 * @returns {string} EPSG:<wkid> or srs WKT; defaults to EPSG:4326
 */
function normalizeGeometryFilterSpatialReference (options = {}) {
  const geometry = options.geometry || options.bbox;
  const geometryEnvelopeSpatialReference = extractGeometryFilterSpatialReference(geometry);

  const spatialReference = normalizeSpatialReference(geometryEnvelopeSpatialReference || options.inSR);

  if (!spatialReference) {
    logManager.logger.debug('geometry filter spatial reference unknown. Defaulting to EPSG:4326.');
  }
  return spatialReference || { wkid: 4326 };
}

function extractGeometryFilterSpatialReference (geometry) {
  if (!geometry) return;

  if (_.isString(geometry) || _.isArray(geometry)) {
    const geometryArray = normalizeArray(geometry);
    if (geometryArray.length === 5) return geometryArray[4];
  }

  if (_.isObject(geometry)) return geometry.spatialReference;
}
module.exports = normalizeGeometryFilterSpatialReference;
