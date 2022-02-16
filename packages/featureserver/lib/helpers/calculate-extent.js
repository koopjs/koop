const { calculateBounds } = require('@terraformer/spatial')
const normalizeExtent = require('./normalize-extent')
const debug = process.env.KOOP_LOG_LEVEL === 'debug' || process.env.LOG_LEVEL === 'debug'

function calculateExtent ({ isLayer, geojson, spatialReference }) {
  if (!isLayer) {
    return
  }

  try {
    const bounds = calculateBounds(geojson)
    return normalizeExtent(bounds, spatialReference)
  } catch (error) {
    if (debug) {
      console.log(`Could not calculate extent from data: ${error.message}`)
    }
  }
}

module.exports = calculateExtent
