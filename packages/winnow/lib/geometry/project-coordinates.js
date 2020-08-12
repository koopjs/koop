const proj4 = require('proj4')
const _ = require('lodash')
const transformCoordinates = require('./transform-coordinates')

module.exports = function projectCoordinates (coordinates, options = {}) {
  const fromSR = options.fromSR || 'EPSG:4326'

  // TODO: why is the default target spatial reference 3857?
  const toSR = options.toSR || 'EPSG:3857'
  if (fromSR === toSR) return coordinates

  return transformCoordinates(coordinates, { fromSR, toSR }, (coordinates, options) => {
    if (_.isNumber(coordinates[0]) && _.isNumber(coordinates[1])) {
      return proj4(options.fromSR, options.toSR, coordinates)
    } else {
      return coordinates
    }
  })
}
