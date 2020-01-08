/* eslint handle-callback-err: "off" */
const should = require('should') // eslint-disable-line
const sinon = require('sinon')
require('should-sinon')
const Model = require('../src/models')

// Mock getData function
Model.prototype.getData = function (req, callback) {
  callback(null, { hello: 'world' })
}

describe('Tests for models/index', function () {
  describe('createKey', function () {
    it('should create cache-key as provider name', () => {
      const retrieveSpy = sinon.spy(function (key, queryParams, callback) {
        callback(null, {})
      })
      const pullSpy = sinon.spy()

      // create a model with mocked cache "retrieve" function
      const model = new Model({
        cache: {
          retrieve: retrieveSpy
        }
      })

      model.pull({ url: 'domain/test-provider', params: {}, query: {} }, pullSpy)

      retrieveSpy.should.be.calledOnce()
      retrieveSpy.firstCall.args.length.should.equal(3)
      retrieveSpy.firstCall.args[0].should.equal('test-provider')
      retrieveSpy.firstCall.args[1].should.be.an.Object().and.be.empty()
      retrieveSpy.firstCall.args[2].should.be.an.Function()
      pullSpy.should.be.calledOnce()
      pullSpy.firstCall.args.length.should.equal(2)
      should.not.exist(pullSpy.firstCall.args[0])
      pullSpy.firstCall.args[1].should.be.an.Object().and.be.empty()
    })

    it('should create cache-key as provider name and concenated url params', () => {
      const retrieveSpy = sinon.spy(function (key, queryParams, callback) {
        callback(null, {})
      })
      const pullSpy = sinon.spy()

      // create a model with mocked cache "retrieve" function
      const model = new Model({
        cache: {
          retrieve: retrieveSpy
        }
      })
      model.pull({ url: 'domain/test-provider', params: { host: 'host-param', id: 'id-param', layer: 'layer-param' }, query: {} }, pullSpy)

      retrieveSpy.should.be.calledOnce()
      retrieveSpy.firstCall.args.length.should.equal(3)
      retrieveSpy.firstCall.args[0].should.equal('test-provider::host-param::id-param::layer-param')
      retrieveSpy.firstCall.args[1].should.be.an.Object().and.be.empty()
      retrieveSpy.firstCall.args[2].should.be.an.Function()
      pullSpy.should.be.calledOnce()
      pullSpy.firstCall.args.length.should.equal(2)
      should.not.exist(pullSpy.firstCall.args[0])
      pullSpy.firstCall.args[1].should.be.an.Object().and.be.empty()
    })

    it('should create cache-key from Model defined createKey function', () => {
      const retrieveSpy = sinon.spy(function (key, queryParams, callback) {
        callback(null, {})
      })
      const pullSpy = sinon.spy()

      // create a model with mocked cache "retrieve" function
      const model = new Model({
        cache: {
          retrieve: retrieveSpy
        }
      })
      model.createKey = function () { return 'custom-key' }
      model.pull({ url: 'domain/test-provider', query: {} }, pullSpy)
      retrieveSpy.should.be.calledOnce()
      retrieveSpy.firstCall.args.length.should.equal(3)
      retrieveSpy.firstCall.args[0].should.equal('custom-key')
      retrieveSpy.firstCall.args[1].should.be.an.Object().and.be.empty()
      retrieveSpy.firstCall.args[2].should.be.an.Function()
      pullSpy.should.be.calledOnce()
      pullSpy.firstCall.args.length.should.equal(2)
      should.not.exist(pullSpy.firstCall.args[0])
      pullSpy.firstCall.args[1].should.be.an.Object().and.be.empty()
    })
  })
})
