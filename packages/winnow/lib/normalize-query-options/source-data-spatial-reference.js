const _ = require('lodash')
const normalizeSpatialReference = require('../helpers/normalize-spatial-reference')
const logWarning = process.env.NODE_ENV !== 'production' && process.env.KOOP_WARNINGS !== 'suppress'
const OGC_WGS84 = 'ogc:1.3:crs84'

function normalizeSourceDataSpatialReference ({ inputCrs, sourceSR, collection } = {}) {
  const sourceDataSpatialReference = inputCrs || sourceSR || getCollectionCrs(collection)
  if (!sourceDataSpatialReference) return 'EPSG:4326'

  const spatialReference = normalizeSpatialReference(sourceDataSpatialReference)

  if (!spatialReference) {
    if (logWarning) console.log(`WARNING: spatial reference "${sourceDataSpatialReference}" could not be normalized. Defaulting to EPSG:4326.`)
    return 'EPSG:4326'
  }

  const { wkid, wkt } = spatialReference
  return wkid ? `EPSG:${wkid}` : wkt
}

function getCollectionCrs (collection) {
  const collectionCrs = _.get(collection, 'crs.properties.name')
  if (!collectionCrs) return

  const crs = collectionCrs.toLowerCase().replace(/urn:ogc:def:crs:/, '')
  if (crs === OGC_WGS84) return

  const crsRegex = /(?<authority>[a-z]+)(::|:)(?<srid>.+)/
  const result = crsRegex.exec(crs)
  if (!result) return
  const { groups: { srid } } = result
  return srid
}
module.exports = normalizeSourceDataSpatialReference
