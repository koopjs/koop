const esriProjCodes = require('@esri/proj-codes');
const Joi = require('joi');
const wktParser = require('wkt-parser');
const logManager = require('../log-manager');
const wktLookup = new Map();
const schema = Joi.alternatives(
  Joi.string(),
  Joi.number().integer(),
  Joi.object({
    wkid: Joi.number().integer().optional(),
    latestWkid: Joi.number().integer().optional(),
    wkt: Joi.string().optional()
  }).unknown().or('wkid', 'latestWkid', 'wkt').required()
);

function normalizeSpatialReference (input) {
  if (!input) return { wkid: 4326, latestWkid: 4326 };

  const { error } = schema.validate(input);

  if (error) {
    logManager.logger.verbose(` ${input} is not a valid spatial reference; defaulting to none, error: ${error}`);

    // Todo: throw error
    return { wkid: 4326, latestWkid: 4326 };
  }

  const { type, value } = parseSpatialReferenceInput(input);

  if (type === 'wkid') {
    return wktLookup.get(value) || esriWktLookup(value) || { wkid: 4326, latestWkid: 4326 };
  }

  return convertStringToSpatialReference(value) || { wkid: 4326, latestWkid: 4326 };
}

function parseSpatialReferenceInput (spatialReference) {
  // Search input for a wkid
  if (isNumericSpatialReferenceId(spatialReference)) {
    return {
      type: 'wkid',
      value: Number(spatialReference)
    };
  }

  if (isPrefixedSpatialReferenceId(spatialReference)) {
    return {
      type: 'wkid',
      value: extractPrefixedSpatialReferenceId(spatialReference)
    };
  }

  if (spatialReference.wkid || spatialReference.latestWkid) {
    return {
      type: 'wkid',
      value: spatialReference.wkid || spatialReference.latestWkid
    };
  }

  return {
    type: 'wkt',
    value: spatialReference.wkt || spatialReference
  };
}

function isNumericSpatialReferenceId (spatialReference) {
  return Number.isInteger(spatialReference) || Number.isInteger(Number(spatialReference));
}

function isPrefixedSpatialReferenceId (spatialReference) {
  return /[A-Z]+:/.test(spatialReference);
}

function extractPrefixedSpatialReferenceId (prefixedId) {
  const spatialRefId = prefixedId.match(/[A-Z]*:(.*)/)[1];
  return Number(spatialRefId);
}

function esriWktLookup (lookupValue) {
  const result = esriProjCodes.lookup(lookupValue);

  if (!result) {
    // Todo - throw error
    logManager.logger.verbose(`An unknown spatial reference was detected: ${lookupValue}; defaulting to none`);
    return;
  }

  const { wkid, latestWkid } = result;

  // Add the WKT to the local lookup so we don't need to scan the Esri lookups next time
  // TODO: move to LRU cache
  wktLookup.set(wkid, { wkid, latestWkid });
  return { latestWkid, wkid };
}

function convertStringToSpatialReference (wkt) {
  if (/WGS_1984_Web_Mercator_Auxiliary_Sphere/.test(wkt)) return { wkid: 102100, latestWkid: 3857 };

  try {
    const wkid = getWktWkid(wkt);
    return wktLookup.get(wkid) || esriWktLookup(wkid) || { wkt };
  } catch (err) {
    logManager.logger.debug(`An un-parseable WKT spatial reference was detected: ${wkt}`);
    // Todo: throw error
  }
}

function getWktWkid (wkt) {
  const { AUTHORITY: authority } = wktParser(wkt);
  if (!authority) return;
  const [, wkid] = Object.entries(authority)[0];
  return wkid;
}
module.exports = normalizeSpatialReference;
