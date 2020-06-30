/* global describe, it */
const _ = require('lodash')
const provider = require('./fixtures/fake-provider')
const auth = require('./fixtures/fake-auth')()
const Koop = require('../')
const Geoservices = require('koop-output-geoservices')
const request = require('supertest')
const should = require('should') // eslint-disable-line
const plugins = require('./fixtures/fake-plugin')
const geoservicesFixtureRoutes = Geoservices.routes.reduce((acc, route) => {
  return acc + route.methods.length
}, 0)
const providerFixtureRoutes = provider.routes.reduce((acc, route) => {
  return acc + route.methods.length
}, 0)

describe('Index tests', function () {
  describe('Koop instantiation', function () {
    it('should instantiate Koop with config', function () {
      const koop = new Koop({ foo: 'bar' })
      koop.config.should.have.property('foo', 'bar')
    })
  })

  describe('Provider registration', function () {
    it('should register provider and add output and provider routes to router stack', function () {
      const koop = new Koop()
      koop.register(provider)
      const registeredProvider = koop.providers.find(provider => { return provider.namespace === 'test-provider' })
      registeredProvider.should.have.property('namespace', 'test-provider')
      // Check that the stack includes routes with the provider name in the path
      const providerRoutes = koop.server._router.stack
        .filter((layer) => { return _.has(layer, 'route.path') })
        .map(layer => { return _.get(layer, 'route.path') })
        .filter(path => path.includes(provider.name) || path.includes('/fake/:id'))
      providerRoutes.length.should.equal(geoservicesFixtureRoutes + providerFixtureRoutes)
    })

    it('should register provider-routes before plugin-routes', function () {
      const koop = new Koop()
      koop.register(provider)
      // Check that the stack index of the plugin routes are prior to index of provider routes
      const routePaths = koop.server._router.stack
        .filter((layer) => { return _.has(layer, 'route.path') })
        .map(layer => { return _.get(layer, 'route.path') })
      const pluginRouteIndex = routePaths.findIndex(path => path.includes('/test-provider/:id/FeatureServer'))
      const providerRouteIndex = routePaths.findIndex(path => path.includes('/fake/:id'))
      providerRouteIndex.should.be.below(pluginRouteIndex)
    })

    it('should register plugin-routes before provider-routes', function () {
      const koop = new Koop()
      koop.register(provider, { defaultToOutputRoutes: true })
      // Check that the stack index of the plugin routes are prior to index of provider routes
      const routePaths = koop.server._router.stack
        .filter((layer) => { return _.has(layer, 'route.path') })
        .map(layer => { return _.get(layer, 'route.path') })
      const pluginRouteIndex = routePaths.findIndex(path => path.includes('/test-provider/:id/FeatureServer'))
      const providerRouteIndex = routePaths.findIndex(path => path.includes('/fake/:id'))
      pluginRouteIndex.should.be.below(providerRouteIndex)
    })

    it('should register successfully a provider with a routePrefix', function () {
      const koop = new Koop()
      koop.register(provider, { routePrefix: 'path-to-route' })
      const registeredProvider = koop.providers.find(provider => { return provider.namespace === 'test-provider' })
      registeredProvider.options.should.have.property('routePrefix', 'path-to-route')
    })

    it('should register successfully and attach cache and options object to model', function () {
      const koop = new Koop()
      koop.register(provider, { foo: 'bar' })
      const registeredProvider = koop.providers.find(provider => { return provider.namespace === 'test-provider' })
      registeredProvider.model.should.have.property('cache')
      registeredProvider.model.should.have.property('options')
      registeredProvider.model.options.should.have.property('foo', 'bar')
    })

    it('should register successfully and attach optional custom cache to model', function () {
      const koop = new Koop()
      koop.register(provider, {
        cache: {
          retrieve: (key, query, callback) => {},
          upsert: (key, data, options) => {},
          customFunction: () => {}
        }
      })
      const registeredProvider = koop.providers.find(provider => { return provider.namespace === 'test-provider' })
      registeredProvider.model.should.have.property('cache')
      registeredProvider.model.cache.should.have.property('customFunction').and.be.a.Function()
    })

    it('should reject cache option missing an upsert method', function () {
      const koop = new Koop()
      try {
        koop.register(provider, {
          cache: {
            retrieve: (key, query, callback) => {}
          }
        })
      } catch (err) {
        err.should.have.property('message', 'Provider options ValidationError: "cache.upsert" is required')
      }
    })

    it('should reject cache option missing a retrieve method', function () {
      const koop = new Koop()
      try {
        koop.register(provider, {
          cache: {
            upsert: (key, data, options) => {}
          }
        })
      } catch (err) {
        err.should.have.property('message', 'Provider options ValidationError: "cache.retrieve" is required')
      }
    })

    it('should reject routePrefix option that is not a string', function () {
      const koop = new Koop()
      try {
        koop.register(provider, {
          routePrefix: {}
        })
        should.fail('should have thrown error')
      } catch (err) {
        err.should.have.property('message', 'Provider options ValidationError: "routePrefix" must be a string')
      }
    })

    it('should register successfully and attach optional "before" and "after" function to model', function () {
      const koop = new Koop()
      koop.register(provider, {
        before: (req, next) => {},
        after: (req, data, callback) => {}
      })
      const registeredProvider = koop.providers.find(provider => { return provider.namespace === 'test-provider' })
      registeredProvider.model.should.have.property('before').and.be.a.Function()
      registeredProvider.model.should.have.property('after').and.be.a.Function()
    })

    it('should reject optional "before" function that does not have correct arity', function () {
      const koop = new Koop()
      try {
        koop.register(provider, {
          before: () => {}
        })
      } catch (err) {
        err.should.have.property('message', 'Provider options ValidationError: "before" must have an arity of 2')
      }
    })

    it('should reject optional "after" function that does not have correct arity', function () {
      const koop = new Koop()
      try {
        koop.register(provider, {
          after: () => {}
        })
      } catch (err) {
        err.should.have.property('message', 'Provider options ValidationError: "after" must have an arity of 3')
      }
    })

    it('should successfully use options "name" in route', function () {
      const koop = new Koop()
      koop.register(provider, {
        name: 'options-name'
      })
      const registeredProvider = koop.providers.find(provider => { return provider.namespace === 'options-name' })
      registeredProvider.should.have.property('namespace', 'options-name')
      // Check that the stack includes routes with the provider name in the path
      const providerRoutes = koop.server._router.stack
        .filter((layer) => { return _.has(layer, 'route.path') })
        .map(layer => { return _.get(layer, 'route.path') })
        .filter(path => path.includes('options-name'))
      providerRoutes.length.should.equal(geoservicesFixtureRoutes)
    })
  })

  describe('can register a provider and apply a route prefix to all routes', function () {
    it('should not return 404 for prefixed custom route', function (done) {
      const koop = new Koop()
      koop.register(provider, { routePrefix: '/api/test' })
      request(koop.server)
        .get('/api/test/fake/1234')
        .then((res) => {
          res.should.have.property('error', false)
          done()
        })
        .catch(err => {
          (err === undefined).should.equal(true)
        })
    })

    it('should not return 404 for prefixed plugin route', function (done) {
      const koop = new Koop()
      koop.register(provider, { routePrefix: '/api/test' })
      request(koop.server)
        .get('/api/test/test-provider/foo/FeatureServer')
        .then((res) => {
          res.should.have.property('error', false)
          done()
        })
        .catch(err => {
          (err === undefined).should.equal(true)
        })
    })
  })
})

describe('Tests for registering auth plugin', function () {
  describe('can register an auth plugin', function () {
    it('should register successfully', function () {
      const koop = new Koop()
      koop.register(auth)
      koop._authModule.should.be.instanceOf(Object)
      koop._authModule.authenticate.should.be.instanceOf(Function)
      koop._authModule.authorize.should.be.instanceOf(Function)
      koop._authModule.authenticationSpecification.should.be.instanceOf(Function)
    })
  })

  describe('can register an auth plugin and apply methods to a provider', function () {
    it('should register successfully', function () {
      const koop = new Koop()
      koop.register(auth)
      koop.register(provider)
      koop.providers[1].model.should.have.property('authenticationSpecification').and.deepEqual({ provider: 'test-provider' })
      koop.providers[1].model.should.have.property('authenticate').and.be.a.Function()
      koop.providers[1].model.should.have.property('authorize').and.be.a.Function()
    })
  })

  describe('can register an auth plugin and selectively apply methods to a provider', function () {
    it('should register successfully', function () {
      const providerWithoutAuth = require('./fixtures/fake-provider-ii')
      const providerWithAuth = require('./fixtures/fake-provider')
      const auth = require('./fixtures/fake-auth')()
      const koop = new Koop()
      koop.register(providerWithoutAuth)
      koop.register(auth)
      koop.register(providerWithAuth)
      const registraionWithoutAuth = koop.providers.find(provider => { return provider.namespace === 'test-provider-ii' })
      const registraionWithAuth = koop.providers.find(provider => { return provider.namespace === 'test-provider' })
      registraionWithoutAuth.model.should.not.have.property('authenticationSpecification')
      registraionWithoutAuth.model.should.not.have.property('authenticate')
      registraionWithoutAuth.model.should.not.have.property('authorize')
      registraionWithAuth.model.should.have.property('authenticationSpecification')
      registraionWithAuth.model.should.have.property('authenticate')
      registraionWithAuth.model.should.have.property('authorize')
    })
  })
})

describe('Tests for registering plugins', function () {
  const koop = new Koop()
  describe('can register a plugin', function () {
    it('should register successfully', function () {
      koop.register(plugins.fakePlugin)
      koop.fakePlugin.should.be.instanceOf(Object)
      koop.fakePlugin.testFunc.should.be.instanceOf(Function)
      koop.fakePlugin.testFunc().should.equal(true)
    })

    it('should override the plugin name', function () {
      koop.register(plugins.renamedPlugin)
      koop['test-plugin'].should.be.instanceOf(Object)
      koop['test-plugin'].testFunc.should.be.instanceOf(Function)
      koop['test-plugin'].testFunc().should.equal(true)
    })

    it('should honor the legacy plugin_name property', function () {
      koop.register(plugins.legacyPlugin)
      koop.legacyPluginName.should.be.instanceOf(Object)
      koop.legacyPluginName.testFunc.should.be.instanceOf(Function)
      koop.legacyPluginName.testFunc().should.equal(true)
    })

    it('should use the pluginName property rather than the legacy plugin_name property', function () {
      koop.register(plugins.namePrecedencePlugin)
      koop.correctPluginName.should.be.instanceOf(Object)
    })

    it('should include plugin dependencies', function () {
      koop.register(plugins.dependencyPlugin)
      koop.dependencyPlugin.should.be.instanceOf(Object)
      koop.dependencyPlugin.deps.should.be.instanceOf(Object)
      koop.dependencyPlugin.deps.fakePlugin.should.be.instanceOf(Object)
      koop.dependencyPlugin.deps.legacyPluginName.should.be.instanceOf(Object)
      koop.dependencyPlugin.deps['test-plugin'].should.be.instanceOf(Object)
    })
  })
})
