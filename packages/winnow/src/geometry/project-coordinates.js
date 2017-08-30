const proj4 = require('proj4')
const transformCoordinates = require('./transform-coordinates')

module.exports = function projectCoordinates (coordinates, options = {}) {
  const inSR = options.inSR || 'EPSG:4326'
  const outSR = options.outSR || 'EPSG:3857'
  if (inSR === outSR) return coordinates

  return transformCoordinates(coordinates, { inSR, outSR }, (coordinates, options) => {
    if (coordinates[0]) {
      return proj4(options.inSR, options.outSR, coordinates)
    } else {
      return coordinates
    }
  })
}
