const flatten = require('@turf/flatten').default;
const contains = require('@turf/boolean-contains').default;
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

const CONTAINS = 'contains';
const MULTI_CONTAINS = 'multiContains';

const operationsTree = {
  [CONTAINS]: [
    [POINT, [POINT]],
    [MULTIPOINT, [POINT, MULTIPOINT]],
    [LINESTRING, [POINT, MULTIPOINT, LINESTRING]],
    [POLYGON, [POINT, MULTIPOINT, LINESTRING, POLYGON]],
  ],
  [MULTI_CONTAINS]: [
    [POINT, [MULTIPOINT]],
    [MULTILINESTRING, [POINT, MULTIPOINT, LINESTRING, MULTILINESTRING]],
    [POLYGON, [MULTILINESTRING, MULTIPOLYGON]],
    [MULTIPOLYGON, [POINT, MULTIPOINT, LINESTRING, MULTILINESTRING, MULTIPOLYGON]],
  ],
};

const operationLookup = createOperationLookup(operationsTree);

module.exports = function (searchGeometry, geometry) {
  if (!geometry) {
    return false;
  }

  const featureGeometry = normalizeGeometry(geometry);

  if (!isValidGeometry(featureGeometry)) {
    return false;
  }

  const searchOperation = operationLookup.get(`${searchGeometry.type}::${featureGeometry.type}`);

  if (searchOperation === CONTAINS) {
    return contains(searchGeometry, featureGeometry);
  }

  if (searchOperation === MULTI_CONTAINS) {
    return someMultiSearchGeometriesContains(searchGeometry, featureGeometry);
  }

  return false;
};

function someMultiSearchGeometriesContains(searchGeometry, featureGeometry) {
  const searchCollection = flatten(searchGeometry);
  const featureCollection = flatten(featureGeometry);

  return featureCollection.features.every((feature) => {
    return searchCollection.features.some((searchFeature) => {
      return contains(searchFeature, feature);
    });
  });
}
