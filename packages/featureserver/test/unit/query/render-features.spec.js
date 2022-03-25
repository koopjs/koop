const should = require('should') // eslint-disable-line
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const computeFieldObjectSpy = sinon.spy(function () {
  return 'fields'
})

const normalizeSpatialReferenceSpy = sinon.spy(function () {
  return { wkid: 1234 }
})

const getCollectionCrsSpy = sinon.spy(function () {
  return 'crs'
})

const stub = {
  '../field': {
    computeFieldObject: computeFieldObjectSpy
  },
  '../helpers': {
    getCollectionCrs: getCollectionCrsSpy,
    normalizeSpatialReference: normalizeSpatialReferenceSpy
  }
}

const { renderFeaturesResponse } = proxyquire('../../../lib/query/render-features', stub)

describe('renderFeaturesResponse', () => {
  afterEach(function () {
    computeFieldObjectSpy.resetHistory()
    getCollectionCrsSpy.resetHistory()
    normalizeSpatialReferenceSpy.resetHistory()
  })

  it('should convert json with no metadata to Geoservices JSON', () => {
    const json = {
      type: 'FeatureCollection',
      features: [
        {
          attributes: {
            OBJECTID: 1138516379
          },
          geometry: {
            x: -104.9476,
            y: 39.9448
          }
        },
        {
          attributes: {
            OBJECTID: 1954528849
          },
          geometry: {
            x: -104.8424,
            y: 39.9137
          }
        }
      ]
    }

    const result = renderFeaturesResponse(json, { geometryType: 'esriGeometryPoint' })
    result.should.deepEqual({
      objectIdFieldName: 'OBJECTID',
      uniqueIdField: {
        name: 'OBJECTID',
        isSystemMaintained: true
      },
      geometryType: 'esriGeometryPoint',
      globalIdFieldName: '',
      hasZ: false,
      hasM: false,
      spatialReference: { wkid: 1234 },
      fields: 'fields',
      features: json.features,
      exceededTransferLimit: false
    })
    computeFieldObjectSpy.callCount.should.equal(1)
    computeFieldObjectSpy.firstCall.args.should.deepEqual([json, 'query', { geometryType: 'esriGeometryPoint' }])
    getCollectionCrsSpy.callCount.should.equal(1)
    getCollectionCrsSpy.firstCall.args.should.deepEqual([json])
    normalizeSpatialReferenceSpy.callCount.should.equal(1)
    normalizeSpatialReferenceSpy.firstCall.args.should.deepEqual(['crs'])
  })

  it('should convert json with metadata to Geoservices JSON', () => {
    const json = {
      metadata: {
        limitExceeded: true,
        transform: 'transform',
        idField: 'hello_world'
      },

      type: 'FeatureCollection',
      features: [
        {
          attributes: {
            hello_world: 1138516379
          },
          geometry: {
            x: -104.9476,
            y: 39.9448
          }
        },
        {
          attributes: {
            hello_world: 1954528849
          },
          geometry: {
            x: -104.8424,
            y: 39.9137
          }
        }
      ]
    }

    const result = renderFeaturesResponse(json, { geometryType: 'esriGeometryPoint' })
    result.should.deepEqual({
      objectIdFieldName: 'hello_world',
      uniqueIdField: {
        name: 'hello_world',
        isSystemMaintained: true
      },
      geometryType: 'esriGeometryPoint',
      globalIdFieldName: '',
      hasZ: false,
      hasM: false,
      spatialReference: { wkid: 1234 },
      fields: 'fields',
      features: json.features,
      exceededTransferLimit: true,
      transform: 'transform'
    })
    computeFieldObjectSpy.callCount.should.equal(1)
    computeFieldObjectSpy.firstCall.args.should.deepEqual([json, 'query', { geometryType: 'esriGeometryPoint' }])
    getCollectionCrsSpy.callCount.should.equal(1)
    getCollectionCrsSpy.firstCall.args.should.deepEqual([json])
    normalizeSpatialReferenceSpy.callCount.should.equal(1)
    normalizeSpatialReferenceSpy.firstCall.args.should.deepEqual(['crs'])
  })

  describe('Output spatial reference', () => {
    const normalizeSpatialReferenceSpy = sinon.spy(function (wkid) {
      return { wkid }
    })

    const getCollectionCrsSpy = sinon.spy(function () {
      return 'crs'
    })

    const stub = {
      '../field': {
        computeFieldObject: computeFieldObjectSpy
      },
      '../helpers': {
        getCollectionCrs: getCollectionCrsSpy,
        normalizeSpatialReference: normalizeSpatialReferenceSpy
      }
    }

    const { renderFeaturesResponse } = proxyquire('../../../lib/query/render-features', stub)

    const json = {
      type: 'FeatureCollection',
      features: [
        {
          attributes: {
            OBJECTID: 1138516379
          },
          geometry: {
            x: -104.9476,
            y: 39.9448
          }
        }
      ]
    }

    afterEach(function () {
      computeFieldObjectSpy.resetHistory()
      getCollectionCrsSpy.resetHistory()
      normalizeSpatialReferenceSpy.resetHistory()
    })

    it('should acquire from default', () => {
      const result = renderFeaturesResponse(json, { geometryType: 'esriGeometryPoint' })
      result.should.deepEqual({
        objectIdFieldName: 'OBJECTID',
        uniqueIdField: {
          name: 'OBJECTID',
          isSystemMaintained: true
        },
        geometryType: 'esriGeometryPoint',
        globalIdFieldName: '',
        hasZ: false,
        hasM: false,
        spatialReference: { wkid: 'crs' },
        fields: 'fields',
        features: json.features,
        exceededTransferLimit: false
      })
      getCollectionCrsSpy.callCount.should.equal(1)
      getCollectionCrsSpy.firstCall.args.should.deepEqual([json])
      normalizeSpatialReferenceSpy.callCount.should.equal(1)
      normalizeSpatialReferenceSpy.firstCall.args.should.deepEqual(['crs'])
    })

    it('should acquire from collection', () => {
      const result = renderFeaturesResponse(json, { geometryType: 'esriGeometryPoint' })
      result.should.deepEqual({
        objectIdFieldName: 'OBJECTID',
        uniqueIdField: {
          name: 'OBJECTID',
          isSystemMaintained: true
        },
        geometryType: 'esriGeometryPoint',
        globalIdFieldName: '',
        hasZ: false,
        hasM: false,
        spatialReference: { wkid: 'crs' },
        fields: 'fields',
        features: json.features,
        exceededTransferLimit: false
      })
      getCollectionCrsSpy.callCount.should.equal(1)
      getCollectionCrsSpy.firstCall.args.should.deepEqual([json])
      normalizeSpatialReferenceSpy.callCount.should.equal(1)
      normalizeSpatialReferenceSpy.firstCall.args.should.deepEqual(['crs'])
    })

    it('should acquire from sourceSR', () => {
      const result = renderFeaturesResponse(json, {
        geometryType: 'esriGeometryPoint',
        sourceSR: 9999
      })
      result.should.deepEqual({
        objectIdFieldName: 'OBJECTID',
        uniqueIdField: {
          name: 'OBJECTID',
          isSystemMaintained: true
        },
        geometryType: 'esriGeometryPoint',
        globalIdFieldName: '',
        hasZ: false,
        hasM: false,
        spatialReference: { wkid: 9999 },
        fields: 'fields',
        features: json.features,
        exceededTransferLimit: false
      })
      getCollectionCrsSpy.callCount.should.equal(0)
      normalizeSpatialReferenceSpy.callCount.should.equal(1)
      normalizeSpatialReferenceSpy.firstCall.args.should.deepEqual([9999])
    })

    it('should acquire from inputCrs', () => {
      const result = renderFeaturesResponse(json, {
        geometryType: 'esriGeometryPoint',
        sourceSR: 9999,
        inputCrs: 8888
      })
      result.should.deepEqual({
        objectIdFieldName: 'OBJECTID',
        uniqueIdField: {
          name: 'OBJECTID',
          isSystemMaintained: true
        },
        geometryType: 'esriGeometryPoint',
        globalIdFieldName: '',
        hasZ: false,
        hasM: false,
        spatialReference: { wkid: 8888 },
        fields: 'fields',
        features: json.features,
        exceededTransferLimit: false
      })
      getCollectionCrsSpy.callCount.should.equal(0)
      normalizeSpatialReferenceSpy.callCount.should.equal(1)
      normalizeSpatialReferenceSpy.firstCall.args.should.deepEqual([8888])
    })

    it('should acquire from outSR', () => {
      const result = renderFeaturesResponse(json, {
        geometryType: 'esriGeometryPoint',
        sourceSR: 9999,
        inputCrs: 8888,
        outSR: 7777
      })
      result.should.deepEqual({
        objectIdFieldName: 'OBJECTID',
        uniqueIdField: {
          name: 'OBJECTID',
          isSystemMaintained: true
        },
        geometryType: 'esriGeometryPoint',
        globalIdFieldName: '',
        hasZ: false,
        hasM: false,
        spatialReference: { wkid: 7777 },
        fields: 'fields',
        features: json.features,
        exceededTransferLimit: false
      })
      getCollectionCrsSpy.callCount.should.equal(0)
      normalizeSpatialReferenceSpy.callCount.should.equal(1)
      normalizeSpatialReferenceSpy.firstCall.args.should.deepEqual([7777])
    })

    it('should acquire from outputCrs', () => {
      const result = renderFeaturesResponse(json, {
        geometryType: 'esriGeometryPoint',
        sourceSR: 9999,
        inputCrs: 8888,
        outSR: 7777,
        outputCrs: 3857
      })
      result.should.deepEqual({
        objectIdFieldName: 'OBJECTID',
        uniqueIdField: {
          name: 'OBJECTID',
          isSystemMaintained: true
        },
        geometryType: 'esriGeometryPoint',
        globalIdFieldName: '',
        hasZ: false,
        hasM: false,
        spatialReference: {
          wkid: 3857
        },
        fields: 'fields',
        features: json.features,
        exceededTransferLimit: false
      })
      getCollectionCrsSpy.callCount.should.equal(0)
      normalizeSpatialReferenceSpy.callCount.should.equal(1)
      normalizeSpatialReferenceSpy.firstCall.args.should.deepEqual([3857])
    })
  })
})
