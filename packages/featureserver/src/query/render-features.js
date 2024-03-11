const _ = require('lodash');
const { QueryFields } = require('../helpers/fields');
const { getCollectionCrs, normalizeSpatialReference } = require('../helpers');
const featureResponseTemplate = {
  objectIdFieldName: 'OBJECTID',
  uniqueIdField: {
    name: 'OBJECTID',
    isSystemMaintained: true,
  },
  globalIdFieldName: '',
  hasZ: false,
  hasM: false,
  spatialReference: { wkid: 4326, latestWkid: 4326 },
  fields: [],
  features: [],
  exceededTransferLimit: false,
};

/**
 * Modifies a template features json file with metadata, capabilities, and data from the model
 * @param {object} data - data from provider model
 * @param {object} params
 * @return {object} formatted features data
 */
function renderFeaturesResponse(data, params) {
  const template = _.cloneDeep(featureResponseTemplate);

  const {
    uniqueIdField: uniqueIdFieldDefault,
    objectIdFieldName: objectIdFieldNameDefault,
  } = template;

  const {
    metadata: { exceededTransferLimit = false, transform, idField, hasZ } = {},
  } = data;

  const computedProperties = {
    geometryType: params.geometryType,
    spatialReference: getOutputSpatialReference(data, params),
    fields: QueryFields.create({ ...data, ...params }),
    features: data.features || [],
    exceededTransferLimit,
    objectIdFieldName: idField || objectIdFieldNameDefault,
    uniqueIdField: {
      ...uniqueIdFieldDefault,
      name: idField || uniqueIdFieldDefault.name,
    },
    hasZ: !!hasZ,
  };

  if (transform) {
    computedProperties.transform = transform;
  }

  return { ...template, ...computedProperties };
}

function getOutputSpatialReference(
  collection,
  { outSR, outputCrs, inputCrs, sourceSR },
) {
  const spatialReference =
    outputCrs ||
    outSR ||
    inputCrs ||
    sourceSR ||
    getCollectionCrs(collection) ||
    4326;

  const { wkid, wkt, latestWkid } = normalizeSpatialReference(spatialReference);

  if (wkid && latestWkid) {
    return { wkid, latestWkid };
  }

  if (wkid) {
    return { wkid };
  }

  if (latestWkid) {
    return { latestWkid };
  }

  return { wkt };
}

module.exports = { renderFeaturesResponse };
