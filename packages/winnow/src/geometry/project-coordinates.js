const proj4 = require('proj4')

module.exports = function projectCoordinates (coordinates, options = {}) {
  const inSR = options.inSR || 'EPSG:4326'
  const outSR = options.outSR || 'EPSG:3857'
  if (inSR === outSR) return coordinates
  if (Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0])) {
    return coordinates.map(a => {
      return projectCoordinates(a, options)
    })
  } else if (Array.isArray(coordinates[0]) && typeof coordinates[0][0] === 'number') {
    return coordinates.map(a => {
      return projectCoordinates(a, options)
    })
  } else {
    return proj4(inSR, outSR, coordinates)
  }
}
