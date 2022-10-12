const isDifferentCrs = require('./is-different-crs');

function params (features, {
  returnGeometry,
  inputCrs,
  outputCrs,
  aggregates,
  geometry,
  geometryPrecision
} = {}) {
  const params = [];
  // NOTE: order matters here
  // select fragment: transform function parameters here
  if (shouldAddCrsParams({ aggregates, returnGeometry, inputCrs, outputCrs })) {
    params.push(getCrsString(inputCrs), getCrsString(outputCrs));
  }

  if (geometryPrecision) {
    params.push(geometryPrecision);
  }

  // from fragment: features parameter here
  params.push(Array.isArray(features) ? features : [features]);

  // where fragment: geometry filter parameter here
  if (geometry) {
    params.push(geometry);
  }
  return params;
}

function shouldAddCrsParams ({
  aggregates,
  returnGeometry,
  inputCrs,
  outputCrs
} = {}) {
  return !aggregates && returnGeometry !== false && isDifferentCrs(inputCrs, outputCrs);
}

function getCrsString ({ wkt, wkid } = {}) {
  return wkt || `EPSG:${wkid}`;
}

module.exports = params;
