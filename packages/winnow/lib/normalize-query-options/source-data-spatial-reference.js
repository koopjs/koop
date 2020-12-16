const normalizeSpatialReference = require('./spatial-reference')
const logWarning = process.env.NODE_ENV !== 'production' && process.env.KOOP_WARNINGS !== 'suppress'
const { getCollectionCrs } = require('./helpers')

function normalizeSourceDataSpatialReference ({ inputCrs, sourceSR, collection } = {}) {
  const sourceDataSpatialReference = inputCrs || sourceSR || getCollectionCrs(collection)
  if (!sourceDataSpatialReference) return { wkid: 4326 }

  const spatialReference = normalizeSpatialReference(sourceDataSpatialReference)

  if (!spatialReference && logWarning) console.log(`WARNING: spatial reference "${sourceDataSpatialReference}" could not be normalized. Defaulting to EPSG:4326.`)

  return spatialReference || { wkid: 4326 }
}

module.exports = normalizeSourceDataSpatialReference
