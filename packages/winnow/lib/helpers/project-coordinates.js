const proj4 = require('proj4');
const _ = require('lodash');
const transformCoordinates = require('./transform-coordinates');

module.exports = function projectCoordinates (params) {
  const { coordinates, fromSR = 'EPSG:4326', toSR } = params;

  if (!toSR || fromSR === toSR) return coordinates;

  return transformCoordinates(coordinates, { fromSR, toSR }, (coordinates, options) => {
    if (_.isNumber(coordinates[0]) && _.isNumber(coordinates[1])) {
      return proj4(options.fromSR, options.toSR, coordinates);
    }
    return coordinates;
  });
};
