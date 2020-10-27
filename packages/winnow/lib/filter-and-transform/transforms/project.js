const projectCoordinates = require('../../geometry/project-coordinates')

function project (geometry, targetCoordinateSystem) {
  if (!geometry || !targetCoordinateSystem) return geometry

  const { type, coordinates: sourceCoordinates } = geometry

  if (!type || !sourceCoordinates) return geometry

  return tryProjectingGeometry({ type, sourceCoordinates, targetCoordinateSystem })
}

function tryProjectingGeometry ({ type, sourceCoordinates, targetCoordinateSystem }) {
  try {
    return {
      type,
      coordinates: projectCoordinates(sourceCoordinates, { toSR: targetCoordinateSystem })
    }
  } catch (error) {
    if (shouldLogProjectError()) console.error(error)
    // TODO: should we throw error instead of returning null?
    return null
  }
}

function shouldLogProjectError () {
  if (process.env.KOOP_LOG_LEVEL === 'debug') return true
  return process.env.NODE_ENV !== 'production' && process.env.KOOP_WARNINGS !== 'suppress'
}

module.exports = project
