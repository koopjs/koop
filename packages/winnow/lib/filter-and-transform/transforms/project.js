const projectCoordinates = require('../../helpers/project-coordinates')

function project (geometry, sourceCoordinateSystem, targetCoordinateSystem) {
  if (!geometry || !targetCoordinateSystem) return geometry

  const { type, coordinates: sourceCoordinates } = geometry

  if (!type || !sourceCoordinates) return geometry

  return tryProjectingGeometry({ type, sourceCoordinates, sourceCoordinateSystem, targetCoordinateSystem })
}

function tryProjectingGeometry ({ type, sourceCoordinates, sourceCoordinateSystem, targetCoordinateSystem }) {
  try {
    return {
      type,
      coordinates: projectCoordinates({
        coordinates: sourceCoordinates,
        fromSR: sourceCoordinateSystem,
        toSR: targetCoordinateSystem
      })
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
