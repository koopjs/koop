/* global describe, it */

var provider = require('./fixtures/fake-provider')
var auth = require('./fixtures/fake-auth')()
const Koop = require('../src/')
const koop = new Koop()
const should = require('should') // eslint-disable-line

describe('Index tests for registering providers', function () {
  describe('can register a provider', function () {
    it('should register successfully', function () {
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
      koop.register(auth)
      koop._auth_module.should.be.instanceOf(Object)
      koop._auth_module.authenticate.should.be.instanceOf(Function)
      koop._auth_module.authorize.should.be.instanceOf(Function)
      koop._auth_module.getAuthenticationSpecification.should.be.instanceOf(Function)
    })
  })
})
