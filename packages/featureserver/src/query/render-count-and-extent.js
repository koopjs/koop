const _ = require('lodash');
const esriExtent = require('esri-extent');

function renderCountAndExtentResponse (data, params) {
  const {
    returnCountOnly,
    returnExtentOnly,
    outSR
  } = params;

  if (returnCountOnly && returnExtentOnly) {
    return {
      count: _.get(data, 'features.length', 0),
      extent: getExtent(data, outSR)
    };
  }

  if (returnCountOnly) {
    return {
      count: _.get(data, 'features.length', 0)
    };
  }

  return {
    extent: getExtent(data, outSR)
  };
}

/**
 * Get an extent object for passed GeoJSON
 * @param {object} geojson
 * @param {*} outSR Esri spatial reference object, or WKID integer
 */
function getExtent (geojson, outSR) {
  // Calculate extent from features
  const extent = esriExtent(geojson);

  if (!outSR) {
    return extent;
  }

  // esri-extent assumes WGS84, but data passed in may have CRS.
  // Math should be the same different CRS but we need to alter the spatial reference

  if (_.isObject(outSR)) {
    extent.spatialReference = outSR;
  }

  if (Number.isInteger(Number(outSR))) {
    extent.spatialReference = { wkid: Number(outSR) };
  } else if (_.isString(outSR)) {
    extent.spatialReference = { wkt: outSR };
  }

  return extent;
}

module.exports = { renderCountAndExtentResponse };
