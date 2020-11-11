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

function arraysIntersectArrays (a, b) {
  if (isNumber(a[0][0])) {
    if (isNumber(b[0][0])) {
      for (let i = 0; i < a.length - 1; i++) {
        for (let j = 0; j < b.length - 1; j++) {
          if (edgeIntersectsEdge(a[i], a[i + 1], b[j], b[j + 1])) {
            return true
          }
        }
      }
    } else {
      for (let k = 0; k < b.length; k++) {
        if (arraysIntersectArrays(a, b[k])) {
          return true
        }
      }
    }
  } else {
    for (let l = 0; l < a.length; l++) {
      if (arraysIntersectArrays(a[l], b)) {
        return true
      }
    }
  }
  return false
}

// ported from terraformer-arcgis-parser.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L502-L512
function coordinatesContainPoint (coordinates, point) {
  var contains = false
  for (var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
    if (((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1]) ||
         (coordinates[j][1] <= point[1] && point[1] < coordinates[i][1])) &&
        (point[0] < (((coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1])) / (coordinates[j][1] - coordinates[i][1])) + coordinates[i][0])) {
      contains = !contains
    }
  }
  return contains
}

// ported from ported from terraformer-arcgis-parser.js https://github.com/Esri/terraformer-arcgis-parser/blob/master/terraformer-arcgis-parser.js#L159-L166
function coordinatesContainCoordinates (outer, inner) {
  var intersects = arraysIntersectArrays(outer, inner)
  var contains = coordinatesContainPoint(outer, inner[0])
  if (!intersects && contains) {
    return true
  }
  return false
}

function edgeIntersectsEdge (a1, a2, b1, b2) {
  const uaT = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0])
  const ubT = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0])
  const uB = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1])

  if (uB !== 0) {
    const ua = uaT / uB
    const ub = ubT / uB

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return true
    }
  }

  return false
}

function isNumber (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

module.exports = {
  pointsEqual,
  ringIsClockwise,
  closeRing,
  arraysIntersectArrays,
  coordinatesContainPoint,
  coordinatesContainCoordinates
}
