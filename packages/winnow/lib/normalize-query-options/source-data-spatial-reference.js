const normalizeSpatialReference = require('./spatial-reference')
const logWarning = process.env.NODE_ENV !== 'production' && process.env.KOOP_WARNINGS !== 'suppress'

function normalizeSourceDataSpatialReference (dataSpatialReference) {
  if (!dataSpatialReference) return 'EPSG:4326'

  const spatialReference = normalizeSpatialReference(dataSpatialReference)

  if (!spatialReference) {
    if (logWarning) console.log(`WARNING: spatial reference "${dataSpatialReference}" could not be normalized. Defaulting to EPSG:4326.`)
    return 'EPSG:4326'
  }

  const { wkid, wkt } = spatialReference
  return wkid ? `EPSG:${wkid}` : wkt
}

module.exports = normalizeSourceDataSpatialReference
