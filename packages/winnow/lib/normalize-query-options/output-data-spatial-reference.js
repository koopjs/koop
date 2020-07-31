const normalizeSpatialReference = require('./spatial-reference')
const logWarning = process.env.NODE_ENV !== 'production' && process.env.KOOP_WARNINGS !== 'suppress'

function normalizeOutputDataSpatialReference (options = {}) {
  const {
    srsname,
    srsName,
    projection,
    outSR
  } = options

  const outputSpatialReference = projection || srsname || srsName || outSR

  if (!outputSpatialReference) return
  const spatialReference = normalizeSpatialReference(outputSpatialReference)

  if (!spatialReference) {
    if (logWarning) console.log(`WARNING: spatial reference "${outputSpatialReference}" could not be normalized. Defaulting to EPSG:4326.`)
    return
  }

  const { wkid, wkt } = spatialReference
  return wkid ? `EPSG:${wkid}` : wkt
}

module.exports = normalizeOutputDataSpatialReference
