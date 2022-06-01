const should = require('should')
should.config.checkProtoEql = false
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const { version } = require('../../../lib/defaults')
const { PointRenderer } = require('../../../lib/helpers/renderers')

const calculateBoundsSpy = sinon.spy(function () {
  return [0, 1, 2, 3]
})
const getSpatialReferenceSpy = sinon.spy(function () {
  return {
    wkid: 4326,
    latestWkid: 4326
  }
})
const getGeometryTypeFromGeojsonSpy = sinon.spy(function () {
  return 'esriGeometryPoint'
})
const normalizeExtentSpy = sinon.spy(function () {
  return 'normalized-extent'
})

const defaultFixture = {
  id: 0,
  name: 'Not Set',
  description: 'This is a feature service powered by https://github.com/featureserver/featureserver',
  copyrightText: ' ',
  parentLayer: null,
  subLayers: null,
  defaultVisibility: true,
  hasAttachments: false,
  htmlPopupType: 'esriServerHTMLPopupTypeNone',
  displayField: 'OBJECTID',
  typeIdField: null,
  fields: [
    {
      alias: 'OBJECTID',
      defaultValue: null,
      domain: null,
      editable: false,
      name: 'OBJECTID',
      nullable: false,
      sqlType: 'sqlTypeInteger',
      type: 'esriFieldTypeOID'
    }
  ],
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
  type: 'Feature Layer',
  minScale: 0,
  maxScale: 0,
  canScaleSymbols: false,
  drawingInfo: {
    renderer: {},
    labelingInfo: null
  },
  extent: {
    xmin: -180,
    ymin: -90,
    xmax: 180,
    ymax: 90,
    spatialReference: {
      wkid: 4326,
      latestWkid: 4326
    }
  },
  supportsCoordinatesQuantization: false,
  hasLabels: false,
  ...version
}

const FeatureLayerMetadata = proxyquire('../../../lib/helpers/feature-layer-metadata', {
  '@terraformer/spatial': { calculateBounds: calculateBoundsSpy },
  './get-spatial-reference': getSpatialReferenceSpy,
  './get-geometry-type-from-geojson': getGeometryTypeFromGeojsonSpy,
  './normalize-extent': normalizeExtentSpy
})

describe('FeatureLayerMetadata', () => {
  beforeEach(() => {
    calculateBoundsSpy.resetHistory()
    getSpatialReferenceSpy.resetHistory()
    getGeometryTypeFromGeojsonSpy.resetHistory()
    normalizeExtentSpy.resetHistory()
  })

  it('calling with new should return default metadata', () => {
    const featureLayerMetadata = new FeatureLayerMetadata()
    featureLayerMetadata.should.deepEqual({
      ...defaultFixture,
      fields: []
    })
  })

  describe('mixinOverrides', () => {
    it('should set point geometryType and renderer', () => {
      const featureLayerMetadata = new FeatureLayerMetadata()
      featureLayerMetadata.mixinOverrides({
        features: []
      }, { foo: 'bar' })

      featureLayerMetadata.should.deepEqual({
        ...defaultFixture,
        geometryType: 'esriGeometryPoint',
        drawingInfo: {
          labelingInfo: null,
          renderer: new PointRenderer()
        }
      })
      getGeometryTypeFromGeojsonSpy.callCount.should.equal(1)
      getGeometryTypeFromGeojsonSpy.firstCall.args.should.deepEqual([{
        features: [],
        foo: 'bar'
      }])
    })

    it('should set quanitization if capabilities.quantization === true', () => {
      const featureLayerMetadata = new FeatureLayerMetadata()

      featureLayerMetadata.mixinOverrides({
        features: []
      }, {
        capabilities: {
          quantization: true
        }
      })

      featureLayerMetadata.should.deepEqual({
        ...defaultFixture,
        geometryType: 'esriGeometryPoint',
        drawingInfo: {
          labelingInfo: null,
          renderer: new PointRenderer()
        },
        supportsCoordinatesQuantization: true
      })
    })

    it('should set extent from options', () => {
      const featureLayerMetadata = new FeatureLayerMetadata()

      featureLayerMetadata.mixinOverrides({
        features: ['feature']
      }, {
        extent: 'dataset-extent'
      })

      featureLayerMetadata.should.deepEqual({
        ...defaultFixture,
        geometryType: 'esriGeometryPoint',
        drawingInfo: {
          labelingInfo: null,
          renderer: new PointRenderer()
        },
        extent: 'normalized-extent'
      })

      getSpatialReferenceSpy.callCount.should.equal(1)
      calculateBoundsSpy.callCount.should.equal(0)
      normalizeExtentSpy.callCount.should.equal(1)
    })

    it('should set extent from features', () => {
      const featureLayerMetadata = new FeatureLayerMetadata()

      featureLayerMetadata.mixinOverrides({
        features: ['feature']
      }, {})

      featureLayerMetadata.should.deepEqual({
        ...defaultFixture,
        geometryType: 'esriGeometryPoint',
        drawingInfo: {
          labelingInfo: null,
          renderer: new PointRenderer()
        },
        extent: {
          spatialReference: {
            wkid: 4326,
            latestWkid: 4326
          },
          xmax: 2,
          xmin: 0,
          ymax: 3,
          ymin: 1
        }
      })

      getSpatialReferenceSpy.callCount.should.equal(1)
      calculateBoundsSpy.callCount.should.equal(1)
      normalizeExtentSpy.callCount.should.equal(0)
    })

    it('should set renderer from options', () => {
      const featureLayerMetadata = new FeatureLayerMetadata()

      featureLayerMetadata.mixinOverrides({
        features: []
      }, { renderer: 'custom-renderer' })

      featureLayerMetadata.should.deepEqual({
        ...defaultFixture,
        geometryType: 'esriGeometryPoint',
        drawingInfo: {
          labelingInfo: null,
          renderer: 'custom-renderer'
        }
      })
    })

    it('should set other direct overrides', () => {
      const featureLayerMetadata = new FeatureLayerMetadata()

      featureLayerMetadata.mixinOverrides({
        features: []
      }, { minScale: 1, maxScale: 10 })

      featureLayerMetadata.should.deepEqual({
        ...defaultFixture,
        geometryType: 'esriGeometryPoint',
        drawingInfo: {
          labelingInfo: null,
          renderer: new PointRenderer()
        },
        minScale: 1,
        maxScale: 10
      })
    })
  })

  it('static method "create" should normalize input, call constructor, and mixin-overrides ', () => {
    const featureLayerMetadata = FeatureLayerMetadata.create({
      features: [],
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
    featureLayerMetadata.should.deepEqual({
      ...defaultFixture,
      geometryType: 'esriGeometryPoint',
      drawingInfo: {
        labelingInfo: null,
        renderer: new PointRenderer()
      },
      capabilities: 'list,of,stuff',
      displayField: 'myField',
      id: 99,
      name: 'GMajor'
    })
  })
})
