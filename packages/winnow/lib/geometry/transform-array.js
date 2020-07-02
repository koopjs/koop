const bboxPolygon = require('@turf/bbox-polygon').default
module.exports = function (array) {
  return bboxPolygon(array).geometry
}
