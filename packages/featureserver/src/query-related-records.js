const _ = require('lodash');
const { getCollectionCrs, getGeometryTypeFromGeojson } = require('./helpers');
const { QueryFields } = require('./helpers/fields');

module.exports = queryRelatedRecords;

function queryRelatedRecords(data, params = {}) {
  const response = {
    relatedRecordGroups: [],
  };

  if (!params.returnCountOnly) response.fields = QueryFields.create({ ...data, ...params });

  const geomType = getGeometryTypeFromGeojson(data);
  if (geomType) {
    response.geomType = geomType;
    response.spatialReference = getCollectionCrs(data);
    response.hasZ = false;
    response.hasM = false;
  }

  if (data.features) {
    response.relatedRecordGroups = data.features.map((featureCollection) => {
      return convertFeaturesToRelatedRecordGroups(featureCollection, params.returnCountOnly);
    });
  }

  return response;
}

function convertFeaturesToRelatedRecordGroups(collection, returnCountOnly = false) {
  const recordGroup = {
    objectId: collection.properties?.objectid,
  };

  if (returnCountOnly) {
    recordGroup.count = getCount(collection, returnCountOnly);
    return recordGroup;
  }

  const { features } = collection;

  if (features) {
    recordGroup.relatedRecords = features.map(({ geometry, properties }) => {
      return {
        attributes: properties,
        geometry: geometry,
      };
    });
  }

  return recordGroup;
}

function getCount(collection) {
  const {
    count,
    properties: { count: propertiesCount },
    features,
  } = collection;

  if (count !== undefined || propertiesCount !== undefined) {
    return count || propertiesCount;
  }

  return _.get(features, 'length', 0);
}
