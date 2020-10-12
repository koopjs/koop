const should = require('should') // eslint-disable-line
const sinon = require('sinon')
const mockProviderPlugin = require('../fixtures/fake-provider')
const ProviderRoute = require('../../lib/provider-registration/provider-route')
const Provider = require('../../lib/provider-registration')

describe('Tests for ProviderRoute', function () {
  it('should create instance of ProviderRoute', function () {
    const serverSpy = sinon.spy({
      get: () => {}
    })
    const provider = new Provider({
      provider: mockProviderPlugin,
      koop: {
        outputs: [],
        cache: {
          retrieve: () => {},
          upsert: () => {}
        }
      }
    })
    const providerRoute = ProviderRoute.create({
      ...provider,
      ...provider.routes[0],
      server: serverSpy
    })
    providerRoute.should.be.instanceOf(ProviderRoute)
    providerRoute.should.have.property('controller')
    providerRoute.should.have.property('handler', 'get')
    providerRoute.should.have.property('path', '/fake/:id')
    providerRoute.should.have.property('registeredPath', '/fake/:id')
    providerRoute.should.have.property('methods', ['get'])
    serverSpy.get.calledOnceWith(providerRoute.registeredPath, providerRoute.routeHandler)
  })
})
