const logManager = require('../../log-manager');
const projectCoordinates = require('../../helpers/project-coordinates');

function project (geometry, sourceCoordinateSystem, targetCoordinateSystem) {
  if (!geometry || !targetCoordinateSystem) return geometry;

  const { type, coordinates: sourceCoordinates } = geometry;

  if (!type || !sourceCoordinates) return geometry;

  return tryProjectingGeometry({ type, sourceCoordinates, sourceCoordinateSystem, targetCoordinateSystem });
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
    };
  } catch (error) {
    logManager.logger.debug(error);
    // TODO: should we throw error instead of returning null?
    return null;
  }
}

module.exports = project;
