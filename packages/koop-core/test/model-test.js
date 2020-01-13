/* eslint handle-callback-err: "off" */
const should = require('should') // eslint-disable-line
const sinon = require('sinon')
require('should-sinon')
const _ = require('lodash')

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

  describe('transformation functions', function () {
    it('before function should modify request object', () => {
      let beforeReq
      const beforeSpy = sinon.spy(function (req, next) {
        // capture args because the req gets mutated
        beforeReq = _.cloneDeep(req)
        req.query.hello = 'world'
        next()
      })
      const getDataSpy = sinon.spy(function (req, callback) {
        callback(null, { metadata: {} })
      })

      const model = new Model({
        cache: { retrieve: (key, query, callback) => { callback(new Error('no cache')) } }
      })
      model.before = beforeSpy
      model.getData = getDataSpy
      model.pull({ url: 'domain/test-provider', params: {}, query: {} }, function (err, data) {})
      beforeSpy.should.be.calledOnce()
      beforeSpy.firstCall.args.length.should.equal(2)
      beforeSpy.firstCall.args[0].should.be.an.Object()
      beforeReq.should.deepEqual({ url: 'domain/test-provider', params: {}, query: {} })
      beforeSpy.firstCall.args[1].should.be.a.Function()

      getDataSpy.should.be.calledOnce()
      getDataSpy.firstCall.args.length.should.equal(2)
      getDataSpy.firstCall.args[0].should.be.an.Object().and.deepEqual({ url: 'domain/test-provider', params: {}, query: { hello: 'world' } })
      getDataSpy.firstCall.args[1].should.be.a.Function()
    })

    it('after function should modify request and data object', () => {
      let getDataArgs
      let afterSpyArgs
      const getDataSpy = sinon.spy(function (req, callback) {
        // capture args because the req gets mutated
        getDataArgs = _.cloneDeep(arguments)
        callback(null, { metadata: {} })
      })
      const afterSpy = sinon.spy(function (req, data, callback) {
        // capture args because the req and data get mutated
        afterSpyArgs = _.cloneDeep(arguments)
        req.query.hello = 'world'
        data.metadata.food = 'bar'
        callback(null, data)
      })
      const pullCallbackSpy = sinon.spy(function (err, data) {})
      const model = new Model({
        cache: { retrieve: (key, query, callback) => { callback(new Error('no cache')) } }
      })
      model.getData = getDataSpy
      model.after = afterSpy
      model.pull({ url: 'domain/test-provider', params: {}, query: {} }, pullCallbackSpy)

      getDataSpy.should.be.calledOnce()
      getDataSpy.firstCall.args.length.should.equal(2)
      getDataArgs[0].should.deepEqual({ url: 'domain/test-provider', params: {}, query: {} })
      getDataSpy.firstCall.args[1].should.be.an.Function()

      afterSpy.should.be.calledOnce()
      afterSpy.firstCall.args.length.should.equal(3)
      afterSpy.firstCall.args[0].should.be.an.Object()
      afterSpyArgs[0].should.deepEqual({ url: 'domain/test-provider', params: {}, query: { } })
      afterSpy.firstCall.args[0].should.deepEqual({ url: 'domain/test-provider', params: {}, query: { hello: 'world' } }) // captures the expected change to the req argument in the after function
      afterSpyArgs[1].should.deepEqual({ metadata: {} })
      afterSpy.firstCall.args[2].should.be.an.Function()

      pullCallbackSpy.should.be.calledOnce()
      pullCallbackSpy.firstCall.args.length.should.equal(2)
      should.not.exist(pullCallbackSpy.firstCall.args[0])
      pullCallbackSpy.firstCall.args[1].should.be.an.Object().and.deepEqual({ metadata: { food: 'bar' } })
    })
  })
})
