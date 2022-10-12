const _ = require('lodash');
const { normalizeArray } = require('./helpers');
const { arcgisToGeoJSON } = require('@terraformer/arcgis');
const bboxPolygon = require('@turf/bbox-polygon').default;
const projectCoordinates = require('../helpers/project-coordinates');
const normalizeGeometryFilterSpatialReference = require('./geometry-filter-spatial-reference');
const normalizeSourceSR = require('./source-data-spatial-reference');

function normalizeGeometryFilter (options = {}) {
  const geometry = options.geometry || options.bbox;

  if (!geometry) return;

  const geometryFilterSpatialReference = normalizeGeometryFilterSpatialReference(options);
  const fromSR = getCrsString(geometryFilterSpatialReference);

  const geometryFilter = transformGeometryToGeojson(geometry);

  const dataCrs = normalizeSourceSR(options);

  const toSR = getCrsString(dataCrs);

  if (fromSR === toSR) {
    return geometryFilter;
  }

  geometryFilter.coordinates = projectCoordinates({
    coordinates: geometryFilter.coordinates,
    fromSR,
    toSR
  });

  return geometryFilter;
}

function transformGeometryToGeojson (geometry) {
  if (_.isString(geometry) || Array.isArray(geometry)) {
    const coordinates = normalizeArray(geometry);

    if (coordinates.length === 2) {
      return {
        type: 'Point',
        coordinates: coordinates.map(Number)
      };
    }

    const { geometry: polygon } = bboxPolygon(coordinates);
    return polygon;
  }

  if (geometry.xmin || geometry.xmin === 0) {
    return transformEsriEnvelopeToPolygon(geometry);
  }

  if (geometry.x || geometry.rings || geometry.paths || geometry.points) {
    return arcgisToGeoJSON(geometry);
  }
  return geometry;
}

function transformEsriEnvelopeToPolygon ({ xmin, ymin, xmax, ymax }) {
  return {
    type: 'Polygon',
    coordinates: [[
      [xmin, ymin],
      [xmax, ymin],
      [xmax, ymax],
      [xmin, ymax],
      [xmin, ymin]
    ]]
  };
}

function getCrsString ({ wkt, wkid } = {}) {
  return wkt || `EPSG:${wkid}`;
}

module.exports = normalizeGeometryFilter;
