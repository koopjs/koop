const should = require('should') // eslint-disable-line
const sinon = require('sinon')
require('should-sinon')
const proxyquire = require('proxyquire')

describe('Route module unit tests', () => {
  describe('Validate geojson', () => {
    const hintSpy = sinon.spy(() => {
      return ['validatation error']
    })
    const chalkSpy = sinon.spy()

    const route = proxyquire('../../lib/route', {
      '@mapbox/geojsonhint': {
        hint: hintSpy
      },
      chalk: {
        yellow: chalkSpy
      },
      './info.js': {
        restInfo: () => {}
      },
      './helpers': {
        responseHandler: () => {}
      }
    })

    it('should validate geojson when KOOP_LOG_LEVEL === debug', () => {
      process.env.KOOP_LOG_LEVEL = 'debug'
      route({ params: {}, query: {}, url: '/rest/info' }, {}, { foo: 'geojson' })
      hintSpy.calledOnce.should.equal(true)
      hintSpy.firstCall.args.should.deepEqual([{ foo: 'geojson' }])
      chalkSpy.calledOnce.should.equal(true)
    })

    it('should not validate geojson when KOOP_LOG_LEVEL === debug and KOOP_DISABLE_GEOJSON_VALIDATION = true', () => {
      process.env.KOOP_LOG_LEVEL = 'debug'
      process.env.KOOP_DISABLE_GEOJSON_VALIDATION = 'true'
      route({ params: {}, query: {}, url: '/rest/info' }, {}, { foo: 'geojson' })
      hintSpy.notCalled.should.equal(true)
      hintSpy.resetHistory()
      chalkSpy.resetHistory()
    })

    afterEach(() => {
      hintSpy.resetHistory()
      chalkSpy.resetHistory()
      process.env.KOOP_LOG_LEVEL = undefined
      process.env.KOOP_DISABLE_GEOJSON_VALIDATION = undefined
    })
  })

  describe('Validate geojson metadata', () => {
    const restInfoSpy = sinon.spy()
    const responseHandlerSpy = sinon.spy()

    const route = proxyquire('../../lib/route', {
      './info.js': {
        restInfo: restInfoSpy
      },
      './helpers': {
        responseHandler: responseHandlerSpy
      }
    })

    it('should validate geojson metadata and find no error', () => {
      route({ params: {}, query: {}, url: '/rest/info' }, {}, { metadata: { maxRecordCount: 1 } })
      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args[2].should.equal(200)
    })

    it('should validate geojson metadata and find error', () => {
      route({ params: {}, query: {}, url: '/rest/info' }, {}, { metadata: { maxRecordCount: '1' } })
      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args[2].should.equal(500)
    })

    afterEach(() => {
      responseHandlerSpy.resetHistory()
    })
  })

  describe('Validate and coerce required query parameters', () => {
    const restInfoSpy = sinon.spy()
    const responseHandlerSpy = sinon.spy()

    const route = proxyquire('../../lib/route', {
      './info.js': {
        restInfo: restInfoSpy
      },
      './helpers': {
        responseHandler: responseHandlerSpy
      }
    })

    it('should validate query parameters', () => {
      route({
        params: {},
        query: { foo: 'bar', limit: 1, resultRecordCount: 1 },
        url: '/rest/info'
      }, {}, { metadata: { maxRecordCount: 1 } })
      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args[2].should.equal(200)
    })

    it('should validate and coerce query parameters', () => {
      route({
        params: {},
        query: { foo: 'bar', limit: '1', resultRecordCount: '1' },
        url: '/rest/info'
      }, {}, { metadata: { maxRecordCount: 1 } })
      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args[2].should.equal(200)
      responseHandlerSpy.firstCall.args[0].query.should.deepEqual({ foo: 'bar', limit: 1, resultRecordCount: 1 })
    })

    it('should provide default limit value', () => {
      route({
        params: {},
        query: { foo: 'bar' },
        url: '/rest/info'
      }, {}, {})
      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args[2].should.equal(200)
      responseHandlerSpy.firstCall.args[0].query.should.deepEqual({ foo: 'bar', limit: 2000 })
    })
    afterEach(() => {
      responseHandlerSpy.resetHistory()
    })
  })

  describe('/query route', () => {
    const querySpy = sinon.spy(function () {
      return {
        features: []
      }
    })

    const responseHandlerSpy = sinon.spy()

    const route = proxyquire('../../lib/route', {
      './query.js': querySpy,
      './helpers': {
        responseHandler: responseHandlerSpy
      }
    })

    it('should use query handler and return 200', () => {
      route({
        params: { method: 'query' },
        query: {},
        url: '/FeatureServer/0/query'
      }, {}, {})
      querySpy.calledOnce.should.equal(true)
      querySpy.firstCall.args.should.deepEqual([{
        metadata: { maxRecordCount: 2000 }
      }, {
        limit: 2000
      }])
      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args.should.deepEqual([{
        params: { method: 'query' },
        query: { limit: 2000 },
        url: '/FeatureServer/0/query'
      },
      {},
      200,
      { features: [] }
      ])
    })

    it('should use query handler and handle error', () => {
      const querySpy = sinon.spy(function () {
        throw new Error('Food bar')
      })

      const route = proxyquire('../../lib/route', {
        './query.js': querySpy,
        './helpers': {
          responseHandler: responseHandlerSpy
        }
      })

      route({
        params: { method: 'query' },
        query: {},
        url: '/FeatureServer/0/query'
      }, {}, {})
      querySpy.calledOnce.should.equal(true)
      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args.should.deepEqual([{
        params: { method: 'query' },
        query: { limit: 2000 },
        url: '/FeatureServer/0/query'
      },
      {},
      500,
      { error: 'Food bar' }
      ])
    })
    afterEach(() => {
      querySpy.resetHistory()
      responseHandlerSpy.resetHistory()
    })
  })

  describe('/rest/info route', () => {
    const restInfoSpy = sinon.spy(() => {
      return { restInfo: true }
    })

    const responseHandlerSpy = sinon.spy()

    const route = proxyquire('../../lib/route', {
      './info.js': {
        restInfo: restInfoSpy
      },
      './helpers': {
        responseHandler: responseHandlerSpy
      }
    })

    it('should use restInfo handler and return 200', () => {
      route({
        params: {},
        query: {},
        url: '/rest/info'
      }, {}, {})
      restInfoSpy.calledOnce.should.equal(true)
      restInfoSpy.firstCall.args.should.deepEqual([{
        metadata: { maxRecordCount: 2000 }
      }])

      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args.should.deepEqual([{
        params: {},
        query: { limit: 2000 },
        url: '/rest/info'
      },
      {},
      200,
      { restInfo: true }
      ])
    })

    it('should use restInfo handler and return 500', () => {
      const restInfoSpy = sinon.spy(() => {
        throw new Error('Fool bar')
      })
      const route = proxyquire('../../lib/route', {
        './info.js': {
          restInfo: restInfoSpy
        },
        './helpers': {
          responseHandler: responseHandlerSpy
        }
      })

      route({
        params: {},
        query: {},
        url: '/rest/info'
      }, {}, {})
      restInfoSpy.calledOnce.should.equal(true)
      restInfoSpy.firstCall.args.should.deepEqual([{
        metadata: { maxRecordCount: 2000 }
      }])

      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args.should.deepEqual([{
        params: {},
        query: { limit: 2000 },
        url: '/rest/info'
      },
      {},
      500,
      { error: 'Fool bar' }
      ])
    })

    afterEach(() => {
      restInfoSpy.resetHistory()
      responseHandlerSpy.resetHistory()
    })
  })

  describe('/FeatureServer route', () => {
    const serverInfoSpy = sinon.spy(() => {
      return { serverInfo: true }
    })

    const responseHandlerSpy = sinon.spy()

    const route = proxyquire('../../lib/route', {
      './info.js': {
        serverInfo: serverInfoSpy
      },
      './helpers': {
        responseHandler: responseHandlerSpy
      }
    })

    it('should use serverInfo handler and return 200', () => {
      route({
        params: {},
        query: {},
        url: '/rest/services/test/FeatureServer'
      }, {}, {})
      serverInfoSpy.calledOnce.should.equal(true)
      serverInfoSpy.firstCall.args.should.deepEqual([{
        metadata: { maxRecordCount: 2000 }
      }, {
        params: {},
        query: { limit: 2000 },
        url: '/rest/services/test/FeatureServer'
      }])

      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args.should.deepEqual([{
        params: {},
        query: { limit: 2000 },
        url: '/rest/services/test/FeatureServer'
      },
      {},
      200,
      { serverInfo: true }
      ])
    })

    it('should use serverInfo handler and return 500', () => {
      const serverInfoSpy = sinon.spy(() => {
        throw new Error('Fool bar')
      })
      const route = proxyquire('../../lib/route', {
        './info.js': {
          serverInfo: serverInfoSpy
        },
        './helpers': {
          responseHandler: responseHandlerSpy
        }
      })

      route({
        params: {},
        query: {},
        url: '/rest/services/test/FeatureServer'
      }, {}, {})
      serverInfoSpy.calledOnce.should.equal(true)
      serverInfoSpy.firstCall.args.should.deepEqual([{
        metadata: { maxRecordCount: 2000 }
      }, {
        params: {},
        query: { limit: 2000 },
        url: '/rest/services/test/FeatureServer'
      }])

      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args.should.deepEqual([{
        params: {},
        query: { limit: 2000 },
        url: '/rest/services/test/FeatureServer'
      },
      {},
      500,
      { error: 'Fool bar' }
      ])
    })

    afterEach(() => {
      serverInfoSpy.resetHistory()
      responseHandlerSpy.resetHistory()
    })
  })

  describe('/FeatureServer/layers route', () => {
    const layersInfoSpy = sinon.spy(() => {
      return { layersInfo: true }
    })

    const responseHandlerSpy = sinon.spy()

    const route = proxyquire('../../lib/route', {
      './info.js': {
        layersInfo: layersInfoSpy
      },
      './helpers': {
        responseHandler: responseHandlerSpy
      }
    })

    it('should use layersInfo handler and return 200', () => {
      route({
        params: {},
        query: {},
        url: '/rest/services/test/FeatureServer/layers'
      }, {}, {})
      layersInfoSpy.calledOnce.should.equal(true)
      layersInfoSpy.firstCall.args.should.deepEqual([{
        metadata: { maxRecordCount: 2000 }
      }, {
        limit: 2000
      }])

      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args.should.deepEqual([{
        params: {},
        query: { limit: 2000 },
        url: '/rest/services/test/FeatureServer/layers'
      },
      {},
      200,
      { layersInfo: true }
      ])
    })

    it('should use layersInfo handler and return 500', () => {
      const layersInfoSpy = sinon.spy(() => {
        throw new Error('Fool bar')
      })
      const route = proxyquire('../../lib/route', {
        './info.js': {
          layersInfo: layersInfoSpy
        },
        './helpers': {
          responseHandler: responseHandlerSpy
        }
      })

      route({
        params: {},
        query: {},
        url: '/rest/services/test/FeatureServer/layers'
      }, {}, {})
      layersInfoSpy.calledOnce.should.equal(true)
      layersInfoSpy.firstCall.args.should.deepEqual([{
        metadata: { maxRecordCount: 2000 }
      }, {
        limit: 2000
      }])

      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args.should.deepEqual([{
        params: {},
        query: { limit: 2000 },
        url: '/rest/services/test/FeatureServer/layers'
      },
      {},
      500,
      { error: 'Fool bar' }
      ])
    })

    afterEach(() => {
      layersInfoSpy.resetHistory()
      responseHandlerSpy.resetHistory()
    })
  })

  describe('/FeatureServer/0 route', () => {
    const layerInfoSpy = sinon.spy(() => {
      return { layerInfo: true }
    })

    const responseHandlerSpy = sinon.spy()

    const route = proxyquire('../../lib/route', {
      './info.js': {
        layerInfo: layerInfoSpy
      },
      './helpers': {
        responseHandler: responseHandlerSpy
      }
    })

    it('should use layerInfo handler and return 200', () => {
      route({
        params: {},
        query: {},
        url: '/rest/services/test/FeatureServer/0'
      }, {}, {})
      layerInfoSpy.calledOnce.should.equal(true)
      layerInfoSpy.firstCall.args.should.deepEqual([{
        metadata: { maxRecordCount: 2000 }
      }, {
        params: {},
        query: { limit: 2000 },
        url: '/rest/services/test/FeatureServer/0'
      }])

      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args.should.deepEqual([{
        params: {},
        query: { limit: 2000 },
        url: '/rest/services/test/FeatureServer/0'
      },
      {},
      200,
      { layerInfo: true }
      ])
    })

    it('should use layerInfo handler and return 500', () => {
      const layerInfoSpy = sinon.spy(() => {
        throw new Error('Fool bar')
      })
      const route = proxyquire('../../lib/route', {
        './info.js': {
          layerInfo: layerInfoSpy
        },
        './helpers': {
          responseHandler: responseHandlerSpy
        }
      })

      route({
        params: {},
        query: {},
        url: '/rest/services/test/FeatureServer/0'
      }, {}, {})
      layerInfoSpy.calledOnce.should.equal(true)
      layerInfoSpy.firstCall.args.should.deepEqual([{
        metadata: { maxRecordCount: 2000 }
      }, {
        params: {},
        query: { limit: 2000 },
        url: '/rest/services/test/FeatureServer/0'
      }])

      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args.should.deepEqual([{
        params: {},
        query: { limit: 2000 },
        url: '/rest/services/test/FeatureServer/0'
      },
      {},
      500,
      { error: 'Fool bar' }
      ])
    })

    afterEach(() => {
      layerInfoSpy.resetHistory()
      responseHandlerSpy.resetHistory()
    })
  })

  describe('unknown route', () => {
    it('should handle unknown route', () => {
      const responseHandlerSpy = sinon.spy()
      const route = proxyquire('../../lib/route', {
        './helpers': {
          responseHandler: responseHandlerSpy
        }
      })

      route({
        params: {},
        query: {},
        url: '/hello/world'
      }, {}, {})
      responseHandlerSpy.calledOnce.should.equal(true)
      responseHandlerSpy.firstCall.args.should.deepEqual([{
        params: {},
        query: { limit: 2000 },
        url: '/hello/world'
      },
      {},
      404,
      { error: 'Not Found' }
      ])
    })
  })
})
