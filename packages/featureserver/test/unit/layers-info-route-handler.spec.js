const should = require('should') // eslint-disable-line
const sinon = require('sinon')
const proxyquire = require('proxyquire')

describe('layers info', () => {
  it('empty input returns empty table and layer arrays', () => {
    const getCollectionCrs = sinon.spy()
    const getGeometryTypeFromGeojson = sinon.spy()
    const normalizeSpatialReference = sinon.spy()
    const normalizeExtent = sinon.spy()

    const layersInfoHandler = proxyquire('../../lib/layers-info-route-handler', {
      './helpers': { getCollectionCrs, getGeometryTypeFromGeojson, normalizeSpatialReference, normalizeExtent }
    })

    const layersInfo = layersInfoHandler({})

    layersInfo.should.deepEqual({
      layers: [],
      tables: []
    })

    getCollectionCrs.notCalled.should.equal(true)
    getGeometryTypeFromGeojson.notCalled.should.equal(true)
    normalizeSpatialReference.notCalled.should.equal(true)
    normalizeExtent.notCalled.should.equal(true)
  })

  it('geojson feature collection with no CRS and no features, should generate tables, mixin defaults', () => {
    const simpleCollectionFixture = { type: 'FeatureCollection', features: [] }
    const calculateExtent = sinon.spy()
    const getGeometryTypeFromGeojson = sinon.spy()
    const getSpatialReference = sinon.spy()
    const normalizeExtent = sinon.spy()
    const normalizeInputData = sinon.spy(function (input) {
      return { tables: [input], layers: [] }
    })

    const layersInfoHandler = proxyquire('../../lib/layers-info-route-handler', {
      './helpers': {
        calculateExtent,
        getGeometryTypeFromGeojson,
        getSpatialReference,
        normalizeExtent,
        normalizeInputData
      },
      './defaults': {
        layerMetadata: {
          foo: 'bar'
        }
      }
    })

    const layersInfo = layersInfoHandler(simpleCollectionFixture)
    normalizeInputData.calledOnce.should.equal(true)
    getSpatialReference.calledOnce.should.equal(true)
    normalizeExtent.notCalled.should.equal(true)
    calculateExtent.calledOnce.should.equal(true)
    getGeometryTypeFromGeojson.notCalled.should.equal(true)

    layersInfo.should.deepEqual({
      layers: [],
      tables: [{
        id: 0,
        fields: [],
        type: 'Table',
        geometryType: undefined,
        drawingInfo: { renderer: undefined, labelingInfo: null },
        spatialReference: undefined,
        extent: undefined,
        defaultVisibility: undefined,
        minScale: undefined,
        maxScale: undefined,
        quantization: undefined,
        extract: undefined,
        hasStaticData: undefined,
        name: undefined,
        description: undefined,
        objectIdField: undefined,
        displayField: undefined,
        uniqueIdField: undefined,
        timeInfo: undefined,
        maxRecordCount: undefined,
        supportsCoordinatesQuantization: false,
        capabilities: undefined,
        foo: 'bar'
      }]
    })
  })

  it('geojson feature collection with no CRS and null geom features, should generate tables, mixin defaults', () => {
    const simpleCollectionFixture = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: null }, { type: 'Feature', properties: {}, geometry: null }, { type: 'Feature', properties: {}, geometry: null }] }
    const calculateExtent = sinon.spy()
    const getGeometryTypeFromGeojson = sinon.spy()
    const getSpatialReference = sinon.spy()
    const normalizeExtent = sinon.spy()
    const normalizeInputData = sinon.spy(function (input) {
      return { tables: [input], layers: [] }
    })

    const layersInfoHandler = proxyquire('../../lib/layers-info-route-handler', {
      './helpers': {
        calculateExtent,
        getGeometryTypeFromGeojson,
        getSpatialReference,
        normalizeExtent,
        normalizeInputData
      },
      './defaults': {
        layerMetadata: {
          foo: 'bar'
        }
      }
    })
    const layersInfo = layersInfoHandler(simpleCollectionFixture)
    normalizeInputData.calledOnce.should.equal(true)
    getSpatialReference.calledOnce.should.equal(true)
    normalizeExtent.notCalled.should.equal(true)
    calculateExtent.calledOnce.should.equal(true)
    getGeometryTypeFromGeojson.notCalled.should.equal(true)

    layersInfo.should.deepEqual({
      layers: [],
      tables: [{
        id: 0,
        fields: [{
          name: 'OBJECTID',
          type: 'esriFieldTypeOID',
          alias: 'OBJECTID',
          sqlType: 'sqlTypeInteger',
          domain: null,
          defaultValue: null,
          editable: false,
          nullable: false
        }],
        type: 'Table',
        geometryType: undefined,
        drawingInfo: { renderer: undefined, labelingInfo: null },
        spatialReference: undefined,
        extent: undefined,
        defaultVisibility: undefined,
        minScale: undefined,
        maxScale: undefined,
        quantization: undefined,
        extract: undefined,
        hasStaticData: undefined,
        name: undefined,
        description: undefined,
        objectIdField: undefined,
        displayField: undefined,
        uniqueIdField: undefined,
        timeInfo: undefined,
        maxRecordCount: undefined,
        supportsCoordinatesQuantization: false,
        capabilities: undefined,
        foo: 'bar'
      }]
    })
  })

  it('simple geojson with CRS should generate layers, mixin defaults', () => {
    const simpleCollectionFixture = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-100, 40] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-101, 41] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-99, 39] } }] }
    const calculateExtent = sinon.spy()
    const getGeometryTypeFromGeojson = sinon.spy(function () {
      return 'Point'
    })
    const getSpatialReference = sinon.spy()
    const normalizeExtent = sinon.spy()
    const normalizeInputData = sinon.spy(function (input) {
      return { tables: [], layers: [input] }
    })

    const layersInfoHandler = proxyquire('../../lib/layers-info-route-handler', {
      './helpers': {
        calculateExtent,
        getGeometryTypeFromGeojson,
        getSpatialReference,
        normalizeExtent,
        normalizeInputData
      },
      './defaults': {
        layerMetadata: {
          foo: 'bar'
        }
      }
    })
    const layersInfo = layersInfoHandler(simpleCollectionFixture)
    normalizeInputData.calledOnce.should.equal(true)
    getSpatialReference.calledOnce.should.equal(true)
    normalizeExtent.notCalled.should.equal(true)
    calculateExtent.calledOnce.should.equal(true)
    getGeometryTypeFromGeojson.calledOnce.should.equal(true)

    layersInfo.should.deepEqual({
      tables: [],
      layers: [{
        id: 0,
        fields: [{
          name: 'OBJECTID',
          type: 'esriFieldTypeOID',
          alias: 'OBJECTID',
          sqlType: 'sqlTypeInteger',
          domain: null,
          defaultValue: null,
          editable: false,
          nullable: false
        }],
        type: 'Feature Layer',
        geometryType: 'Point',
        drawingInfo: { renderer: undefined, labelingInfo: null },
        spatialReference: undefined,
        extent: undefined,
        defaultVisibility: undefined,
        minScale: undefined,
        maxScale: undefined,
        quantization: undefined,
        extract: undefined,
        hasStaticData: undefined,
        name: undefined,
        description: undefined,
        objectIdField: undefined,
        displayField: undefined,
        uniqueIdField: undefined,
        timeInfo: undefined,
        maxRecordCount: undefined,
        supportsCoordinatesQuantization: false,
        capabilities: undefined,
        foo: 'bar'
      }]
    })
  })

  it('metadata object input should generate layers, extent, spatialReference', () => {
    const layer1 = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-100, 40] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-101, 41] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-99, 39] } }] }
    const layer2 = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-122, 49] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-121, 20] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-110, 43] } }] }
    const table = [{ type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: null }, { type: 'Feature', properties: {}, geometry: null }, { type: 'Feature', properties: {}, geometry: null }] }]
    const input = {
      maxRecordCount: 5000,
      hasStaticData: true,
      description: 'Defined in metadata',
      name: 'Foobar',
      extent: [-180, -90, 180, 90],
      geometryType: 'set by metadata',
      layers: [layer1, layer2],
      tables: [table]
    }

    const calculateExtent = sinon.spy()
    const getGeometryTypeFromGeojson = sinon.spy(function () {
      return 'Point'
    })
    const getSpatialReference = sinon.spy()
    const normalizeExtent = sinon.spy()
    const normalizeInputData = sinon.spy(function ({ layers, tables }) {
      return { tables, layers }
    })

    const layersInfoHandler = proxyquire('../../lib/layers-info-route-handler', {
      './helpers': {
        calculateExtent,
        getGeometryTypeFromGeojson,
        getSpatialReference,
        normalizeExtent,
        normalizeInputData
      },
      './defaults': {
        layerMetadata: {
          foo: 'bar'
        }
      }
    })
    const layersInfo = layersInfoHandler(input)

    normalizeInputData.calledOnce.should.equal(true)
    calculateExtent.callCount.should.equal(3)
    getGeometryTypeFromGeojson.callCount.should.equal(2)
    getGeometryTypeFromGeojson.firstCall.args.should.deepEqual([layer1])
    getGeometryTypeFromGeojson.secondCall.args.should.deepEqual([layer2])
    getSpatialReference.callCount.should.equal(3)
    normalizeExtent.callCount.should.equal(0)
    layersInfo.should.deepEqual({
      layers: [{
        id: 0,
        fields: [{
          name: 'OBJECTID',
          type: 'esriFieldTypeOID',
          alias: 'OBJECTID',
          sqlType: 'sqlTypeInteger',
          domain: null,
          defaultValue: null,
          editable: false,
          nullable: false
        }
        ],
        type: 'Feature Layer',
        geometryType: 'Point',
        drawingInfo: { renderer: undefined, labelingInfo: null },
        spatialReference: undefined,
        extent: undefined,
        defaultVisibility: undefined,
        minScale: undefined,
        maxScale: undefined,
        quantization: undefined,
        extract: undefined,
        hasStaticData: undefined,
        name: undefined,
        description: undefined,
        objectIdField: undefined,
        displayField: undefined,
        uniqueIdField: undefined,
        timeInfo: undefined,
        maxRecordCount: undefined,
        supportsCoordinatesQuantization: false,
        capabilities: undefined,
        foo: 'bar'
      },
      {
        id: 1,
        fields: [{
          name: 'OBJECTID',
          type: 'esriFieldTypeOID',
          alias: 'OBJECTID',
          sqlType: 'sqlTypeInteger',
          domain: null,
          defaultValue: null,
          editable: false,
          nullable: false
        }
        ],
        type: 'Feature Layer',
        geometryType: 'Point',
        drawingInfo: { renderer: undefined, labelingInfo: null },
        spatialReference: undefined,
        extent: undefined,
        defaultVisibility: undefined,
        minScale: undefined,
        maxScale: undefined,
        quantization: undefined,
        extract: undefined,
        hasStaticData: undefined,
        name: undefined,
        description: undefined,
        objectIdField: undefined,
        displayField: undefined,
        uniqueIdField: undefined,
        timeInfo: undefined,
        maxRecordCount: undefined,
        supportsCoordinatesQuantization: false,
        capabilities: undefined,
        foo: 'bar'
      }],
      tables: [{
        id: 2,
        fields: [],
        type: 'Table',
        geometryType: undefined,
        drawingInfo: { renderer: undefined, labelingInfo: null },
        spatialReference: undefined,
        extent: undefined,
        defaultVisibility: undefined,
        minScale: undefined,
        maxScale: undefined,
        quantization: undefined,
        extract: undefined,
        hasStaticData: undefined,
        name: undefined,
        description: undefined,
        objectIdField: undefined,
        displayField: undefined,
        uniqueIdField: undefined,
        timeInfo: undefined,
        maxRecordCount: undefined,
        supportsCoordinatesQuantization: false,
        capabilities: undefined,
        foo: 'bar'
      }]
    })
  })
})
