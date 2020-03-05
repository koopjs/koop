const should = require('should') // eslint-disable-line
const sinon = require('sinon')
require('should-sinon')
const bindAuthMethods = require('../../src/helpers/bind-auth-methods')

const mockProvider = {
  namespace: 'test-provider',
  Model: class Model {}
}

const mockAuthPlugin = {
  authenticate: () => {},
  authorize: () => {},
  authenticationSpecification: sinon.spy()
}

describe('Tests for bindAuthMethods', function () {
  it('bind auth methods to Model', function () {
    bindAuthMethods({ provider: mockProvider, auth: mockAuthPlugin })
    const authenticate = mockProvider.Model.prototype.authenticate
    const authorize = mockProvider.Model.prototype.authorize
    const authenticationSpecification = mockProvider.Model.prototype.authenticationSpecification
    authenticate.should.be.a.Function()
    authorize.should.be.a.Function()
    authenticationSpecification.should.deepEqual({ provider: 'test-provider' })
  })
})
