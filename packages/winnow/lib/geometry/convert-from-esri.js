const utils = require('./utils')
module.exports = function (geometry) {
  var geojson = {}

  if (typeof geometry.x === 'number' && typeof geometry.y === 'number') {
    geojson.type = 'Point'
    geojson.coordinates = [geometry.x, geometry.y]
    if (geometry.z || geometry.m) {
      geojson.coordinates.push(geometry.z)
    }
    if (geometry.m) {
      geojson.coordinates.push(geometry.m)
    }
  }

  if (geometry.points) {
    geojson.type = 'MultiPoint'
    geojson.coordinates = geometry.points.slice(0)
  }

  if (geometry.paths) {
    if (geometry.paths.length === 1) {
      geojson.type = 'LineString'
      geojson.coordinates = geometry.paths[0].slice(0)
    } else {
      geojson.type = 'MultiLineString'
      geojson.coordinates = geometry.paths.slice(0)
    }
  }

  if (geometry.rings) {
    geojson = convertRingsToGeoJSON(geometry.rings.slice(0))
  }
  return geojson
}

function convertRingsToGeoJSON (rings) {
  var outerRings = []
  var holes = []
  var x // iterator
  var outerRing // current outer ring being evaluated
  var hole // current hole being evaluated

  // for each ring
  for (var r = 0; r < rings.length; r++) {
    var ring = utils.closeRing(rings[r].slice(0))
    if (ring.length < 4) {
      continue
    }
    // is this ring an outer ring? is it clockwise?
    if (utils.ringIsClockwise(ring)) {
      var polygon = [ring]
      outerRings.push(polygon) // push to outer rings
    } else {
      holes.push(ring) // counterclockwise push to holes
    }
  }

  var uncontainedHoles = []

  // while there are holes left...
  while (holes.length) {
    // pop a hole off out stack
    hole = holes.pop()

    // loop over all outer rings and see if they contain our hole.
    var contained = false
    for (x = outerRings.length - 1; x >= 0; x--) {
      outerRing = outerRings[x][0]
      if (utils.coordinatesContainCoordinates(outerRing, hole)) {
        // the hole is contained push it into our polygon
        outerRings[x].push(hole)
        contained = true
        break
      }
    }

    // ring is not contained in any outer ring
    // sometimes this happens https://github.com/Esri/esri-leaflet/issues/320
    if (!contained) {
      uncontainedHoles.push(hole)
    }
  }

  // if we couldn't match any holes using contains we can now try intersects...
  while (uncontainedHoles.length) {
    // pop a hole off out stack
    hole = uncontainedHoles.pop()

    // loop over all outer rings and see if any intersect our hole.
    var intersects = false
    for (x = outerRings.length - 1; x >= 0; x--) {
      outerRing = outerRings[x][0]
      if (utils.arraysIntersectArrays(outerRing, hole)) {
        // the hole intersects the outer ring push it into our polygon
        outerRings[x].push(hole)
        intersects = true
        break
      }
    }

    // hole does not intersect ANY outer ring at this point
    // make it an outer ring.
    if (!intersects) {
      outerRings.push([hole.reverse()])
    }
  }

  if (outerRings.length === 1) {
    return {
      type: 'Polygon',
      coordinates: outerRings[0]
    }
  } else {
    return {
      type: 'MultiPolygon',
      coordinates: outerRings
    }
  }
}
