module.exports = function transformCoordinates (coordinates, options = {}, transformFunction) {
  if (Array.isArray(coordinates[0])) {
    return coordinates.map(el => {
      return transformCoordinates(el, options, transformFunction);
    });
  }

  return transformFunction(coordinates, options);
};
