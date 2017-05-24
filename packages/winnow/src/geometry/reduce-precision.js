const transformCoordinates = require('./transform-coordinates')
module.exports = function (coordinates, precision) {
  return transformCoordinates(coordinates, precision, (coordinates, precision) => {
    return coordinates.map(position => {
      return parseFloat(position.toFixed(precision))
    })
  })
}
