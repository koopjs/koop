const FeatureServer = require('../src')
const polyData = require('./fixtures/polygon.json')
const data = require('./fixtures/snow.json')
const should = require('should')

describe('Info operations', () => {
  describe('when getting featureserver info from geojson', () => {
    it('should return a feature service with the proper geom type', () => {
      const service = FeatureServer.layerInfo(polyData, 0, {})
      service.geometryType.should.equal('esriGeometryPolygon')
      should.not.exist(service.features)
    })

    it('should use the passed in extent if present', () => {
      polyData.extent = [1, 2, 3, 4]
      const service = FeatureServer.layerInfo(polyData, 0, {})
      service.fullExtent[0].should.equal(1)
    })
  })

  describe('when overriding params in a feature service', () => {
    it('should return changed values', () => {
      data.name = 'MyTestName'
      data.description = 'MyTestDesc'
      const service = FeatureServer.layerInfo(data, 0, {})
      service.should.be.an.instanceOf(Object)
      service.name.should.equal(data.name)
      service.description.should.equal(data.description)
    })
  })
})
