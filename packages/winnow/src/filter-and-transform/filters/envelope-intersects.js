const intersects = require('@turf/boolean-intersects').default;
const envelope = require('@turf/envelope').default;
const { normalizeGeometry, isValidGeometry } = require('./helpers');

module.exports = function (searchGeometry, geometry) {
  if (!geometry) {
    return false;
  }

  const featureGeometry = normalizeGeometry(geometry);

  if (!isValidGeometry(featureGeometry)) {
    return false;
  }

  const geometryFilterEnvelope = envelope(searchGeometry);

  return intersects(geometryFilterEnvelope, featureGeometry);
};
