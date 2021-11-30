module.exports = {
  layerMetadata: require('./layer-metadata'),
  renderers: {
    esriGeometryPolygon: require('../../templates/renderers/symbology/polygon.json'),
    esriGeometryPolyline: require('../../templates/renderers/symbology/line.json'),
    esriGeometryPoint: require('../../templates/renderers/symbology/point.json'),
    esriGeometryMultipoint: require('../../templates/renderers/symbology/point.json')
  },
  serverMetadata: require('./server-metadata'),
  version: require('./version')
}
