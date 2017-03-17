module.exports = function (geom) {
  return {
    type: 'Polygon',
    coordinates: [[
      [geom.xmin, geom.ymin],
      [geom.xmin, geom.ymax],
      [geom.xmax, geom.ymax],
      [geom.xmax, geom.ymin],
      [geom.xmin, geom.ymin]
    ]]
  }
}
