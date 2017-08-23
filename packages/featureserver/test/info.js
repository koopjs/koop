/* global describe, it */
const FeatureServer = require('../src')
const polyData = require('./fixtures/polygon.json')
const data = require('./fixtures/snow.json')
const should = require('should')
const _ = require('lodash')

describe('Info operations', () => {
  describe('server info', () => {
    it('should work with geojson passed in', () => {
      const server = FeatureServer.serverInfo(data)
      server.layers.length.should.equal(1)
      server.initialExtent.xmin.should.equal(-108.9395)
      server.fullExtent.xmin.should.equal(-108.9395)
    })

    it('should support a passed in metadata', () => {
      const input = {
        hasStaticData: true,
        maxRecordCount: 100,
        description: 'test',
        extent: [[11, 12], [13, 14]],
        layers: [_.cloneDeep(data)]
      }
      const server = FeatureServer.serverInfo(input)
      server.hasStaticData.should.equal(true)
      server.maxRecordCount.should.equal(100)
      server.serviceDescription.should.equal('test')
      server.layers.length.should.equal(1)
      server.initialExtent.xmin.should.equal(11)
      server.initialExtent.ymax.should.equal(14)
    })

    it('should not bomb out on this thing', () => {
      const input = {
        layers: [require('./fixtures/polygon-metadata-error.json')]
      }
      const server = FeatureServer.serverInfo(input)
      server.layers.length.should.equal(0)
      server.tables.length.should.equal(1)
    })

    it('should support a passed in metadata with no extent', () => {
      const input = {
        hasStaticData: true,
        maxRecordCount: 100,
        description: 'test',
        layers: [_.cloneDeep(data)]
      }
      const server = FeatureServer.serverInfo(input)
      server.hasStaticData.should.equal(true)
      server.maxRecordCount.should.equal(100)
      server.serviceDescription.should.equal('test')
      server.layers.length.should.equal(1)
    })

    it('should support a passed in metadata with 0,0,0,0 extent', () => {
      const input = {
        hasStaticData: true,
        maxRecordCount: 100,
        description: 'test',
        layers: [_.cloneDeep(data)],
        extent: {
          xmin: 0,
          ymin: 0,
          xmax: 0,
          ymax: 0
        }
      }
      const server = FeatureServer.serverInfo(input)
      server.hasStaticData.should.equal(true)
      server.maxRecordCount.should.equal(100)
      server.serviceDescription.should.equal('test')
      server.layers.length.should.equal(1)
    })

    it('should support a passed in geometry type', () => {
      const input = {
        description: 'test',
        extent: [[11, 12], [13, 14]],
        layers: [
          {
            type: 'FeatureCollection',
            metadata: {
              name: 'test',
              geometryType: 'Point'
            }
          }
        ]
      }
      const server = FeatureServer.serverInfo(input)
      server.serviceDescription.should.equal('test')
      server.layers.length.should.equal(1)
      server.initialExtent.xmin.should.equal(11)
      server.initialExtent.ymax.should.equal(14)
      server.layers[0].name.should.equal('test')
      server.layers[0].geometryType.should.equal('esriGeometryPoint')
    })
  })

  describe('layers info', () => {
    it('should work with simple geojson passed in', () => {
      const layers = FeatureServer.layersInfo(data)
      layers.layers.length.should.equal(1)
    })
  })

  describe('getting layer info without features', () => {
    it('should work with only metadata', () => {
      const input = {
        metadata: {
          name: 'test',
          description: 'test',
          extent: [[11, 12], [13, 14]],
          geometryType: 'Polygon',
          maxRecordCount: 100,
          displayField: 'test',
          idField: 'test',
          timeInfo: {
            test: 'test'
          }
        }
      }
      const layer = FeatureServer.layerInfo(input, {})
      layer.name.should.equal('test')
      layer.description.should.equal('test')
      layer.extent.xmin.should.equal(11)
      layer.extent.ymax.should.equal(14)
      layer.geometryType.should.equal('esriGeometryPolygon')
      layer.maxRecordCount.should.equal(100)
      layer.objectIdField.should.equal('test')
      layer.displayField.should.equal('test')
      layer.timeInfo.test.should.equal('test')
    })

    it('should assign esriFieldTypeOID to the idField', () => {
      const input = {
        metadata: {
          idField: 'test',
          geometryType: 'Polygon',
          extent: [[11, 12], [13, 14]],
          fields: [
            {
              name: 'test',
              type: 'integer'
            }
          ]
        }
      }
      const layer = FeatureServer.layerInfo(input, {})
      layer.fields[0].type.should.equal('esriFieldTypeOID')
    })
  })

  describe('when getting featureserver info from geojson', () => {
    it('should return a feature service with the proper geom type', () => {
      const service = FeatureServer.layerInfo(polyData, {})
      service.name.should.equal('map')
      service.displayField.should.equal('OBJECTID')
      service.drawingInfo.renderer.should.equal(require('../templates/renderers/symbology/polygon.json'))
      service.geometryType.should.equal('esriGeometryPolygon')
      should.not.exist(service.features)
    })

    it('should use the passed in extent if present', () => {
      polyData.metadata.extent = [1, 2, 3, 4]
      const service = FeatureServer.layerInfo(polyData, {})
      service.extent.xmin.should.equal(1)
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
