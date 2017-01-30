/* global describe, it */

var provider = require('../fixtures/fake-provider')
const Koop = require('../../src/')
const koop = new Koop()

describe('Index tests for registering providers', function () {
  describe('can register a provider', function () {
    it('should register successfully', function () {
      koop.register(provider)
      koop.server._router.stack.length.should.equal(17)
    })
  })
})
