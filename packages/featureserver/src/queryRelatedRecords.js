const _ = require('lodash');
const { getCollectionCrs, getGeometryTypeFromGeojson } = require('./helpers');
const {
  QueryFields
} = require('./helpers/fields');

module.exports = queryRelatedRecords;

function queryRelatedRecords (data, params = {}) {
  const response = {
    relatedRecordGroups: []
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
    response.relatedRecordGroups = data.features.map(featureCollection => {
      return convertFeaturesToRelatedRecordGroups(featureCollection, params.returnCountOnly);
    });
  }

  return response;
}

function convertFeaturesToRelatedRecordGroups ({ features, properties }, returnCountOnly = false) {
  const recordGroup = {
    objectId: properties.objectid
  };

  if (returnCountOnly) {
    // allow for preprocessing of count within provider
    if (properties.count || properties.count === 0) {
      recordGroup.count = properties.count;
    } else {
      recordGroup.count = _.get(features, 'length', 0);
    }

    return recordGroup;
  }

  if (features) {
    recordGroup.relatedRecords = features.map(({ geometry, properties }) => {
      return {
        attributes: properties,
        geometry: geometry
      };
    });
  }

  return recordGroup;
}
