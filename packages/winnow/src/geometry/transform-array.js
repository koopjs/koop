const bboxPolygon = require('@turf/bbox-polygon')
module.exports = function (array) {
  return bboxPolygon(array).geometry
}
