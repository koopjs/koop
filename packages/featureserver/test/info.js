const FeatureServer = require('../src/featureserver.js')
const polyData = require('./fixtures/polygon.json')
const data = require('./fixtures/snow.json')

describe('Info operations', () => {
  describe('when getting featureserver info from geojson', () => {
    it('should return a feature service with the proper geom type', (done) => {
      const service = FeatureServer.layerInfo(polyData, 0, {})
      service.geometryType.should.equal('esriGeometryPolygon')
      done()
    })

    it('should use the passed in extent if present', (done) => {
      polyData.extent = [1, 2, 3, 4]
      const service = FeatureServer.layerInfo(polyData, 0, {})
      service.fullExtent[0].should.equal(1)
      done()
    })
  })

  describe('when overriding params in a feature service', () => {
    it('should return changed values', (done) => {
      data.name = 'MyTestName'
      data.description = 'MyTestDesc'
      const service = FeatureServer.layerInfo(data, 0, {})
      service.should.be.an.instanceOf(Object)
      service.name.should.equal(data.name)
      service.description.should.equal(data.description)
      done()
    })
  })

})
