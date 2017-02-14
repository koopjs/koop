module.exports = function convert (geojson = {}, options = {}) {
  var result = {}
  if (!geojson.type) return null
  switch (geojson.type) {
    case 'Point':
      result.x = geojson.coordinates[0]
      result.y = geojson.coordinates[1]
      if (geojson.coordinates[2]) {
        result.z = geojson.coordinates[2]
      }
      if (geojson.coordinates[3]) {
        result.m = geojson.coordinates[3]
      }
      break
    case 'MultiPoint':
      result.points = geojson.coordinates.slice(0)
      break
    case 'LineString':
      result.paths = [geojson.coordinates.slice(0)]
      break
    case 'MultiLineString':
      result.paths = geojson.coordinates.slice(0)
      break
    case 'Polygon':
      result.rings = orientRings(geojson.coordinates.slice(0))
      break
    case 'MultiPolygon':
      result.rings = flattenMultiPolygonRings(geojson.coordinates.slice(0))
      break
  }

  return result
}

// This function ensures that rings are oriented in the right directions
// outer rings are clockwise, holes are counterclockwise
function orientRings (poly) {
  var output = []
  var polygon = poly.slice(0)
  var outerRing = closeRing(polygon.shift().slice(0))
  if (outerRing.length >= 4) {
    if (!ringIsClockwise(outerRing)) {
      outerRing.reverse()
    }

    output.push(outerRing)

    for (var i = 0; i < polygon.length; i++) {
      var hole = closeRing(polygon[i].slice(0))
      if (hole.length >= 4) {
        if (ringIsClockwise(hole)) {
          hole.reverse()
        }
        output.push(hole)
      }
    }
  }

  return output
}

// determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
// or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
// points-are-in-clockwise-order
function ringIsClockwise (ringToTest) {
  var total = 0
  var i = 0
  var rLength = ringToTest.length
  var pt1 = ringToTest[i]
  var pt2
  for (i; i < rLength - 1; i++) {
    pt2 = ringToTest[i + 1]
    total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1])
    pt1 = pt2
  }
  return (total >= 0)
}

function flattenMultiPolygonRings (rings) {
  var output = []
  for (var i = 0; i < rings.length; i++) {
    var polygon = orientRings(rings[i])
    for (var x = polygon.length - 1; x >= 0; x--) {
      var ring = polygon[x].slice(0)
      output.push(ring)
    }
  }
  return output
}

// checks if the first and last points of a ring are equal and closes the ring
function closeRing (coordinates) {
  if (!pointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
    coordinates.push(coordinates[0])
  }
  return coordinates
}

// checks if 2 x,y points are equal
function pointsEqual (a, b) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}
