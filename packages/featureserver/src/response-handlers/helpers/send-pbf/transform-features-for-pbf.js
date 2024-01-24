const _ = require('lodash');
const { getGeometryTransform } = require('./get-geometry-transform');
const { transformToPbfAttributes } = require('./transform-to-pbf-attributes');
const { transformToPbfGeometry } = require('./transform-to-pbf-geometry');



function transformFeaturesForPbf(json, quantizationParameters) {
  const fields = _.orderBy(json.fields, ['name'], ['asc']);
  const { objectIdFieldName, uniqueIdField, geometryType, spatialReference } = json;

  const geometryTransform = getGeometryTransform(spatialReference, quantizationParameters);
  
  const features = json.features.map(
    transformFunction(fields, geometryTransform),
  );

  return {
    objectIdFieldName,
    uniqueIdField,
    geometryType,
    spatialReference,
    fields,
    features,
    transform: geometryTransform
  };
}

function transformFunction(fields, geometryTransform) {
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
