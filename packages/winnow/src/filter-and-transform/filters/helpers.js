const { arcgisToGeoJSON } = require('@terraformer/arcgis');

const POINT = 'Point';
const MULTIPOINT = 'MultiPoint';
const LINESTRING = 'LineString';
const MULTILINESTRING = 'MultiLineString';
const POLYGON = 'Polygon';
const MULTIPOLYGON = 'MultiPolygon';

function normalizeGeometry(geometry) {
  return isGeoJsonGeometry(geometry) ? geometry : arcgisToGeoJSON(geometry);
}

function isGeoJsonGeometry({ type, coordinates }) {
  return type && coordinates;
}

function isValidGeometry(geometry) {
  return isGeoJsonGeometry(geometry) && geometry.coordinates.length > 0;
}

function createOperationLookup(operationsTree) {
  const entries = Object.entries(operationsTree);
  return entries.reduce((map, [operation, combinations]) => {
    combinations.forEach(([searchType, featureTypes]) => {
      featureTypes.forEach((featureType) => {
        map.set(`${searchType}::${featureType}`, operation);
      });
    });

    return map;
  }, new Map());
}

module.exports = {
  POINT,
  MULTIPOINT,
  LINESTRING,
  MULTILINESTRING,
  POLYGON,
  MULTIPOLYGON,
  normalizeGeometry,
  isValidGeometry,
  createOperationLookup,
};
