const should = require('should') // eslint-disable-line
should.config.checkProtoEql = false
const sinon = require('sinon')
const proxyquire = require('proxyquire')

describe('layers metadata', () => {
  it('empty input returns empty table and layer arrays', () => {
    const getCollectionCrs = sinon.spy()
    const getGeometryTypeFromGeojson = sinon.spy()
    const normalizeSpatialReference = sinon.spy()
    const normalizeExtent = sinon.spy()

    const layersInfoHandler = proxyquire('../../lib/layers-metadata', {
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

    const layersInfoHandler = proxyquire('../../lib/layers-metadata', {
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

    layersInfo.should.deepEqual({
      layers: [],
      tables: [
        {
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
          currentVersion: 10.51,
          fullVersion: '10.5.1'
        }
      ]
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

    const layersInfoHandler = proxyquire('../../lib/layers-metadata', {
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

    layersInfo.should.deepEqual({
      layers: [],
      tables: [
        {
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
          fields: [
            {
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
          currentVersion: 10.51,
          fullVersion: '10.5.1'
        }
      ]
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

    const layersInfoHandler = proxyquire('../../lib/layers-metadata', {
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

    layersInfo.should.deepEqual({
      layers: [
        {
          id: 0,
          name: 'Not Set',
          type: 'Feature Layer',
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
          currentVersion: 10.51,
          fullVersion: '10.5.1',
          minScale: 0,
          maxScale: 0,
          canScaleSymbols: false,
          drawingInfo: {
            renderer: {
              type: 'simple',
              symbol: {
                color: [
                  45,
                  172,
                  128,
                  161
                ],
                outline: {
                  color: [
                    190,
                    190,
                    190,
                    105
                  ],
                  width: 0.5,
                  type: 'esriSLS',
                  style: 'esriSLSSolid'
                },
                size: 7.5,
                type: 'esriSMS',
                style: 'esriSMSCircle'
              }
            },
            labelingInfo: null
          },
          extent: {
            xmin: -101,
            xmax: -99,
            ymin: 39,
            ymax: 41,
            spatialReference: {
              wkid: 4326,
              latestWkid: 4326
            }
          },
          supportsCoordinatesQuantization: false,
          hasLabels: false,
          geometryType: 'esriGeometryPoint'
        }
      ],
      tables: []
    })
  })

  it('simple geojson with metadata overrides should generate layers, mixin overrides', () => {
    const simpleCollectionFixture = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-100, 40] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-101, 41] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-99, 39] } }] }
    simpleCollectionFixture.metadata = {
      foo: 'bar',
      displayField: 'myField',
      copyrightText: 'Custom copyright text',
      capabilities: 'list,of,stuff'
    }
    const calculateExtent = sinon.spy()
    const getGeometryTypeFromGeojson = sinon.spy(function () {
      return 'Point'
    })
    const getSpatialReference = sinon.spy()
    const normalizeExtent = sinon.spy()
    const normalizeInputData = sinon.spy(function (input) {
      return { tables: [], layers: [input] }
    })

    const layersInfoHandler = proxyquire('../../lib/layers-metadata', {
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

    layersInfo.should.deepEqual({
      layers: [
        {
          id: 0,
          name: 'Not Set',
          type: 'Feature Layer',
          description: 'This is a feature service powered by https://github.com/featureserver/featureserver',
          copyrightText: 'Custom copyright text',
          parentLayer: null,
          subLayers: null,
          defaultVisibility: true,
          hasAttachments: false,
          htmlPopupType: 'esriServerHTMLPopupTypeNone',
          displayField: 'myField',
          typeIdField: null,
          fields: [
            {
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
          relationships: [],
          capabilities: 'list,of,stuff',
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
          currentVersion: 10.51,
          fullVersion: '10.5.1',
          minScale: 0,
          maxScale: 0,
          canScaleSymbols: false,
          drawingInfo: {
            renderer: {
              type: 'simple',
              symbol: {
                color: [
                  45,
                  172,
                  128,
                  161
                ],
                outline: {
                  color: [
                    190,
                    190,
                    190,
                    105
                  ],
                  width: 0.5,
                  type: 'esriSLS',
                  style: 'esriSLSSolid'
                },
                size: 7.5,
                type: 'esriSMS',
                style: 'esriSMSCircle'
              }
            },
            labelingInfo: null
          },
          extent: {
            xmin: -101,
            xmax: -99,
            ymin: 39,
            ymax: 41,
            spatialReference: {
              wkid: 4326,
              latestWkid: 4326
            }
          },
          supportsCoordinatesQuantization: false,
          hasLabels: false,
          geometryType: 'esriGeometryPoint'
        }
      ],
      tables: []
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

    const layersInfoHandler = proxyquire('../../lib/layers-metadata', {
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

    layersInfo.should.deepEqual({
      layers: [
        {
          id: 0,
          name: 'Not Set',
          type: 'Feature Layer',
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
          currentVersion: 10.51,
          fullVersion: '10.5.1',
          minScale: 0,
          maxScale: 0,
          canScaleSymbols: false,
          drawingInfo: {
            renderer: {
              type: 'simple',
              symbol: {
                color: [
                  45,
                  172,
                  128,
                  161
                ],
                outline: {
                  color: [
                    190,
                    190,
                    190,
                    105
                  ],
                  width: 0.5,
                  type: 'esriSLS',
                  style: 'esriSLSSolid'
                },
                size: 7.5,
                type: 'esriSMS',
                style: 'esriSMSCircle'
              }
            },
            labelingInfo: null
          },
          extent: {
            xmin: -101,
            xmax: -99,
            ymin: 39,
            ymax: 41,
            spatialReference: {
              wkid: 4326,
              latestWkid: 4326
            }
          },
          supportsCoordinatesQuantization: false,
          hasLabels: false,
          geometryType: 'esriGeometryPoint'
        },
        {
          id: 1,
          name: 'Not Set',
          type: 'Feature Layer',
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
          currentVersion: 10.51,
          fullVersion: '10.5.1',
          minScale: 0,
          maxScale: 0,
          canScaleSymbols: false,
          drawingInfo: {
            renderer: {
              type: 'simple',
              symbol: {
                color: [
                  45,
                  172,
                  128,
                  161
                ],
                outline: {
                  color: [
                    190,
                    190,
                    190,
                    105
                  ],
                  width: 0.5,
                  type: 'esriSLS',
                  style: 'esriSLSSolid'
                },
                size: 7.5,
                type: 'esriSMS',
                style: 'esriSMSCircle'
              }
            },
            labelingInfo: null
          },
          extent: {
            xmin: -122,
            xmax: -110,
            ymin: 20,
            ymax: 49,
            spatialReference: {
              wkid: 4326,
              latestWkid: 4326
            }
          },
          supportsCoordinatesQuantization: false,
          hasLabels: false,
          geometryType: 'esriGeometryPoint'
        }
      ],
      tables: [
        {
          id: 2,
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
          currentVersion: 10.51,
          fullVersion: '10.5.1'
        }
      ]
    })
  })
})
