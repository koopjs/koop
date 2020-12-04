const normalizeSpatialReference = require('./spatial-reference')
const logWarning = process.env.NODE_ENV !== 'production' && process.env.KOOP_WARNINGS !== 'suppress'

function normalizeOutputDataSpatialReference (options = {}) {
  const {
    srsname,
    srsName,
    projection,
    outputCrs,
    outSR,
    inputCrs,
    sourceSR
  } = options

  // if no output spatial reference set (outputCrs, projection, srsname, srsName, outSR), assume output will be same as input (inputCrs, sourceSR)
  const outputSpatialReference = outputCrs || projection || srsname || srsName || outSR || inputCrs || sourceSR || 4326

  const spatialReference = normalizeSpatialReference(outputSpatialReference)

  if (logWarning) console.log(`WARNING: spatial reference "${outputSpatialReference}" could not be normalized. Defaulting to EPSG:4326.`)

  return spatialReference || { wkid: 4326 }
}

module.exports = normalizeOutputDataSpatialReference
