const FeatureServer = require('../src')
const polyData = require('./fixtures/polygon.json')
const data = require('./fixtures/snow.json')
const should = require('should')

describe('Info operations', () => {
  describe('server info', () => {
    it('should work with geojson passed in', () => {
      const server = FeatureServer.serverInfo(data)
      server.layers.length.should.equal(1)
      server.initialExtent.xmin.should.equal(-108.9395)
      server.fullExtent.xmin.should.equal(-108.9395)
    })
  })

  describe('layers info', () => {
    it('should work with simple geojson passed in', () => {
      const layers = FeatureServer.layersInfo(data)
      layers.layers.length.should.equal(1)
    })
  })

  describe('when getting featureserver info from geojson', () => {
    it('should return a feature service with the proper geom type', () => {
      const service = FeatureServer.layerInfo(polyData, {})
      service.name.should.equal('map')
      service.displayField.should.equal('OBJECTID')
      service.drawingInfo.renderer.should.equal(require('../templates/renderers/polygon.json'))
      service.geometryType.should.equal('esriGeometryPolygon')
      should.not.exist(service.features)
    })

    it('should use the passed in extent if present', () => {
      polyData.metadata.extent = [1, 2, 3, 4]
      const service = FeatureServer.layerInfo(polyData, {})
      service.extent[0].should.equal(1)
    })
  })

  describe('when overriding params in a feature service', () => {
    it('should return changed values', () => {
      data.name = 'Snow'
      data.description = 'MyTestDesc'
      const service = FeatureServer.layerInfo(data, {})
      service.should.be.an.instanceOf(Object)
      service.name.should.equal(data.name)
      service.description.should.equal(data.description)
    })
  })
})
