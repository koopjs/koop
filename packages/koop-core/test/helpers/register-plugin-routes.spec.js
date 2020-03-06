const should = require('should') // eslint-disable-line
const sinon = require('sinon')
require('should-sinon')
const registerPluginRoutes = require('../../src/helpers/register-plugin-routes')

const mockController = {
  testHandler: () => {},
  testHandler2: () => {}
}

const mockProvider = {
  namespace: 'mock-provider',
  hosts: true,
  disableIdParam: false
}

const mockPluginRoutes = [
  { output: 'MockOutput', path: '/output-plugin', methods: ['get'], handler: 'testHandler' },
  { output: 'MockOutput', path: '/output-plugin', methods: ['post'], handler: 'testHandler2' }
]

describe('Tests for register-plugin-routes', function () {
  it('should register a plugin route, lowercased', () => {
    const mockServer = sinon.spy({
      get: () => {},
      post: () => {}
    })

    const pluginRouteMap = registerPluginRoutes({
      provider: mockProvider,
      controller: mockController,
      pluginRoutes: mockPluginRoutes,
      server: mockServer
    })

    mockServer.get.should.be.calledOnce()
    pluginRouteMap.should.deepEqual({
      MockOutput: {
        '/mock-provider/:host/:id/output-plugin': ['get', 'post']
      }
    })
  })

  it('should register a plugin route, uppercased', () => {
    const mockPluginRoutes = [
      { output: 'MockOutput', path: '/output-plugin', methods: ['GET'], handler: 'testHandler' },
      { output: 'MockOutput', path: '/output-plugin', methods: ['POST'], handler: 'testHandler2' }
    ]

    const mockServer = sinon.spy({
      get: () => {},
      post: () => {}
    })

    const pluginRouteMap = registerPluginRoutes({
      provider: mockProvider,
      controller: mockController,
      pluginRoutes: mockPluginRoutes,
      server: mockServer
    })

    mockServer.get.should.be.calledOnce()
    pluginRouteMap.should.deepEqual({
      MockOutput: {
        '/mock-provider/:host/:id/output-plugin': ['GET', 'POST']
      }
    })
  })

  it('should throw an error if handler not found on Koop controller', () => {
    const mockServer = sinon.spy({
      get: () => {}
    })

    try {
      registerPluginRoutes({
        provider: mockProvider,
        controller: {},
        pluginRoutes: mockPluginRoutes,
        server: mockServer
      })
      should.fail('Should have thrown')
    } catch (err) {
      mockServer.get.should.be.callCount(0)
      err.message.should.equal('Handler "testHandler" assigned to route "/output-plugin" by the "MockOutput" plugin is undefined for the Koop controller')
    }
  })
})
