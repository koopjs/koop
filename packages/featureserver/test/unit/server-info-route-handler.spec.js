const should = require('should') // eslint-disable-line
const sinon = require('sinon')
const proxyquire = require('proxyquire')

describe('server info', () => {
  it('empty geojson should use and result in defaults', () => {
    const getCollectionCrs = sinon.spy()
    const getGeometryTypeFromGeojson = sinon.spy()
    const normalizeSpatialReference = sinon.spy()
    const normalizeExtent = sinon.spy()

    const serverInfoHandler = proxyquire('../../lib/server-info-route-handler', {
      './helpers': { getCollectionCrs, getGeometryTypeFromGeojson, normalizeSpatialReference, normalizeExtent },
      './defaults': {
        serverMetadata: {
          foo: 'bar',
          maxRecordCount: 'max-record-count',
          serviceDescription: 'service-description',
          copyrightText: 'copyright-text',
          spatialReference: 'spatial-reference',
          fullExtent: 'full-extent',
          initialExtent: 'initial-extent',
          layers: [],
          tables: []
        }
      }
    })

    const serverInfo = serverInfoHandler({})

    serverInfo.should.deepEqual({
      hasStaticData: false,
      supportsRelationshipsResource: false,
      foo: 'bar',
      maxRecordCount: 'max-record-count',
      serviceDescription: 'service-description',
      copyrightText: 'copyright-text',
      spatialReference: 'spatial-reference',
      initialExtent: 'initial-extent',
      fullExtent: 'full-extent',
      layers: [],
      tables: [],
      relationships: []
    })

    getCollectionCrs.notCalled.should.equal(true)
    getGeometryTypeFromGeojson.notCalled.should.equal(true)
    normalizeSpatialReference.notCalled.should.equal(true)
    normalizeExtent.notCalled.should.equal(true)
  })

  it('geojson feature collection with no CRS and no features, should generate tables, use defaults', () => {
    const simpleCollectionFixture = { type: 'FeatureCollection', features: [] }
    const getCollectionCrs = sinon.spy()
    const getGeometryTypeFromGeojson = sinon.spy()
    const normalizeSpatialReference = sinon.spy()
    const normalizeExtent = sinon.spy()
    const normalizeInputData = sinon.spy(function (input) {
      return { tables: [input], layers: [], relationships: [] }
    })

    const serverInfoHandler = proxyquire('../../lib/server-info-route-handler', {
      './helpers': {
        getCollectionCrs,
        getGeometryTypeFromGeojson,
        normalizeSpatialReference,
        normalizeExtent,
        normalizeInputData
      },
      './defaults': {
        serverMetadata: {
          foo: 'bar',
          maxRecordCount: 'max-record-count',
          serviceDescription: 'service-description',
          copyrightText: 'copyright-text',
          spatialReference: 'spatial-reference',
          fullExtent: 'full-extent',
          initialExtent: 'initial-extent',
          layers: [],
          tables: [],
          relationships: []
        }
      }
    })
    const serverInfo = serverInfoHandler(simpleCollectionFixture)
    normalizeInputData.calledOnce.should.equal(true)
    normalizeSpatialReference.notCalled.should.equal(true)
    normalizeExtent.notCalled.should.equal(true)
    getCollectionCrs.calledOnce.should.equal(true)
    getCollectionCrs.firstCall.args.should.deepEqual([simpleCollectionFixture])
    getGeometryTypeFromGeojson.calledOnce.should.equal(false)

    serverInfo.should.deepEqual({
      foo: 'bar',
      hasStaticData: false,
      supportsRelationshipsResource: false,
      maxRecordCount: 'max-record-count',
      serviceDescription: 'service-description',
      copyrightText: 'copyright-text',
      spatialReference: 'spatial-reference',
      fullExtent: 'full-extent',
      initialExtent: 'initial-extent',
      layers: [],
      tables: [{
        id: 0,
        name: 'Table_0',
        parentLayerId: -1,
        defaultVisibility: true,
        subLayerIds: null,
        minScale: 0,
        maxScale: 0,
        geometryType: undefined
      }],
      relationships: []
    })
  })

  it('geojson feature collection with no CRS and null geom features, should generate tables, use defaults', () => {
    const simpleCollectionFixture = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: null }, { type: 'Feature', properties: {}, geometry: null }, { type: 'Feature', properties: {}, geometry: null }] }
    const getCollectionCrs = sinon.spy()
    const getGeometryTypeFromGeojson = sinon.spy()
    const normalizeSpatialReference = sinon.spy()
    const normalizeExtent = sinon.spy()
    const normalizeInputData = sinon.spy(function (input) {
      return { tables: [input], layers: [], relationships: [] }
    })

    const serverInfoHandler = proxyquire('../../lib/server-info-route-handler', {
      './helpers': { getCollectionCrs, getGeometryTypeFromGeojson, normalizeSpatialReference, normalizeExtent, normalizeInputData },
      './defaults': {
        serverMetadata: {
          foo: 'bar',
          maxRecordCount: 'max-record-count',
          serviceDescription: 'service-description',
          copyrightText: 'copyright-text',
          spatialReference: 'spatial-reference',
          fullExtent: 'full-extent',
          initialExtent: 'initial-extent',
          layers: [],
          tables: []
        }
      }
    })
    const serverInfo = serverInfoHandler(simpleCollectionFixture)
    normalizeSpatialReference.notCalled.should.equal(true)
    normalizeExtent.notCalled.should.equal(true)
    getCollectionCrs.calledOnce.should.equal(true)
    normalizeInputData.calledOnce.should.equal(true)

    serverInfo.should.deepEqual({
      foo: 'bar',
      hasStaticData: false,
      supportsRelationshipsResource: false,
      maxRecordCount: 'max-record-count',
      serviceDescription: 'service-description',
      copyrightText: 'copyright-text',
      spatialReference: 'spatial-reference',
      fullExtent: 'full-extent',
      initialExtent: 'initial-extent',
      layers: [],
      tables: [{
        id: 0,
        name: 'Table_0',
        parentLayerId: -1,
        defaultVisibility: true,
        subLayerIds: null,
        minScale: 0,
        maxScale: 0,
        geometryType: undefined
      }],
      relationships: []
    })
  })

  it('simple geojson with CRS should generate layers, extent, spatialReference', () => {
    const simpleCollectionFixture = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-100, 40] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-101, 41] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-99, 39] } }] }

    const getCollectionCrs = sinon.spy(function () { return 4326 })
    const getGeometryTypeFromGeojson = sinon.spy(function () { return 'esriGeometryPoint' })
    const normalizeSpatialReference = sinon.spy(function () { return { wkid: 4326, latestWkid: 4326 } })
    const normalizeExtent = sinon.spy()
    const normalizeInputData = sinon.spy(function (input) {
      return { tables: [], layers: [input], relationships: [] }
    })
    const serverInfoHandler = proxyquire('../../lib/server-info-route-handler', {
      './helpers': { getCollectionCrs, getGeometryTypeFromGeojson, normalizeSpatialReference, normalizeExtent, normalizeInputData },
      './defaults': {
        serverMetadata: {
          foo: 'bar',
          maxRecordCount: 'max-record-count',
          serviceDescription: 'service-description',
          copyrightText: 'copyright-text',
          spatialReference: 'spatial-reference',
          fullExtent: 'full-extent',
          initialExtent: 'initial-extent',
          layers: [],
          tables: []
        }
      }
    })
    const serverInfo = serverInfoHandler(simpleCollectionFixture)

    normalizeExtent.notCalled.should.equal(true)
    normalizeInputData.calledOnce.should.equal(true)
    getCollectionCrs.calledOnce.should.equal(true)
    getCollectionCrs.firstCall.args.should.deepEqual([simpleCollectionFixture])
    getGeometryTypeFromGeojson.calledOnce.should.equal(true)
    getGeometryTypeFromGeojson.firstCall.args.should.deepEqual([simpleCollectionFixture])
    normalizeSpatialReference.calledOnce.should.equal(true)
    normalizeSpatialReference.firstCall.args.should.deepEqual([4326])

    serverInfo.should.deepEqual({
      foo: 'bar',
      maxRecordCount: 'max-record-count',
      serviceDescription: 'service-description',
      copyrightText: 'copyright-text',
      hasStaticData: false,
      supportsRelationshipsResource: false,
      spatialReference: {
        wkid: 4326,
        latestWkid: 4326
      },
      initialExtent: {
        xmin: -101,
        xmax: -99,
        ymin: 39,
        ymax: 41,
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        }
      },
      fullExtent: {
        xmin: -101,
        xmax: -99,
        ymin: 39,
        ymax: 41,
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        }
      },
      layers: [{
        defaultVisibility: true,
        geometryType: 'esriGeometryPoint',
        id: 0,
        maxScale: 0,
        minScale: 0,
        name: 'Layer_0',
        parentLayerId: -1,
        subLayerIds: null
      }],
      tables: [],
      relationships: []
    })
  })

  it('metadata object input should generate layers, extent, spatialReference', () => {
    const getCollectionCrs = sinon.spy(function () { return 4326 })
    const getGeometryTypeFromGeojson = sinon.spy(function () {
      if (getGeometryTypeFromGeojson.callCount === 3 || getGeometryTypeFromGeojson.callCount === 6) return
      return 'esriGeometryPoint'
    })
    const normalizeSpatialReference = sinon.spy(function () { return { wkid: 4326, latestWkid: 4326 } })
    const normalizeExtent = sinon.spy(function () {
      return {
        xmin: -180,
        xmax: 180,
        ymin: -90,
        ymax: 90,
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        }
      }
    })
    const normalizeInputData = sinon.spy(function (input) {
      return { tables: input.tables, layers: input.layers, relationships: [] }
    })
    const layer1 = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-100, 40] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-101, 41] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-99, 39] } }] }
    const layer2 = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-122, 49] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-121, 20] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-110, 43] } }] }
    const tables = [{ type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: null }, { type: 'Feature', properties: {}, geometry: null }, { type: 'Feature', properties: {}, geometry: null }] }]
    const input = {
      maxRecordCount: 5000,
      hasStaticData: true,
      description: 'Defined in metadata',
      copyrightText: 'Custom Copyright Text',
      name: 'Foobar',
      extent: [-180, -90, 180, 90],
      geometryType: 'set by metadata',
      layers: [layer1, layer2],
      tables
    }

    const serverInfoHandler = proxyquire('../../lib/server-info-route-handler', {
      './helpers': { getCollectionCrs, getGeometryTypeFromGeojson, normalizeSpatialReference, normalizeExtent, normalizeInputData },
      './defaults': {
        serverMetadata: {
          foo: 'bar',
          maxRecordCount: 'max-record-count',
          serviceDescription: 'service-description',
          spatialReference: 'spatial-reference',
          fullExtent: 'full-extent',
          initialExtent: 'initial-extent',
          layers: [],
          tables: []
        }
      }
    })

    const serverInfo = serverInfoHandler(input)

    normalizeInputData.calledOnce.should.equal(true)
    getCollectionCrs.calledOnce.should.equal(true)
    getCollectionCrs.firstCall.args.should.deepEqual([input])
    getGeometryTypeFromGeojson.callCount.should.equal(2)
    getGeometryTypeFromGeojson.firstCall.args.should.deepEqual([layer1])
    getGeometryTypeFromGeojson.secondCall.args.should.deepEqual([layer2])
    normalizeSpatialReference.calledOnce.should.equal(true)
    normalizeSpatialReference.firstCall.args.should.deepEqual([4326])
    normalizeExtent.calledOnce.should.equal(true)
    normalizeExtent.firstCall.args.should.deepEqual([
      [-180, -90, 180, 90],
      {
        wkid: 4326,
        latestWkid: 4326
      }
    ])

    serverInfo.should.deepEqual({
      foo: 'bar',
      maxRecordCount: 5000,
      serviceDescription: 'Defined in metadata',
      copyrightText: 'Custom Copyright Text',
      hasStaticData: true,
      supportsRelationshipsResource: false,
      spatialReference: {
        wkid: 4326,
        latestWkid: 4326
      },
      initialExtent: {
        xmin: -180,
        xmax: 180,
        ymin: -90,
        ymax: 90,
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        }
      },
      fullExtent: {
        xmin: -180,
        xmax: 180,
        ymin: -90,
        ymax: 90,
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        }
      },
      layers: [{
        id: 0,
        name: 'Layer_0',
        parentLayerId: -1,
        defaultVisibility: true,
        subLayerIds: null,
        minScale: 0,
        maxScale: 0,
        geometryType: 'esriGeometryPoint'
      }, {
        id: 1,
        name: 'Layer_1',
        parentLayerId: -1,
        defaultVisibility: true,
        subLayerIds: null,
        minScale: 0,
        maxScale: 0,
        geometryType: 'esriGeometryPoint'
      }],
      tables: [{
        id: 2,
        name: 'Table_2',
        parentLayerId: -1,
        defaultVisibility: true,
        subLayerIds: null,
        minScale: 0,
        maxScale: 0,
        geometryType: undefined
      }],
      relationships: []
    })
  })

  it('geojson with metadata property should generate layers, extent, spatialReference', () => {
    const simpleCollectionFixture = {
      metadata: {
        maxRecordCount: 5000,
        hasStaticData: true,
        description: 'Defined in metadata',
        copyrightText: 'Copyright text in metadata',
        name: 'Foobar',
        extent: [-180, -90, 180, 90],
        geometryType: 'Polygon',
        id: 3,
        minScale: 3,
        maxScale: 14,
        defaultVisibility: false
      },
      type: 'FeatureCollection',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-100, 40] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-101, 41] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-99, 39] } }]
    }

    const getCollectionCrs = sinon.spy(function () { return 4326 })
    const getGeometryTypeFromGeojson = sinon.spy(function () { return 'esriGeometryPoint' })
    const normalizeSpatialReference = sinon.spy(function () { return { wkid: 4326, latestWkid: 4326 } })
    const normalizeExtent = sinon.spy(function () {
      return {
        xmin: -180,
        xmax: 180,
        ymin: -90,
        ymax: 90,
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        }
      }
    })
    const normalizeInputData = sinon.spy(function (input) {
      return { layers: [input], tables: [], relationships: [] }
    })

    const serverInfoHandler = proxyquire('../../lib/server-info-route-handler', {
      './helpers': { getCollectionCrs, getGeometryTypeFromGeojson, normalizeSpatialReference, normalizeExtent, normalizeInputData },
      './defaults': {
        serverMetadata: {
          foo: 'bar',
          maxRecordCount: 'max-record-count',
          serviceDescription: 'service-description',
          spatialReference: 'spatial-reference',
          fullExtent: 'full-extent',
          initialExtent: 'initial-extent',
          layers: [],
          tables: []
        }
      }
    })
    const serverInfo = serverInfoHandler(simpleCollectionFixture)

    getCollectionCrs.calledOnce.should.equal(true)
    getCollectionCrs.firstCall.args.should.deepEqual([simpleCollectionFixture])
    getGeometryTypeFromGeojson.callCount.should.equal(1)
    getGeometryTypeFromGeojson.firstCall.args.should.deepEqual([simpleCollectionFixture])
    normalizeSpatialReference.calledOnce.should.equal(true)
    normalizeSpatialReference.firstCall.args.should.deepEqual([4326])
    normalizeExtent.calledOnce.should.equal(true)
    normalizeExtent.firstCall.args.should.deepEqual([
      [-180, -90, 180, 90],
      {
        wkid: 4326,
        latestWkid: 4326
      }
    ])

    serverInfo.should.deepEqual({
      foo: 'bar',
      maxRecordCount: 5000,
      serviceDescription: 'Defined in metadata',
      copyrightText: 'Copyright text in metadata',
      hasStaticData: true,
      supportsRelationshipsResource: false,
      spatialReference: {
        wkid: 4326,
        latestWkid: 4326
      },
      initialExtent: {
        xmin: -180,
        xmax: 180,
        ymin: -90,
        ymax: 90,
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        }
      },
      fullExtent: {
        xmin: -180,
        xmax: 180,
        ymin: -90,
        ymax: 90,
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        }
      },
      layers: [{
        id: 3,
        name: 'Foobar',
        parentLayerId: -1,
        defaultVisibility: false,
        subLayerIds: null,
        minScale: 3,
        maxScale: 14,
        geometryType: 'esriGeometryPoint'
      }],
      tables: [],
      relationships: []
    })
  })

  it('geojson with metadata property including relationships should generate layers, extent, spatialReference and relationships', () => {
    const getCollectionCrs = sinon.spy(function () { return 4326 })
    const getGeometryTypeFromGeojson = sinon.spy(function () {
      if (getGeometryTypeFromGeojson.callCount === 3 || getGeometryTypeFromGeojson.callCount === 6) return
      return 'esriGeometryPoint'
    })
    const normalizeSpatialReference = sinon.spy(function () { return { wkid: 4326, latestWkid: 4326 } })
    const normalizeExtent = sinon.spy(function () {
      return {
        xmin: -180,
        xmax: 180,
        ymin: -90,
        ymax: 90,
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        }
      }
    })
    const normalizeInputData = sinon.spy(function (input) {
      return { tables: input.tables, layers: input.layers, relationships: input.relationships }
    })
    const layer1 = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-100, 40] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-101, 41] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-99, 39] } }] }
    const layer2 = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-122, 49] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-121, 20] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-110, 43] } }] }
    const tables = [{ type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: null }, { type: 'Feature', properties: {}, geometry: null }, { type: 'Feature', properties: {}, geometry: null }] }]
    const relationships = [{ id: 0, name: 'Relationship_0' }, { id: 1, name: 'Relationship_1' }]
    const input = {
      maxRecordCount: 5000,
      hasStaticData: true,
      description: 'Defined in metadata',
      name: 'Foobar',
      extent: [-180, -90, 180, 90],
      geometryType: 'set by metadata',
      layers: [layer1, layer2],
      tables,
      relationships
    }

    const serverInfoHandler = proxyquire('../../lib/server-info-route-handler', {
      './helpers': { getCollectionCrs, getGeometryTypeFromGeojson, normalizeSpatialReference, normalizeExtent, normalizeInputData },
      './defaults': {
        serverMetadata: {
          foo: 'bar',
          maxRecordCount: 'max-record-count',
          serviceDescription: 'service-description',
          copyrightText: 'copyright-text',
          spatialReference: 'spatial-reference',
          fullExtent: 'full-extent',
          initialExtent: 'initial-extent',
          layers: [],
          tables: []
        }
      }
    })
    const serverInfo = serverInfoHandler(input)

    getCollectionCrs.calledOnce.should.equal(true)
    getCollectionCrs.firstCall.args.should.deepEqual([input])
    getGeometryTypeFromGeojson.callCount.should.equal(2)
    getGeometryTypeFromGeojson.firstCall.args.should.deepEqual([layer1])
    normalizeSpatialReference.calledOnce.should.equal(true)
    normalizeSpatialReference.firstCall.args.should.deepEqual([4326])
    normalizeExtent.calledOnce.should.equal(true)
    normalizeExtent.firstCall.args.should.deepEqual([
      [-180, -90, 180, 90],
      {
        wkid: 4326,
        latestWkid: 4326
      }
    ])

    serverInfo.should.deepEqual({
      foo: 'bar',
      maxRecordCount: 5000,
      serviceDescription: 'Defined in metadata',
      copyrightText: 'copyright-text',
      hasStaticData: true,
      supportsRelationshipsResource: true,
      spatialReference: {
        wkid: 4326,
        latestWkid: 4326
      },
      initialExtent: {
        xmin: -180,
        xmax: 180,
        ymin: -90,
        ymax: 90,
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        }
      },
      fullExtent: {
        xmin: -180,
        xmax: 180,
        ymin: -90,
        ymax: 90,
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        }
      },
      layers: [{
        id: 0,
        name: 'Layer_0',
        parentLayerId: -1,
        defaultVisibility: true,
        subLayerIds: null,
        minScale: 0,
        maxScale: 0,
        geometryType: 'esriGeometryPoint'
      }, {
        id: 1,
        name: 'Layer_1',
        parentLayerId: -1,
        defaultVisibility: true,
        subLayerIds: null,
        minScale: 0,
        maxScale: 0,
        geometryType: 'esriGeometryPoint'
      }],
      tables: [{
        id: 2,
        name: 'Table_2',
        parentLayerId: -1,
        defaultVisibility: true,
        subLayerIds: null,
        minScale: 0,
        maxScale: 0,
        geometryType: undefined
      }],
      relationships: [{
        id: 0,
        name: 'Relationship_0'
      }, {
        id: 1,
        name: 'Relationship_1'
      }]
    })
  })
})
