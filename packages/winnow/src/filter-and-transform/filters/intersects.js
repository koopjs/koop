const { normalizeGeometry, isValidGeometry } = require('./helpers');

const intersects = require('@turf/boolean-intersects').default;

module.exports = function (searchGeometry, geometry) {
  if (!geometry) {
    return false;
  }

  const featureGeometry = normalizeGeometry(geometry);

  if (!isValidGeometry(featureGeometry)) {
    return false;
  }

  return intersects(searchGeometry, featureGeometry);
};
