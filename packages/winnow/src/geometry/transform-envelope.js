module.exports = function (geom) {
  return {
    type: 'Polygon',
    coordinates: [[
      [geom.xmin, geom.ymin],
      [geom.xmax, geom.ymin],
      [geom.xmax, geom.ymax],
      [geom.xmin, geom.ymax],
      [geom.xmin, geom.ymin]
    ]]
  }
}
