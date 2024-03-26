const _ = require('lodash');
const { getGeometryTransform } = require('./get-geometry-transform');
const { transformToPbfAttributes } = require('./transform-to-pbf-attributes');
const { transformToPbfGeometry } = require('./transform-to-pbf-geometry');

function transformFeaturesForPbf(json, quantizationParameters) {
  const { objectIdFieldName, uniqueIdField, geometryType, spatialReference, exceededTransferLimit } = json;
  const fields = _.orderBy(json.fields, ['name'], ['asc']);
  
  const geometryTransform = getGeometryTransform(spatialReference, quantizationParameters);
  
  const features = json.features.map(
    transformFeatureFunction(fields, geometryTransform),
  );

  return {
    objectIdFieldName,
    uniqueIdField,
    spatialReference,
    fields: fields.map(({name, alias, type}) => ({ name, alias, fieldType: type})),
    features,
    exceededTransferLimit,
    transform: geometryTransform,
    geometryType: geometryType ?  geometryType.replace('esriGeometry', 'esriGeometryType') : 'esriGeometryTypeNone'
  };
}

function transformFeatureFunction(fields, geometryTransform) {
  const fieldMap = fields.reduce((acc, cur) => {
    acc[cur.name] = cur.type;
    return acc;
  }, {});

  return (feature) => {
    const attributes = transformToPbfAttributes(feature.attributes, fieldMap);

    const geometry = transformToPbfGeometry(
      feature.geometry,
      geometryTransform
    );

    return {
      attributes,
      geometry
    };
  };
}

module.exports = {
  transformFeaturesForPbf,
};
