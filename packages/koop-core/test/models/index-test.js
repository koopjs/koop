/* global describe, it */

var provider = require('../fixtures/fake-provider')
var koop = require('../../')()

describe('Index tests for registering providers', function () {
  describe('can register a provider', function () {
    it('when the provider has a pattern', function (done) {
      koop.register(provider)
      Object.keys(koop.services).length.should.equal(1)
      koop._router.stack.length.should.equal(16)
      done()
    })
  })
})
