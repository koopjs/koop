const _ = require('lodash')
const { normalizeArray } = require('./helpers')
const normalizeSpatialReference = require('../helpers/normalize-spatial-reference')
/**
 * Normalize the input spatial reference for a geometry filter. Look on options.geometry object first.
 * If spatial reference not present, look in options.inSR.  Defaults to EPSG:4326 (which is known to Proj4)
 * @param {object} options options object that may or may not have "geometry" and "inSR" properties
 * @returns {string} EPSG:<wkid> or srs WKT; defaults to EPSG:4326
 */
function normalizeGeometryFilterSpatialReference (options = {}) {
  const geometry = options.geometry || options.bbox
  const geometryEnvelopeSpatialReference = extractGeometryFilterSpatialReference(geometry)

  const spatialReference = normalizeSpatialReference(geometryEnvelopeSpatialReference || options.inSR)

  if (!spatialReference) return 'EPSG:4326'
  const { wkid, wkt } = spatialReference
  return wkid ? `EPSG:${wkid}` : wkt
}

function extractGeometryFilterSpatialReference (geometry) {
  if (!geometry) return

  if (_.isString(geometry) || _.isArray(geometry)) {
    const geometryArray = normalizeArray(geometry)
    if (geometryArray.length === 5) return geometryArray[4]
  }

  if (_.isObject(geometry)) return geometry.spatialReference
}
module.exports = normalizeGeometryFilterSpatialReference
