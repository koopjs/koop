const should = require('should') // eslint-disable-line
const sinon = require('sinon')
const proxyquire = require('proxyquire')
require('should-sinon')
const modulePath = '../../src/helpers/register-dataset-provider'

describe('Tests for registerDatasetProvider', function () {
  it('register', function () {
    const datasetSpy = sinon.spy(function () { return 'model' })
    const datasetControllerSpy = sinon.spy(function () { return 'controller' })
    const registerProviderRoutesSpy = sinon.spy(function () { return 'provider-routes' })
    const registerPluginRoutesSpy = sinon.spy(function () { return 'plugin-routes' })
    const consolePrintingSpy = sinon.spy()

    const registerDatasetProvider = proxyquire(modulePath, {
      '../controllers/dataset': datasetControllerSpy,
      '../models/dataset': datasetSpy,
      './register-provider-routes': registerProviderRoutesSpy,
      './register-plugin-routes': registerPluginRoutesSpy,
      './console-printing': consolePrintingSpy
    })

    registerDatasetProvider({ koop: 'koop', datasetRoutes: [], pluginRoutes: 'plugin-routes' })
    datasetSpy.should.be.calledOnce(true)
    datasetControllerSpy.should.be.calledOnce(true)
    registerProviderRoutesSpy.should.be.calledOnce(true)
    registerPluginRoutesSpy.should.be.calledOnce(true)
    consolePrintingSpy.should.be.calledOnce(true)
  })
})
