const Terraformer = require('terraformer')

module.exports = function (geom) {
  const polygon = new Terraformer.Polygon({
    type: 'Polygon',
    coordinates: [[
      [geom.xmin, geom.ymin],
      [geom.xmin, geom.ymax],
      [geom.xmax, geom.ymax],
      [geom.xmax, geom.ymin],
      [geom.xmin, geom.ymin]
    ]]
  })
  const isMercator = geom.spatialReference && (geom.spatialReference.wkid === 102100 || geom.spatialReference.latestWkid === 3857)
  if (isMercator) {
    return Terraformer.toGeographic(polygon)
  } else if (geom.spatialReference && geom.spatialReference.wkid && geom.spatialReference.wkid !== 4326) {
    throw new Error(`Spatial Reference: ${geom.spatialReference.wkid} not supported`)
  } else {
    return polygon
  }
}
