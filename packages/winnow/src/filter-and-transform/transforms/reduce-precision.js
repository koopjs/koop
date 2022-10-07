const transformCoordinates = require('../../helpers/transform-coordinates');

module.exports = function (geometry, precision) {
  if (!geometry) return;

  const { type, coordinates } = geometry;

  if (!coordinates) return geometry;

  return {
    type,
    coordinates: reducePrecision(coordinates, precision)
  };
};

function reducePrecision (coordinates, precision) {
  return transformCoordinates(coordinates, { precision }, (coordinates, { precision }) => {
    return coordinates.map(position => {
      return parseFloat(position.toFixed(precision));
    });
  });
}
