const Joi = require('joi')
const featuresJson = require('../templates/features.json')
const fieldJson = require('../templates/field.json')
const layerJson = require('../templates/layer.json')
const oidFieldJson = require('../templates/oid-field.json')
const serverJson = require('../templates/server.json')
const restInfoJson = require('../templates/rest-info.json')

describe('Template content', () => {
  describe('features.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      const schema = Joi.object().keys({
        'objectIdFieldName': Joi.string().valid('OBJECTID'),
        'globalIdFieldName': Joi.string().valid(''),
        'hasZ': Joi.boolean().valid(false),
        'hasM': Joi.boolean().valid(false),
        'geometryType': Joi.string().valid('esriGeometryPoint'),
        'spatialReference': Joi.object().keys({
          'wkid': Joi.number().valid(4326)
        }),
        'fields': Joi.array().max(0),
        'features': Joi.array().max(0),
        'exceededTransferLimit': Joi.boolean().valid(false)
      })
      Joi.validate(featuresJson, schema, {presence: 'required'}).should.have.property('error', null)
    })
  })

  describe('field.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      const schema = Joi.object().keys({
        'name': Joi.string(),
        'type': Joi.string(),
        'alias': Joi.string(),
        'sqlType': Joi.string().valid('sqlTypeOther'),
        'domain': Joi.valid(null),
        'defaultValue': Joi.valid(null)
      })
      Joi.validate(fieldJson, schema, {presence: 'required'}).should.have.property('error', null)
    })
  })

  describe('layer.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      const schema = Joi.object().keys({
        'currentVersion': Joi.number().valid(10.51),
        'fullVersion': Joi.string().valid('10.5.1'),
        'id': Joi.number().integer().valid(0),
        'name': Joi.string().allow(''),
        'type': Joi.string().allow('Feature Layer'),
        'description': Joi.string().allow(''),
        'geometryType': Joi.string().valid('esriGeometryPoint', 'esriGeometryPoint', 'esriGeometryPoint'),
        'copyrightText': Joi.string().allow(''),
        'parentLayer': Joi.valid(null),
        'subLayers': Joi.valid(null),
        'minScale': Joi.number().integer().valid(0),
        'maxScale': Joi.number().integer().valid(0),
        'drawingInfo': Joi.object().keys({
          'renderer': Joi.object().keys({}),
          'labelingInfo': Joi.valid(null)
        }),
        'defaultVisibility': Joi.boolean().valid(true),
        'extent': Joi.object().keys({
          'xmin': Joi.number().valid(-180),
          'ymin': Joi.number().valid(-90),
          'xmax': Joi.number().valid(180),
          'ymax': Joi.number().valid(90),
          'spatialReference': Joi.object().keys({
            'wkid': Joi.number().valid(4326),
            'latestWkid': Joi.number().valid(4326)
          })
        }),
        'hasAttachments': Joi.boolean().valid(false),
        'htmlPopupType': Joi.string().allow('esriServerHTMLPopupTypeNone'),
        'displayField': Joi.string().allow('OBJECTID'),
        'typeIdField': Joi.valid(null),
        'fields': Joi.array().min(0),
        'relationships': Joi.array().min(0),
        'canModifyLayer': Joi.boolean().valid(false),
        'canScaleSymbols': Joi.boolean().valid(false),
        'hasLabels': Joi.boolean().valid(false),
        'capabilities': Joi.string().allow('Query'),
        'maxRecordCount': Joi.number().integer().valid(2000),
        'supportsStatistics': Joi.boolean().valid(true),
        'supportsAdvancedQueries': Joi.boolean().valid(true),
        'supportedQueryFormats': Joi.string().allow('JSON'),
        'ownershipBasedAccessControlForFeatures': Joi.object().keys({
          'allowOthersToQuery': Joi.boolean().valid(true)
        }),
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
        'dateFieldsTimeReference': null,
        'isDataVersioned': Joi.boolean().valid(false),
        'supportsRollbackOnFailureParameter': Joi.boolean().valid(true),
        'hasM': Joi.boolean().valid(false),
        'hasZ': Joi.boolean().valid(false),
        'allowGeometryUpdates': Joi.boolean().valid(true),
        'objectIdField': Joi.string().valid('OBJECTID'),
        'globalIdField': Joi.string().valid(''),
        'types': Joi.array().min(0),
        'templates': Joi.array().min(0),
        'hasStaticData': Joi.boolean().valid(false),
        'timeInfo': Joi.object().keys({})
      })
      Joi.validate(layerJson, schema, {presence: 'required'}).should.have.property('error', null)
    })
  })

  describe('oid-field.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      const schema = Joi.object().keys({
        'name': Joi.string().valid('OBJECTID'),
        'type': Joi.string().valid('esriFieldTypeOID'),
        'alias': Joi.string().valid('OBJECTID'),
        'sqlType': Joi.string().valid('sqlTypeOther'),
        'domain': Joi.valid(null),
        'defaultValue': Joi.valid(null)
      })
      Joi.validate(oidFieldJson, schema, {presence: 'required'}).should.have.property('error', null)
    })
  })

  describe('rest-info.json', () => {
    it('should conform to the prescribed schema', () => {
      restInfoJson.should.have.property('currentVersion', 10.51)
    })
  })

  describe('server.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      const schema = Joi.object().keys({
        'currentVersion': Joi.number().valid(10.51),
        'fullVersion': Joi.string().valid('10.5.1'),
        'serviceDescription': Joi.string().allow(''),
        'hasVersionedData': Joi.boolean().valid(false),
        'supportsDisconnectedEditing': Joi.boolean().valid(false),
        'supportedQueryFormats': Joi.string().valid('JSON'),
        'maxRecordCount': Joi.number().integer().valid(2000),
        'hasStaticData': Joi.boolean().valid(false),
        'capabilities': Joi.string().valid('Query'),
        'description': Joi.string().allow(''),
        'copyrightText': Joi.string().allow(''),
        'spatialReference': Joi.object().keys({
          'wkid': Joi.number().valid(4326),
          'latestWkid': Joi.number().valid(4326)
        }),
        'initialExtent': Joi.object().keys({
          'xmin': Joi.number().valid(-180),
          'ymin': Joi.number().valid(-90),
          'xmax': Joi.number().valid(180),
          'ymax': Joi.number().valid(90),
          'spatialReference': Joi.object().keys({
            'wkid': Joi.number().valid(4326),
            'latestWkid': Joi.number().valid(4326)
          })
        }),
        'fullExtent': Joi.object().keys({
          'xmin': Joi.number().valid(-180),
          'ymin': Joi.number().valid(-90),
          'xmax': Joi.number().valid(180),
          'ymax': Joi.number().valid(90),
          'spatialReference': Joi.object().keys({
            'wkid': Joi.number().valid(4326),
            'latestWkid': Joi.number().valid(4326)
          })
        }),
        'allowGeometryUpdates': Joi.boolean().valid(false),
        'units': 'esriDecimalDegrees',
        'syncEnabled': Joi.boolean().valid(false),
        'layers': Joi.array().min(0),
        'tables': Joi.array().min(0)
      })
      Joi.validate(serverJson, schema, {presence: 'required'}).should.have.property('error', null)
    })
  })
})
