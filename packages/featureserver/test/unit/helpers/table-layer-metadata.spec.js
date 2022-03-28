const should = require('should')
should.config.checkProtoEql = false
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const { version } = require('../../../lib/defaults')
const computeFieldSpy = sinon.spy(function () {
  return ['fields']
})

const TableLayerMetadata = proxyquire('../../../lib/helpers/table-layer-metadata', {
  '../field': {
    computeFieldObject: computeFieldSpy
  }
})

const defaultFixture = {
  id: 0,
  name: 'Not Set',
  type: 'Table',
  description: 'This is a feature service powered by https://github.com/featureserver/featureserver',
  copyrightText: ' ',
  parentLayer: null,
  subLayers: null,
  defaultVisibility: true,
  hasAttachments: false,
  htmlPopupType: 'esriServerHTMLPopupTypeNone',
  displayField: 'OBJECTID',
  typeIdField: null,
  fields: [],
  relationships: [],
  capabilities: 'Query',
  maxRecordCount: 2000,
  supportsStatistics: true,
  supportsAdvancedQueries: true,
  supportedQueryFormats: 'JSON',
  ownershipBasedAccessControlForFeatures: {
    allowOthersToQuery: true
  },
  useStandardizedQueries: true,
  advancedQueryCapabilities: {
    useStandardizedQueries: true,
    supportsStatistics: true,
    supportsOrderBy: true,
    supportsDistinct: true,
    supportsPagination: true,
    supportsTrueCurve: false,
    supportsReturningQueryExtent: true,
    supportsQueryWithDistance: true
  },
  canModifyLayer: false,
  dateFieldsTimeReference: null,
  isDataVersioned: false,
  supportsRollbackOnFailureParameter: true,
  hasM: false,
  hasZ: false,
  allowGeometryUpdates: true,
  objectIdField: 'OBJECTID',
  globalIdField: '',
  types: [],
  templates: [],
  hasStaticData: false,
  timeInfo: {},
  uniqueIdField: {
    name: 'OBJECTID',
    isSystemMaintained: true
  },
  ...version
}

describe('TableLayerMetadata', () => {
  beforeEach(() => {
    computeFieldSpy.resetHistory()
  })

  it('calling with new should return default metadata', () => {
    const tableLayerMetadata = new TableLayerMetadata()
    tableLayerMetadata.should.deepEqual(defaultFixture)
  })

  describe('mixinOverrides', () => {
    it('uses fields creator helper', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      const geojson = {
        features: [{
          type: 'FeatureCollection',
          properties: {}
        }]
      }
      tableLayerMetadata.mixinOverrides(geojson)

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields']
      })
      computeFieldSpy.callCount.should.equal(1)
      computeFieldSpy.firstCall.args.should.deepEqual([geojson, 'layer', {}])
    })

    it('defers to "layerId" option for "id"', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      tableLayerMetadata.mixinOverrides({}, { layerId: '2' })

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        id: 2
      })
    })

    it('uses "id" option when no "layerId" option', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      tableLayerMetadata.mixinOverrides({}, { id: 3 })

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        id: 3
      })
    })

    it('defers to "displayField" option for "displayField"', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      tableLayerMetadata.mixinOverrides({}, { displayField: 'hellow' })

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        displayField: 'hellow'
      })
    })

    it('"idField" option used in multiple overrides', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      tableLayerMetadata.mixinOverrides({}, { idField: 'fluffy' })

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        objectIdField: 'fluffy',
        displayField: 'fluffy',
        uniqueIdField: {
          isSystemMaintained: true,
          name: 'fluffy'
        }
      })
    })

    it('"hasStaticData" option used if a boolean value', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      tableLayerMetadata.mixinOverrides({}, { hasStaticData: true })

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        hasStaticData: true
      })
    })

    it('"hasStaticData" option ignored if not a boolean value', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      tableLayerMetadata.mixinOverrides({}, { hasStaticData: 'true' })

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        hasStaticData: false
      })
    })

    it('empty "capabilities" option ignored', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      tableLayerMetadata.mixinOverrides({}, { capabilities: {} })

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields']
      })
    })

    it('defer to "capabilities.list" option if defined ', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      tableLayerMetadata.mixinOverrides({}, { capabilities: { list: 'hello,world' } })

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        capabilities: 'hello,world'
      })
    })

    it('add "Extract" to default "capabilities" if capabilities.extract is truthy', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      tableLayerMetadata.mixinOverrides({}, { capabilities: { extract: true } })

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        capabilities: 'Query,Extract'
      })
    })

    it('"hasStaticData" option used if a boolean value', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      tableLayerMetadata.mixinOverrides({}, { hasStaticData: true })

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        hasStaticData: true
      })
    })

    it('"supportsPagination" option ignored if not a boolean value', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      tableLayerMetadata.mixinOverrides({}, { supportsPagination: 'false' })

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields']
      })
    })

    it('"supportsPagination" option used if a boolean value', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      tableLayerMetadata.mixinOverrides({}, { supportsPagination: false })

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        advancedQueryCapabilities: {
          ...defaultFixture.advancedQueryCapabilities,
          supportsPagination: false
        }
      })
    })

    it('use supported options for direct overrides', () => {
      const tableLayerMetadata = new TableLayerMetadata()
      tableLayerMetadata.mixinOverrides({}, {
        name: 'Hank Williams',
        relationships: ['something'],
        description: 'There is a tear in my beer.',
        templates: ['templates'],
        timeInfo: { time: 'June of 44' },
        maxRecordCount: 9999,
        defaultVisibility: false
      })

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        name: 'Hank Williams',
        relationships: ['something'],
        description: 'There is a tear in my beer.',
        templates: ['templates'],
        timeInfo: { time: 'June of 44' },
        maxRecordCount: 9999,
        defaultVisibility: false
      })
    })
  })

  it('static method "normalizeInput" should create expected geojson and options', () => {
    const { geojson, options } = TableLayerMetadata.normalizeInput({
      features: ['feature'],
      metadata: {
        foo: 'bar',
        capabilities: 'list,of,stuff'
      },
      capabilities: {
        world: 'hellow'
      }
    }, {
      key: 'GMajor',
      params: { layer: '99' }
    })
    geojson.should.deepEqual({ features: ['feature'] })
    options.should.deepEqual({
      foo: 'bar',
      key: 'GMajor',
      layerId: '99',
      capabilities: {
        list: 'list,of,stuff',
        world: 'hellow'
      }
    })
  })

  it('static method "create" should normalize input, call constructor, and mixin-overrides ', () => {
    const tableLayerMetadata = TableLayerMetadata.create({
      features: ['feature'],
      metadata: {
        foo: 'bar',
        displayField: 'myField',
        capabilities: 'list,of,stuff'
      },
      capabilities: {
        world: 'hellow'
      }
    }, {
      name: 'GMajor',
      params: { layer: '99' }
    })
    tableLayerMetadata.should.deepEqual({
      ...defaultFixture,
      capabilities: 'list,of,stuff',
      displayField: 'myField',
      fields: ['fields'],
      id: 99,
      name: 'GMajor'
    })
  })
})
