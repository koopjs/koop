const esriProjCodes = require('@esri/proj-codes')
const Joi = require('@hapi/joi')
const wktParser = require('wkt-parser')
const PROJ4_WKIDS = [4326, 4269, 3857, 3785, 900913, 102113]
const wktLookup = new Map()
const schema = Joi.alternatives(
  Joi.string(),
  Joi.number().integer(),
  Joi.object({
    wkid: Joi.number().integer().optional(),
    latestWkid: Joi.number().integer().optional(),
    wkt: Joi.string().optional()
  }).or('wkid', 'latestWkid', 'wkt').required()
)

function normalizeSpatialReference (input) {
  if (!input) return

  const { error } = schema.validate(input)

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`WARNING: ${input} is not a valid spatial reference; defaulting to none`)
    }
    // Todo: throw error
    return
  }

  const { type, value } = parseSpatialReferenceInput(input)

  if (type === 'wkid') {
    return convertWkidToSpatialReference(value)
  }

  return convertStringToSpatialReference(value)
}

function parseSpatialReferenceInput (spatialReference) {
  // Search input for a wkid
  if (isNumericSpatialReferenceId(spatialReference)) {
    return {
      type: 'wkid',
      value: Number(spatialReference)
    }
  }

  if (isPrefixedSpatialReferenceId(spatialReference)) {
    return {
      type: 'wkid',
      value: extractPrefixedSpatialReferenceId(spatialReference)
    }
  }

  if (spatialReference.wkid || spatialReference.latestWkid) {
    return {
      type: 'wkid',
      value: spatialReference.wkid || spatialReference.latestWkid
    }
  }

  return {
    type: 'wkt',
    value: spatialReference.wkt || spatialReference
  }
}

function isNumericSpatialReferenceId (spatialReference) {
  return Number.isInteger(spatialReference) || Number.isInteger(Number(spatialReference))
}

function isPrefixedSpatialReferenceId (spatialReference) {
  return /[A-Z]+:/.test(spatialReference)
}

function extractPrefixedSpatialReferenceId (prefixedId) {
  const spatialRefId = prefixedId.match(/[A-Z]*:(.*)/)[1]
  return Number(spatialRefId)
}

function convertWkidToSpatialReference (wkid) {
  // 102100 is the old Esri code for 3857 but not recognized for proj4
  if (wkid === 102100) return { wkid: 3857 }

  // If the input wkid is one of the set known to proj4, return it in an object
  if (PROJ4_WKIDS.includes(wkid)) return { wkid }

  // WKID is not known to proj4, so we need its WKT spatial reference in order to do downstream reprojections.  First check in local lookup
  return wktLookup.get(wkid) || esriWktLookup(wkid)
}

function esriWktLookup (wkid) {
  const result = esriProjCodes.lookup(wkid)

  if (!result) {
    // Todo - throw error
    if (process.env.NODE_ENV !== 'production') {
      console.log(`WARNING: An unknown spatial reference was detected: ${wkid}; defaulting to none`)
    }
    return
  }

  const { wkt } = result

  // Add the WKT to the local lookup so we don't need to scan the Esri lookups next time
  wktLookup.set(wkid, { wkid, wkt })
  return { wkid, wkt }
}

function convertStringToSpatialReference (wkt) {
  if (/WGS_1984_Web_Mercator_Auxiliary_Sphere/.test(wkt)) return { wkid: 3857 }

  try {
    const wkid = getWktWkid(wkt)
    return {
      wkt,
      wkid: wkid ? Number(wkid) : undefined
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`WARNING: An un-parseable WKT spatial reference was detected: ${wkt}`)
    }
    // Todo: throw error
  }
}

function getWktWkid (wkt) {
  const { AUTHORITY: authority } = wktParser(wkt)
  if (!authority) return
  const [, wkid] = Object.entries(authority)[0]
  return wkid
}
module.exports = normalizeSpatialReference
