const should = require('should') // eslint-disable-line
const { renderLayer } = require('../../lib/templates')
const defaults = require('../../lib/defaults')
const _ = require('lodash')

const defaultTable = {
  id: 0,
  name: 'Not Set',
  type: 'Table',
  description: 'This is a feature service powered by https://github.com/featureserver/featureserver',
  copyrightText: ' ',
  currentVersion: 10.51,
  parentLayer: null,
  subLayers: null,
  minScale: 0,
  maxScale: 0,
  drawingInfo: { renderer: undefined, labelingInfo: null },
  defaultVisibility: true,
  extent: {
    xmin: Infinity,
    ymin: Infinity,
    xmax: -1 * Infinity,
    ymax: -1 * Infinity,
    spatialReference: { wkid: 4326, latestWkid: 4326 }
  },
  hasAttachments: false,
  htmlPopupType: 'esriServerHTMLPopupTypeNone',
  displayField: 'OBJECTID',
  typeIdField: null,
  fields: undefined,
  fullVersion: '10.5.1',
  geometryType: undefined,
  relationships: [],
  canModifyLayer: false,
  canScaleSymbols: false,
  hasLabels: false,
  capabilities: 'Query',
  maxRecordCount: 2000,
  supportsStatistics: true,
  supportsAdvancedQueries: true,
  supportedQueryFormats: 'JSON',
  ownershipBasedAccessControlForFeatures: { allowOthersToQuery: true },
  supportsCoordinatesQuantization: false,
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
  uniqueIdField: { name: 'OBJECTID', isSystemMaintained: true }
}

const defaultLayer = {
  id: 0,
  name: 'Not Set',
  type: 'Feature Layer',
  description: 'This is a feature service powered by https://github.com/featureserver/featureserver',
  copyrightText: ' ',
  currentVersion: 10.51,
  parentLayer: null,
  subLayers: null,
  minScale: 0,
  maxScale: 0,
  drawingInfo: {
    renderer: {
      type: 'simple',
      symbol: {
        color: [45, 172, 128, 161],
        outline: {
          color: [190, 190, 190, 105],
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
  defaultVisibility: true,
  extent: {
    xmin: Infinity,
    ymin: Infinity,
    xmax: -1 * Infinity,
    ymax: -1 * Infinity,
    // xmin: -180,
    // ymin: -90,
    // xmax: 180,
    // ymax: 90,
    spatialReference: { wkid: 4326, latestWkid: 4326 }
  },
  hasAttachments: false,
  htmlPopupType: 'esriServerHTMLPopupTypeNone',
  displayField: 'OBJECTID',
  fullVersion: '10.5.1',
  geometryType: 'esriGeometryPoint',
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
  canModifyLayer: false,
  canScaleSymbols: false,
  hasLabels: false,
  capabilities: 'Query',
  maxRecordCount: 2000,
  supportsStatistics: true,
  supportsAdvancedQueries: true,
  supportedQueryFormats: 'JSON',
  ownershipBasedAccessControlForFeatures: { allowOthersToQuery: true },
  supportsCoordinatesQuantization: false,
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
  uniqueIdField: { name: 'OBJECTID', isSystemMaintained: true }
}

const tableWithObjectIdField = _.cloneDeep(defaultTable)
tableWithObjectIdField.fields = _.cloneDeep(defaultLayer.fields)

const layerWithDefaultWGS84Extent = _.cloneDeep(defaultLayer)
layerWithDefaultWGS84Extent.extent = {
  xmin: -180,
  ymin: -90,
  xmax: 180,
  ymax: 90,
  spatialReference: { wkid: 4326, latestWkid: 4326 }
}

describe('renderLayer', function () {
  it('undefined input returns default table', () => {
    const result = renderLayer()
    should(result).deepEqual(defaultTable)
  })

  it('empty object returns default table', () => {
    const result = renderLayer({})
    should(result).deepEqual(defaultTable)
  })

  it('defers to root-level geometryType', () => {
    const layer1 = { type: 'FeatureCollection', geometryType: 'Point', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: null }] }
    const result = renderLayer(layer1)
    should(result).deepEqual(defaultLayer)
  })

  it('uses metadata.geometryType when no root-level geometryType', () => {
    const layer1 = { type: 'FeatureCollection', metadata: { geometryType: 'Point' }, crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: null }] }
    const result = renderLayer(layer1)
    should(result).deepEqual(defaultLayer)
  })

  it('uses feature geometry-type if no other source', () => {
    const layer1 = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-180, -90] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [180, 90] } }] }
    const result = renderLayer(layer1)
    should(result).deepEqual(layerWithDefaultWGS84Extent)
  })

  it('Searches for first feature geometry-type if no other source', () => {
    const layer1 = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: null }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [180, 90] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-180, -90] } }] }
    const result = renderLayer(layer1)
    should(result).deepEqual(layerWithDefaultWGS84Extent)
  })

  it('returns undefined feature geometry-type not defined', () => {
    const layer1 = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: null }] }
    const result = renderLayer(layer1)

    should(result).deepEqual(tableWithObjectIdField)
  })

  it('supports defined set of input types', () => {
    const types = {
      Point: 'esriGeometryPoint',
      MultiPoint: 'esriGeometryMultipoint',
      LineString: 'esriGeometryPolyline',
      MultiLineString: 'esriGeometryPolyline',
      Polygon: 'esriGeometryPolygon',
      MultiPolygon: 'esriGeometryPolygon'
    }
    const layerWithGeom = _.cloneDeep(defaultLayer)

    Object.entries(types).forEach(([key, value]) => {
      const layer1 = { type: 'FeatureCollection', geometryType: key, crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: null }] }
      const result = renderLayer(layer1)

      layerWithGeom.geometryType = value
      layerWithGeom.drawingInfo.renderer = defaults.renderers[value]

      should(result).deepEqual(layerWithGeom)
    })
  })

  it('returns undefined for unsupported geometry types', () => {
    const layer1 = { type: 'FeatureCollection', geometryType: 'Other', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: null }] }
    const result = renderLayer(layer1)
    should(result).deepEqual(tableWithObjectIdField)
  })
})
