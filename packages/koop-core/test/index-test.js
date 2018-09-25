/* global describe, it */
const provider = require('./fixtures/fake-provider')
const auth = require('./fixtures/fake-auth')()
const Koop = require('../src/')
const should = require('should') // eslint-disable-line

describe('Index tests for registering providers', function () {
  describe('can register a provider', function () {
    it('should register successfully', function () {
      const koop = new Koop()
      koop.register(provider)
      const routeCount = (koop.server._router.stack.length)
      // TODO make this test less brittle
      routeCount.should.equal(84)
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
