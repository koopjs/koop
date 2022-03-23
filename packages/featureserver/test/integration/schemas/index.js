const Joi = require('joi')

const featuresTemplateSchema = Joi.object().keys({
  objectIdFieldName: 'OBJECTID',
  globalIdFieldName: Joi.string().valid(''),
  uniqueIdField: {
    name: 'OBJECTID',
    isSystemMaintained: true
  },
  hasZ: Joi.boolean().valid(false),
  hasM: Joi.boolean().valid(false),
  spatialReference: Joi.object().keys({
    latestWkid: Joi.number().valid(4326),
    wkid: Joi.number().valid(4326)
  }),
  fields: Joi.array(),
  features: Joi.array(),
  exceededTransferLimit: Joi.boolean().valid(false)
})

const fieldsTemplateSchema = Joi.object().keys({
  name: Joi.string(),
  type: Joi.string(),
  alias: Joi.string(),
  sqlType: Joi.string().valid('sqlTypeOther'),
  domain: Joi.valid(null),
  defaultValue: Joi.valid(null)
})

const layersTemplateSchema = Joi.object().keys({
  currentVersion: Joi.number().valid(10.51),
  fullVersion: Joi.string().valid('10.5.1'),
  id: Joi.number().integer().valid(0),
  name: Joi.string().allow(''),
  type: Joi.string().allow('Feature Layer'),
  description: Joi.string().allow(''),
  copyrightText: Joi.string().allow(''),
  parentLayer: Joi.valid(null),
  subLayers: Joi.valid(null),
  minScale: Joi.number().integer().valid(0),
  maxScale: Joi.number().integer().valid(0),
  defaultVisibility: Joi.boolean().valid(true),
  extent: Joi.object().keys({
    xmin: Joi.number().valid(-180),
    ymin: Joi.number().valid(-90),
    xmax: Joi.number().valid(180),
    ymax: Joi.number().valid(90),
    spatialReference: Joi.object().keys({
      wkid: Joi.number().valid(4326),
      latestWkid: Joi.number().valid(4326)
    })
  }),
  hasAttachments: Joi.boolean().valid(false),
  htmlPopupType: Joi.string().allow('esriServerHTMLPopupTypeNone'),
  displayField: Joi.string().allow('OBJECTID'),
  typeIdField: Joi.valid(null),
  relationships: Joi.array().min(0),
  canModifyLayer: Joi.boolean().valid(false),
  canScaleSymbols: Joi.boolean().valid(false),
  hasLabels: Joi.boolean().valid(false),
  capabilities: Joi.string().allow('Query'),
  maxRecordCount: Joi.number().integer().valid(2000),
  supportsStatistics: Joi.boolean().valid(true),
  supportsAdvancedQueries: Joi.boolean().valid(true),
  supportedQueryFormats: Joi.string().allow('JSON'),
  ownershipBasedAccessControlForFeatures: Joi.object().keys({
    allowOthersToQuery: Joi.boolean().valid(true)
  }),
  supportsCoordinatesQuantization: Joi.boolean().valid(false),
  useStandardizedQueries: Joi.boolean().valid(true),
  advancedQueryCapabilities: Joi.object().keys({
    useStandardizedQueries: Joi.boolean().valid(true),
    supportsStatistics: Joi.boolean().valid(true),
    supportsOrderBy: Joi.boolean().valid(true),
    supportsDistinct: Joi.boolean().valid(true),
    supportsPagination: Joi.boolean().valid(true),
    supportsTrueCurve: Joi.boolean().valid(false),
    supportsReturningQueryExtent: Joi.boolean().valid(true),
    supportsQueryWithDistance: Joi.boolean().valid(true)
  }),
  dateFieldsTimeReference: null,
  isDataVersioned: Joi.boolean().valid(false),
  supportsRollbackOnFailureParameter: Joi.boolean().valid(true),
  hasM: Joi.boolean().valid(false),
  hasZ: Joi.boolean().valid(false),
  allowGeometryUpdates: Joi.boolean().valid(true),
  objectIdField: Joi.string().valid('OBJECTID'),
  globalIdField: Joi.string().valid(''),
  types: Joi.array().min(0),
  templates: Joi.array().min(0),
  hasStaticData: Joi.boolean().valid(false),
  timeInfo: Joi.object().keys({}),
  uniqueIdField: Joi.object().keys({
    name: Joi.string().valid('OBJECTID'),
    isSystemMaintained: Joi.boolean().valid(true)
  }),
  fields: Joi.array().items(Joi.object().keys({
    name: Joi.string(),
    type: Joi.string().allow('esriFieldTypeOID', 'esriFieldTypeInteger', 'esriFieldTypeDouble', 'esriFieldTypeString', 'esriFieldTypeDate'),
    alias: Joi.string(),
    length: Joi.optional().when('type', {
      is: Joi.string().allow('esriFieldTypeString', 'esriFieldTypeDate'),
      then: Joi.number().integer().min(0)
    }),
    defaultValue: Joi.any().valid(null),
    domain: Joi.any().valid(null),
    editable: Joi.boolean().valid(false, true),
    nullable: Joi.boolean().valid(false),
    sqlType: Joi.string().valid('sqlTypeOther', 'sqlTypeDouble', 'sqlTypeInteger')
  })).min(0),
  drawingInfo: Joi.object().keys({
    renderer: Joi.object().keys({}),
    labelingInfo: Joi.valid(null)
  })
})

const oidTemplateSchema = Joi.object().keys({
  name: Joi.string().valid('OBJECTID'),
  type: Joi.string().valid('esriFieldTypeOID'),
  alias: Joi.string().valid('OBJECTID'),
  sqlType: Joi.string().valid('sqlTypeInteger'),
  domain: Joi.valid(null),
  defaultValue: Joi.valid(null)
})

const serverTemplateSchema = Joi.object().keys({
  currentVersion: Joi.number().valid(10.51),
  fullVersion: Joi.string().valid('10.5.1'),
  serviceDescription: Joi.string().allow(''),
  hasVersionedData: Joi.boolean().valid(false),
  supportsDisconnectedEditing: Joi.boolean().valid(false),
  supportedQueryFormats: Joi.string().valid('JSON'),
  maxRecordCount: Joi.number().integer().valid(2000),
  hasStaticData: Joi.boolean().valid(false),
  capabilities: Joi.string().valid('Query'),
  description: Joi.string().allow(''),
  copyrightText: Joi.string().allow(''),
  spatialReference: Joi.object().keys({
    wkid: Joi.number().valid(4326),
    latestWkid: Joi.number().valid(4326)
  }),
  initialExtent: Joi.object().keys({
    xmin: Joi.number().valid(-180),
    ymin: Joi.number().valid(-90),
    xmax: Joi.number().valid(180),
    ymax: Joi.number().valid(90),
    spatialReference: Joi.object().keys({
      wkid: Joi.number().valid(4326),
      latestWkid: Joi.number().valid(4326)
    })
  }),
  fullExtent: Joi.object().keys({
    xmin: Joi.number().valid(-180),
    ymin: Joi.number().valid(-90),
    xmax: Joi.number().valid(180),
    ymax: Joi.number().valid(90),
    spatialReference: Joi.object().keys({
      wkid: Joi.number().valid(4326),
      latestWkid: Joi.number().valid(4326)
    })
  }),
  relationships: Joi.array(),
  allowGeometryUpdates: Joi.boolean().valid(false),
  units: 'esriDecimalDegrees',
  syncEnabled: Joi.boolean().valid(false),
  layers: Joi.array().min(0),
  tables: Joi.array().min(0),
  supportsRelationshipsResource: Joi.boolean()
})

module.exports = { featuresTemplateSchema, fieldsTemplateSchema, layersTemplateSchema, oidTemplateSchema, serverTemplateSchema }
