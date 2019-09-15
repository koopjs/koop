/* global describe, it */
const FeatureServer = require('../src')
const polyData = require('./fixtures/polygon.json')
const data = require('./fixtures/snow.json')
const dataWithComplexMetadata = require('./fixtures/data-with-complex-metadata.json')
const should = require('should')
const _ = require('lodash')
const Joi = require('joi')
const { layersTemplateSchema, serverTemplateSchema } = require('./schemas')

describe('Info operations', () => {
  describe('rest info', () => {
    it('should conform to the prescribed schema', () => {
      const supplementalRestInfo = {
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: 'http://localhost/provider/generateToken'
        }
      }
      const restInfo = FeatureServer.restInfo(supplementalRestInfo)
      restInfo.should.have.property('currentVersion', 10.51)
      restInfo.should.have.property('authInfo')
      restInfo.authInfo.should.have.property('isTokenBasedSecurity', true)
      restInfo.authInfo.should.have.property('tokenServicesUrl').be.type('string')
    })
  })

  describe('server info', () => {
    it('should conform to the prescribed schema', () => {
      const server = FeatureServer.serverInfo(data)
      const serverSchemaOverride = serverTemplateSchema.append({
        initialExtent: Joi.object().keys({
          xmin: Joi.number().valid(-108.9395),
          ymin: Joi.number().valid(37.084968),
          xmax: Joi.number().valid(-102),
          ymax: Joi.number().valid(40.8877),
          spatialReference: Joi.object().keys({
            wkid: Joi.number().valid(4326),
            latestWkid: Joi.number().valid(4326)
          })
        }),
        fullExtent: Joi.object().keys({
          xmin: Joi.number().valid(-108.9395),
          ymin: Joi.number().valid(37.084968),
          xmax: Joi.number().valid(-102),
          ymax: Joi.number().valid(40.8877),
          spatialReference: Joi.object().keys({
            wkid: Joi.number().valid(4326),
            latestWkid: Joi.number().valid(4326)
          })
        })
      })

      // Test response body schema
      Joi.validate(server, serverSchemaOverride, { presence: 'required' }).should.have.property('error', null)
    })

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
    it('should work with simple geojson passed in (only name and description metadata)', () => {
      const layers = FeatureServer.layersInfo(data)

      const layersSchemaOverride = layersTemplateSchema.append({
        extent: Joi.object().keys({
          xmin: Joi.number().valid(-108.9395),
          ymin: Joi.number().valid(37.084968),
          xmax: Joi.number().valid(-102),
          ymax: Joi.number().valid(40.8877),
          spatialReference: Joi.object().keys({
            wkid: Joi.number().valid(4326),
            latestWkid: Joi.number().valid(4326)
          })
        }),
        geometryType: 'esriGeometryPoint',
        drawingInfo: Joi.object().keys({
          renderer: Joi.object().keys({
            type: 'simple',
            symbol: Joi.object().keys({
              color: Joi.array().items(Joi.number().integer()).length(4),
              outline: Joi.object().keys({
                color: Joi.array().items(Joi.number().integer()).length(4),
                width: Joi.number().min(0),
                type: Joi.string().valid('esriSLS'),
                style: Joi.string().valid('esriSLSSolid')
              }),
              size: Joi.number().min(0),
              type: Joi.string().valid('esriSMS'),
              style: Joi.string().valid('esriSMSCircle')
            })
          }),
          labelingInfo: Joi.valid(null)
        })
      })
      Joi.validate(layers.layers[0], layersSchemaOverride, { presence: 'required' }).should.have.property('error', null)
      layers.layers.length.should.equal(1)
    })

    it('should work with geojson with complex metadata', () => {
      const layers = FeatureServer.layersInfo(dataWithComplexMetadata)
      const layersSchemaOverride = layersTemplateSchema.append({
        extent: Joi.object().keys({
          xmin: -125,
          ymin: 20,
          xmax: -70,
          ymax: 49,
          spatialReference: Joi.object().keys({
            wkid: 4326,
            latestWkid: 4326
          })
        }),
        maxRecordCount: 1,
        capabilities: 'Query,Extract',
        supportsCoordinatesQuantization: true,
        objectIdField: 'interval',
        displayField: 'label',
        geometryType: 'esriGeometryPolygon',
        uniqueIdField: Joi.object().keys({
          name: 'interval',
          isSystemMaintained: true
        }),
        drawingInfo: Joi.object().keys({
          renderer: Joi.object().keys({
            type: 'simple',
            symbol: Joi.object().keys({
              color: Joi.array().items(Joi.number().integer()).length(4),
              outline: Joi.object().keys({
                color: Joi.array().items(Joi.number().integer()).length(4),
                width: Joi.number().min(0),
                type: 'esriSLS',
                style: 'esriSLSSolid'
              }),
              type: 'esriSFS',
              style: 'esriSFSSolid'
            })
          }),
          labelingInfo: Joi.valid(null)
        })
      })

      Joi.validate(layers.layers[0], layersSchemaOverride, { presence: 'required' }).should.have.property('error', null)
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

    it('should override the default true value of "hasStaticData" when set in metadata', () => {
      const input = {
        metadata: {
          hasStaticData: true,
          geometryType: 'Polygon',
          extent: [[11, 12], [13, 14]],
          fields: [{ name: 'test', type: 'integer' }]
        }
      }
      const layer = FeatureServer.layerInfo(input, {})
      layer.hasStaticData.should.equal(true)
    })

    it('should default to templated value of "displayField" when not set in metadata or "fields" is null', () => {
      const input = {
        metadata: {
          geometryType: 'Polygon',
          extent: [[11, 12], [13, 14]],
          fields: null
        }
      }
      const layer = FeatureServer.layerInfo(input, {})
      layer.displayField.should.equal('OBJECTID')
    })

    it('should default to templated value of "displayField" when not set in metadata or "fields" is empty array', () => {
      const input = {
        metadata: {
          geometryType: 'Polygon',
          extent: [[11, 12], [13, 14]],
          fields: []
        }
      }
      const layer = FeatureServer.layerInfo(input, {})
      layer.displayField.should.equal('OBJECTID')
    })

    it('should assign field length from metadata', () => {
      const input = {
        metadata: {
          geometryType: 'Polygon',
          extent: [[11, 12], [13, 14]],
          fields: [
            {
              name: 'test',
              type: 'String',
              length: 1000
            }
          ]
        }
      }
      const layer = FeatureServer.layerInfo(input, {})
      layer.fields.find(f => { return f.name === 'test' }).length.should.equal(1000)
    })
  })

  describe('when getting featureserver info from geojson', () => {
    const data = _.cloneDeep(polyData)
    it('should return a feature service with the proper geom type', () => {
      const service = FeatureServer.layerInfo(data, {})
      service.name.should.equal('map')
      service.displayField.should.equal('OBJECTID')
      service.drawingInfo.renderer.should.equal(require('../templates/renderers/symbology/polygon.json'))
      service.geometryType.should.equal('esriGeometryPolygon')
      should.not.exist(service.features)
    })

    it('should use the passed in extent if present', () => {
      data.metadata.extent = [1, 2, 3, 4]
      const service = FeatureServer.layerInfo(data, {})
      service.extent.xmin.should.equal(1)
    })

    it('should use capabilities found in GeoJSON', () => {
      data.capabilities = { extract: true, quantization: true }
      const service = FeatureServer.layerInfo(data, {})
      service.supportsCoordinatesQuantization.should.equal(true)
      service.capabilities.should.equal('Query,Extract')
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
