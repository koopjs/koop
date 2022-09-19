/* global describe, it */
const FeatureServer = require('../..')
const data = require('./fixtures/snow.json')
const should = require('should')
should.config.checkProtoEql = false
const _ = require('lodash')
const Joi = require('joi')
const { serverTemplateSchema } = require('./schemas')

describe('Info operations', () => {
  describe('rest info', () => {
    it('should conform to the prescribed schema', () => {
      const req = {
        app: {
          locals: {}
        }
      }

      const supplementalRestInfo = {
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: 'http://localhost/provider/generateToken'
        }
      }
      const restInfo = FeatureServer.restInfo(supplementalRestInfo, req)
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
      serverSchemaOverride.validate(server, { presence: 'required' }).should.not.have.property('error')
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
      server.layers.length.should.equal(1)
      server.tables.length.should.equal(0)
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

    it('should support a metadata with layer id, defaultVisibility, minScale, and maxScale values', () => {
      const layer0 = _.cloneDeep(data)
      const layer1 = _.cloneDeep(data)
      layer0.metadata = {
        ...layer0.metadata,
        id: 1,
        defaultVisibility: false,
        minScale: 100,
        maxScale: 30000
      }
      layer1.metadata = {
        ...layer1.metadata,
        id: 3,
        defaultVisibility: true,
        minScale: 200,
        maxScale: 20000
      }
      const input = {
        hasStaticData: true,
        maxRecordCount: 100,
        description: 'test',
        extent: [[11, 12], [13, 14]],
        layers: [layer0, layer1]
      }
      const server = FeatureServer.serverInfo(input)
      server.layers.length.should.equal(2)
      server.layers[0].id.should.equal(1)
      server.layers[0].defaultVisibility.should.equal(false)
      server.layers[0].minScale.should.equal(100)
      server.layers[0].maxScale.should.equal(30000)
      server.layers[1].id.should.equal(3)
      server.layers[1].defaultVisibility.should.equal(true)
      server.layers[1].minScale.should.equal(200)
      server.layers[1].maxScale.should.equal(20000)
    })
  })

  describe('field computation', () => {
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
