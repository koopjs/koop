const _ = require('lodash');
const { within } = require('@terraformer/spatial');

module.exports = function (featureGeometry, filterGeometry = {}) {
  if (_.isEmpty(featureGeometry)) return false;
  const { type, coordinates = [] } = featureGeometry;
  if (!type || !coordinates || coordinates.length === 0) return false;
  return within(featureGeometry, filterGeometry);
};
