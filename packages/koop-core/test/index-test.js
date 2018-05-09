/* global describe, it */

var provider = require('./fixtures/fake-provider')
const Koop = require('../src/')
const koop = new Koop()
const should = require('should') // eslint-disable-line

describe('Index tests for registering providers', function () {
  describe('can register a provider', function () {
    it('should register successfully', function () {
      koop.register(provider)
      const routeCount = (koop.server._router.stack.length)
      // TODO make this test less brittle
      routeCount.should.equal(58)
    })
  })
})
