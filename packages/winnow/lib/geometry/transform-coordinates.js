module.exports = function transformCoordinates (coordinates, options, fx) {
  if (Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0])) {
    return coordinates.map(a => {
      return transformCoordinates(a, options, fx)
    })
  } else if (Array.isArray(coordinates[0]) && typeof coordinates[0][0] === 'number') {
    return coordinates.map(a => {
      return transformCoordinates(a, options, fx)
    })
  } else {
    return fx(coordinates, options)
  }
}
