/* global describe, it */
const _ = require('lodash')
const provider = require('./fixtures/fake-provider')
const auth = require('./fixtures/fake-auth')()
const Koop = require('../src/')
const request = require('supertest')
const should = require('should') // eslint-disable-line
const plugins = require('./fixtures/fake-plugin')

describe('Index tests for registering providers', function () {
  describe('use config argument', function () {
    it('should register successfully', function () {
      const koop = new Koop({ foo: 'bar' })
      koop.config.should.have.property('foo', 'bar')
    })
  })

  describe('can register a provider', function () {
    it('should register successfully', function () {
      const koop = new Koop()
      koop.register(provider)
      // Check that the stack includes routes with the provider name in the path
      const providerPath = koop.server._router.stack
        .filter((layer) => { return _.has(layer, 'route.path') })
        .map(layer => { return _.get(layer, 'route.path') })
        .find(path => path.includes(provider.name))
      providerPath.should.not.equal(undefined)
    })

    it('should register successfully and attach options object to Model instance', function () {
      const koop = new Koop()
      koop.register(provider, { name: 'value' })
      koop.controllers['test-provider'].model.should.have.property('options', { name: 'value' })
    })

    it('should register plugin-routes before provider-routes', function () {
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
        .catch(done)
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
        .catch(done)
    })
  })
})

describe('Tests for registering auth plugin', function () {
  describe('can register an auth plugin', function () {
    it('should register successfully', function () {
      const koop = new Koop()
      koop.register(auth)
      koop._auth_module.should.be.instanceOf(Object)
      koop._auth_module.authenticate.should.be.instanceOf(Function)
      koop._auth_module.authorize.should.be.instanceOf(Function)
      koop._auth_module.authenticationSpecification.should.be.instanceOf(Function)
    })
  })

  describe('can register an auth plugin and apply methods to a provider', function () {
    it('should register successfully', function () {
      const koop = new Koop()
      koop.register(auth)
      koop.register(provider)
      provider.Model.prototype.should.have.property('authenticationSpecification')
      provider.Model.prototype.should.have.property('authenticate')
      provider.Model.prototype.should.have.property('authorize')
    })
  })

  describe('can register an auth plugin and selectively apply methods to a provider', function () {
    it('should register successfully', function () {
      const providerWithAuth = require('./fixtures/fake-provider')
      const providerWithoutAuth = require('./fixtures/fake-provider-ii')
      const auth = require('./fixtures/fake-auth')()
      const koop = new Koop()
      koop.register(providerWithoutAuth)
      koop.register(auth)
      koop.register(providerWithAuth)
      providerWithoutAuth.Model.prototype.should.not.have.property('authenticationSpecification')
      providerWithoutAuth.Model.prototype.should.not.have.property('authenticate')
      providerWithoutAuth.Model.prototype.should.not.have.property('authorize')
      providerWithAuth.Model.prototype.should.have.property('authenticationSpecification')
      providerWithAuth.Model.prototype.should.have.property('authenticate')
      providerWithAuth.Model.prototype.should.have.property('authorize')
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
