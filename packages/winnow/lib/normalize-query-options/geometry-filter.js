const _ = require('lodash')
const { normalizeArray } = require('./helpers')
const transformEsriGeometry = require('../geometry/transfrom-esri-geometry-to-geojson-geometry')
const transformCoordinateArrayToPolygon = require('../geometry/transform-coordinate-array-to-polygon')
const transformEnvelopeToPolygon = require('../geometry/transform-envelope-to-polygon')
const projectCoordinates = require('../geometry/project-coordinates')
const normalizeGeometryFilterSpatialReference = require('./geometry-filter-spatial-reference')
const normalizeSourceSR = require('./source-data-spatial-reference')

function normalizeGeometryFilter (options = {}) {
  const geometry = options.geometry || options.bbox

  if (!geometry) return

  const geometryFilterSpatialReference = normalizeGeometryFilterSpatialReference(options)

  const geometryFilter = transformGeometryToPolygon(geometry)

  const dataSpatialReference = normalizeSourceSR(options.sourceSR)

  if (geometryFilterSpatialReference !== dataSpatialReference) {
    geometryFilter.coordinates = projectCoordinates(geometryFilter.coordinates, {
      fromSR: geometryFilterSpatialReference,
      toSR: dataSpatialReference
    })
  }
  return geometryFilter
}

function transformGeometryToPolygon (geometry) {
  if (_.isString(geometry) || Array.isArray(geometry)) {
    const coordinates = normalizeArray(geometry)
    return transformCoordinateArrayToPolygon(coordinates)
  }

  if (geometry.xmin || geometry.xmin === 0) {
    return transformEnvelopeToPolygon(geometry)
  }

  if (geometry.x || geometry.rings || geometry.paths || geometry.points) {
    return transformEsriGeometry(geometry)
  }
  return geometry
}

module.exports = normalizeGeometryFilter
