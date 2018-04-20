const proj4 = require('proj4')
const _ = require('lodash')
const transformCoordinates = require('./transform-coordinates')

module.exports = function projectCoordinates (coordinates, options = {}) {
  const inSR = options.inSR || 'EPSG:4326'
  const outSR = options.outSR || 'EPSG:3857'
  if (inSR === outSR) return coordinates

  return transformCoordinates(coordinates, { inSR, outSR }, (coordinates, options) => {
    if (_.isNumber(coordinates[0]) && _.isNumber(coordinates[1])) {
      return proj4(options.inSR, options.outSR, coordinates)
    } else {
      return coordinates
    }
  })
}
