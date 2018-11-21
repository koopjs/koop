/* global describe, it */
const FeatureServer = require('../src')
const polyData = require('./fixtures/polygon.json')
const data = require('./fixtures/snow.json')
const should = require('should')
const _ = require('lodash')
const Joi = require('joi')

describe('Info operations', () => {
  describe('rest info', () => {
    it('should conform to the prescribed schema', () => {
      let supplementalRestInfo = {
        'authInfo': {
          'isTokenBasedSecurity': true,
          'tokenServicesUrl': 'http://localhost/provider/generateToken'
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

      // Test response body schema
      const schema = Joi.object().keys({
        'currentVersion': Joi.number().valid(10.51),
        'fullVersion': Joi.string().valid('10.5.1'),
        'hasVersionedData': Joi.boolean().valid(false),
        'supportsDisconnectedEditing': Joi.boolean().valid(false),
        'supportedQueryFormats': Joi.string().valid('JSON'),
        'maxRecordCount': Joi.number().integer().min(1),
        'hasStaticData': Joi.boolean(),
        'capabilities': Joi.string().valid('Query'),
        'serviceDescription': Joi.string().allow(''),
        'description': Joi.string(),
        'copyrightText': Joi.string(),
        'spatialReference': Joi.object().keys({
          'wkid': Joi.number().integer(),
          'latestWkid': Joi.number().integer()
        }),
        'initialExtent': Joi.object().keys({
          'xmin': Joi.number(),
          'ymin': Joi.number(),
          'xmax': Joi.number(),
          'ymax': Joi.number(),
          'spatialReference': Joi.object().keys({
            'wkid': Joi.number().integer(),
            'latestWkid': Joi.number().integer()
          })
        }),
        'fullExtent': Joi.object().keys({
          'xmin': Joi.number(),
          'ymin': Joi.number(),
          'xmax': Joi.number(),
          'ymax': Joi.number(),
          'spatialReference': Joi.object().keys({
            'wkid': Joi.number().integer(),
            'latestWkid': Joi.number().integer()
          })
        }),
        'allowGeometryUpdates': Joi.boolean().valid(false),
        'units': Joi.string(),
        'syncEnabled': Joi.boolean().valid(false),
        'layers': Joi.array().items(Joi.object().keys({
          'id': Joi.number().integer(),
          'name': Joi.string(),
          'parentLayerId': Joi.number().integer().min(-1).allow(null),
          'defaultVisibility': Joi.boolean(),
          'subLayerIds': Joi.array().valid(null).items(Joi.number().integer()),
          'minScale': Joi.number().integer().min(0),
          'maxScale': Joi.number().integer().min(0),
          'geometryType': Joi.string()
        })),
        'tables': Joi.array()
      })
      Joi.validate(server, schema, { presence: 'required' }).should.have.property('error', null)
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
    it('should work with simple geojson passed in', () => {
      const layers = FeatureServer.layersInfo(data)

      const schema = Joi.object().keys({
        'currentVersion': Joi.number().valid(10.51),
        'fullVersion': Joi.string().valid('10.5.1'),
        'id': Joi.number().integer().min(0),
        'name': Joi.string(),
        'type': Joi.string().valid('Feature Layer'),
        'description': Joi.string(),
        'geometryType': Joi.string(),
        'copyrightText': Joi.string(),
        'parentLayer': Joi.number().integer().min(-1).allow(null),
        'subLayers': Joi.array().allow(null).items(Joi.number().integer()),
        'minScale': Joi.number().integer().min(0),
        'maxScale': Joi.number().integer().min(0),
        'drawingInfo': Joi.object().keys({
          'renderer': Joi.object(),
          'labelingInfo': Joi.object().allow(null)
        }),
        'defaultVisibility': Joi.boolean(),
        'extent': Joi.object().keys({
          'xmin': Joi.number(),
          'ymin': Joi.number(),
          'xmax': Joi.number(),
          'ymax': Joi.number(),
          'spatialReference': Joi.object().keys({
            'wkid': Joi.number().integer(),
            'latestWkid': Joi.number().integer()
          })
        }),
        'hasAttachments': Joi.boolean().valid(false),
        'htmlPopupType': Joi.string().valid('esriServerHTMLPopupTypeNone'),
        'displayField': Joi.string(),
        'typeIdField': Joi.string().allow(null),
        'fields': Joi.array().items(Joi.object().keys({
          'name': Joi.string().when('type', { is: 'esriFieldTypeOID', then: Joi.valid('OBJECTID'), otherwise: Joi.string() }),
          'type': Joi.string().allow('esriFieldTypeOID', 'esriFieldTypeInteger', 'esriFieldTypeDouble', 'esriFieldTypeString', 'esriFieldTypeDate'),
          'alias': Joi.string().when('type', { is: 'esriFieldTypeOID', then: Joi.valid('OBJECTID'), otherwise: Joi.string() }),
          'length': Joi.optional().when('type', {
            is: Joi.string().allow('esriFieldTypeString', 'esriFieldTypeDate'),
            then: Joi.number().integer().min(0)
          }),
          'defaultValue': Joi.any().valid(null),
          'domain': Joi.any().valid(null),
          'editable': Joi.boolean().valid(false),
          'nullable': Joi.boolean().valid(false),
          'sqlType': Joi.string().valid('sqlTypeOther', 'sqlTypeDouble')
        })),
        'relationships': Joi.array(),
        'canModifyLayer': Joi.boolean().valid(false),
        'canScaleSymbols': Joi.boolean().valid(false),
        'hasLabels': Joi.boolean().valid(false),
        'capabilities': Joi.string().valid('Query'),
        'maxRecordCount': Joi.number().integer().min(0),
        'supportsStatistics': Joi.boolean().valid(true),
        'supportsAdvancedQueries': Joi.boolean().valid(true),
        'supportedQueryFormats': Joi.string().valid('JSON'),
        'ownershipBasedAccessControlForFeatures': {
          'allowOthersToQuery': true
        },
        'supportsCoordinatesQuantization': Joi.boolean().valid(false),
        'useStandardizedQueries': Joi.boolean().valid(true),
        'advancedQueryCapabilities': Joi.object().keys({
          'useStandardizedQueries': Joi.boolean().valid(true),
          'supportsStatistics': Joi.boolean().valid(true),
          'supportsOrderBy': Joi.boolean().valid(true),
          'supportsDistinct': Joi.boolean().valid(true),
          'supportsPagination': Joi.boolean().valid(true),
          'supportsTrueCurve': Joi.boolean().valid(false),
          'supportsReturningQueryExtent': Joi.boolean().valid(true),
          'supportsQueryWithDistance': Joi.boolean().valid(true)
        }),
        'dateFieldsTimeReference': Joi.object().valid(null),
        'isDataVersioned': Joi.boolean().valid(false),
        'supportsRollbackOnFailureParameter': Joi.boolean().valid(true),
        'hasM': Joi.boolean().valid(false),
        'hasZ': Joi.boolean().valid(false),
        'allowGeometryUpdates': Joi.boolean().valid(true),
        'objectIdField': Joi.string().valid('OBJECTID'),
        'globalIdField': Joi.string().allow(''),
        'types': Joi.array(),
        'templates': Joi.array(),
        'hasStaticData': Joi.boolean().valid(false),
        'timeInfo': Joi.object().optional(),
        'spatialReference': Joi.object().keys({
          'wkid': Joi.number().valid(4326)
        })
      })
      Joi.validate(layers.layers[0], schema, { presence: 'required' }).should.have.property('error', null)
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
      layer.objectIdField.should.equal('OBJECTID')
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
          idField: 'test',
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
