const within = require('@turf/boolean-within').default;
const equals = require('@turf/boolean-equal').default;
const flatten = require('@turf/flatten').default;
const {
  createOperationLookup,
  POINT,
  MULTIPOINT,
  LINESTRING,
  POLYGON,
  MULTILINESTRING,
  MULTIPOLYGON,
  normalizeGeometry,
  isValidGeometry,
} = require('./helpers');

const EQUALS = 'equals';
const WITHIN = 'within';
const EACH_WITHIN = 'eachWithin';

const operationTree = {
  [EQUALS]: [[POINT, [POINT]]],
  [WITHIN]: [
    [POINT, [MULTIPOINT, LINESTRING, POLYGON, MULTIPOLYGON]],
    [MULTIPOINT, [MULTIPOINT, LINESTRING, POLYGON, MULTIPOLYGON]],
    [LINESTRING, [LINESTRING, POLYGON, MULTIPOLYGON]],
    [POLYGON, [POLYGON, MULTIPOLYGON]],
  ],
  [EACH_WITHIN]: [
    [POINT, [MULTILINESTRING]],
    [MULTIPOINT, [MULTILINESTRING]],
    [LINESTRING, [MULTILINESTRING]],
    [MULTILINESTRING, [MULTILINESTRING, POLYGON, MULTIPOLYGON]],
  ],
};

const operationLookup = createOperationLookup(operationTree);

module.exports = function (searchGeometry, geometry) {
  if (!geometry) {
    return false;
  }

  const featureGeometry = normalizeGeometry(geometry);

  if (!isValidGeometry(featureGeometry)) {
    return false;
  }

  const operation = operationLookup.get(`${searchGeometry.type}::${featureGeometry.type}`);

  if (operation === EQUALS) {
    return equals(searchGeometry, featureGeometry);
  }

  if (operation === WITHIN) {
    return within(searchGeometry, featureGeometry);
  }

  if (operation === EACH_WITHIN) {
    return allMultiSearchGeometriesWithin(searchGeometry, featureGeometry);
  }

  return false;
};

function allMultiSearchGeometriesWithin(searchGeometry, featureGeometry) {
  const searchCollection = flatten(searchGeometry);
  const featureCollection = flatten(featureGeometry);

  return searchCollection.features.every((searchFeature) => {
    return featureCollection.features.some((feature) => {
      return within(searchFeature, feature);
    });
  });
}
