const should = require('should');
const sinon = require('sinon');
const { promisify } = require('util');
require('should-sinon');
const _ = require('lodash');
const { Readable } = require('stream');

const createModel = require('./create-model');
const koopMock = {
  test: 'value',
  cache: {
    retrieve () {},
    insert () {}
  },
  log: {
    debug: (sinon.spy()),
    info: () => {}
  }
};

class MockModel {
  constructor (koop, options) {
    this.options = options;
  }

  getData (req, callback) {
    callback(null, {
      type: 'FeatureCollection',
      features: []
    });
  }

  getLayer (req, callback) {
    callback(null, {
      layer: 'foo'
    });
  }

  getCatalog (req, callback) {
    callback(null, {
      catalog: 'foo'
    });
  }
}

describe('Tests for create-model', function () {
  beforeEach(() => {
    koopMock.log.debug.resetHistory();
  });

  describe('model constructor', () => {
    it('should receive expected arguments', () => {
      class Model extends MockModel {
        constructor(koop, options) {
          super(koop, options);
          this.koop = koop;
          this.options = options;
        }
      }
      const model = createModel({ ProviderModel: Model, koop: koopMock }, {
        foo: 'bar'
      });
      model.koop.should.deepEqual(koopMock);
      model.options.should.deepEqual({ foo: 'bar' });
    });

    it('should use model defined cache', () => {
      class Model extends MockModel {
        constructor(koop, options) {
          super(koop, options);
          this.koop = koop;
          this.options = options;
          this.cache = { retrieve: _.noop, insert: _.noop };
        }
      }
      const model = createModel({ ProviderModel: Model, koop: koopMock }, {
        foo: 'bar'
      });
      model.koop.should.deepEqual(koopMock);
      model.options.should.deepEqual({ foo: 'bar' });
    });
  });

  describe('model pull method', () => {
    it('should not find in cache, should not add to cache', async () => {
      const beforeSpy = sinon.spy((req, beforeCallback) => {
        beforeCallback();
      });

      const afterSpy = sinon.spy(function (req, data, callback) {
        callback(null, data);
      });

      const cacheRetrieveSpy = sinon.spy((key, query, callback) => {
        callback(null);
      });

      const cacheinsertSpy = sinon.spy(() => {});

      const getDataSpy = sinon.spy(function (req, callback) {
        callback(null, { metadata: {} });
      });

      class Model extends MockModel {}
      Model.prototype.getData = getDataSpy;
      
      const model = createModel({ ProviderModel: Model, koop: koopMock }, {
        cache: {
          retrieve: cacheRetrieveSpy,
          insert: cacheinsertSpy
        },
        before: beforeSpy,
        after: afterSpy
      });

      const pullData = promisify(model.pull).bind(model);

      const data = await pullData({ url: 'domain/test-provider', params: {}, query: {} });
      data.should.deepEqual({ metadata: {} });
      cacheRetrieveSpy.calledOnce.should.equal(true);
      beforeSpy.called.should.equal(true);
      getDataSpy.called.should.equal(true);
      afterSpy.called.should.equal(true);
      cacheinsertSpy.notCalled.should.equal(true);

    });

    it('should not find in cache, should add to cache due to data\'s ttl', async () => {
      const beforeSpy = sinon.spy((req, beforeCallback) => {
        beforeCallback();
      });

      const afterSpy = sinon.spy(function (req, data, callback) {
        callback(null, data);
      });

      const cacheRetrieveSpy = sinon.spy((key, query, callback) => {
        callback(null);
      });

      const cacheinsertSpy = sinon.spy(() => {});

      const getDataSpy = sinon.spy(function (req, callback) {
        callback(null, { metadata: {}, ttl: 5 });
      });

      class Model extends MockModel {}
      Model.prototype.getData = getDataSpy;
      const model = createModel({ ProviderModel: Model, koop: koopMock }, {
        cache: {
          retrieve: cacheRetrieveSpy,
          insert: cacheinsertSpy
        },
        before: beforeSpy,
        after: afterSpy
      });
      const pullData = promisify(model.pull).bind(model);
      const data = await pullData({ url: 'domain/test-provider', params: {}, query: {} });
      data.should.deepEqual({ metadata: {}, ttl: 5 });
      cacheRetrieveSpy.calledOnce.should.equal(true);
      beforeSpy.calledOnce.should.equal(true);
      getDataSpy.calledOnce.should.equal(true);
      afterSpy.calledOnce.should.equal(true);
      cacheinsertSpy.calledOnce.should.equal(true);
    });

    it('should not find in cache, should add to cache due to providers\'s ttl', async () => {
      const beforeSpy = sinon.spy((req, beforeCallback) => {
        beforeCallback();
      });

      const afterSpy = sinon.spy(function (req, data, callback) {
        callback(null, data);
      });

      const cacheRetrieveSpy = sinon.spy((key, query, callback) => {
        callback(null);
      });

      const cacheinsertSpy = sinon.spy(() => {});

      const getDataSpy = sinon.spy(function (req, callback) {
        callback(null, { metadata: {}});
      });

      class Model extends MockModel {}
      Model.prototype.getData = getDataSpy;
      const model = createModel({ ProviderModel: Model, koop: koopMock }, {
        cache: {
          retrieve: cacheRetrieveSpy,
          insert: cacheinsertSpy
        },
        before: beforeSpy,
        after: afterSpy,
        cacheTtl: 10
      });
      const pullData = promisify(model.pull).bind(model);
      const data = await pullData({ url: 'domain/test-provider', params: {}, query: {} });
      data.should.deepEqual({ metadata: {} });
      cacheRetrieveSpy.calledOnce.should.equal(true);
      beforeSpy.calledOnce.should.equal(true);
      getDataSpy.calledOnce.should.equal(true);
      afterSpy.calledOnce.should.equal(true);
      cacheinsertSpy.calledOnce.should.equal(true);
    });

    it('should pull from cache and use _cache info', async () => {
      const beforeSpy = sinon.spy((req, beforeCallback) => {
        beforeCallback();
      });

      const afterSpy = sinon.spy(function (req, data, callback) {
        callback(null, data);
      });

      const now = Date.now();
      const cacheRetrieveSpy = sinon.spy((key, query, callback) => {
        callback(null, { _cache: {
          updated: 0,
          expires: now + 86400000
        },
        features: ['foo']
        });
      });

      const cacheinsertSpy = sinon.spy(() => {});

      const getDataSpy = sinon.spy(function (req, callback) {
        callback(null, { ttl: 10, metadata: {} });
      });

      class Model extends MockModel {}
      Model.prototype.getData = getDataSpy;
      const model = createModel({ ProviderModel: Model, koop: koopMock }, {
        cache: {
          retrieve: cacheRetrieveSpy,
          insert: cacheinsertSpy
        },
        before: beforeSpy,
        after: afterSpy
      });

      const pullData = promisify(model.pull).bind(model);

      const data = await pullData({ url: 'domain/test-provider', params: {}, query: {} });
      data.should.deepEqual({ _cache: {
        updated: 0,
        expires: now + 86400000
      },
      features: ['foo']
      });
      cacheRetrieveSpy.calledOnce.should.equal(true);
      beforeSpy.notCalled.should.equal(true);
      getDataSpy.notCalled.should.equal(true);
      afterSpy.notCalled.should.equal(true);
      cacheinsertSpy.notCalled.should.equal(true);

    });

    it('should pull from cache and use metadata info', async () => {
      const beforeSpy = sinon.spy((req, beforeCallback) => {
        beforeCallback();
      });

      const afterSpy = sinon.spy(function (req, data, callback) {
        callback(null, data);
      });

      const now = Date.now();
      const cacheRetrieveSpy = sinon.spy((key, query, callback) => {
        callback(null, { metadata: {
          updated: 0,
          expires: now + 86400000
        },
        features: ['foo']
        });
      });

      const cacheinsertSpy = sinon.spy(() => {});

      const getDataSpy = sinon.spy(function (req, callback) {
        callback(null, { ttl: 10, metadata: {} });
      });

      class Model extends MockModel {}
      Model.prototype.getData = getDataSpy;
      const model = createModel({ ProviderModel: Model, koop: koopMock }, {
        cache: {
          retrieve: cacheRetrieveSpy,
          insert: cacheinsertSpy
        },
        before: beforeSpy,
        after: afterSpy
      });

      const pullData = promisify(model.pull).bind(model);

      const data = await pullData({ url: 'domain/test-provider', params: {}, query: {} });
      data.should.deepEqual({ metadata: {
        updated: 0,
        expires: now + 86400000
      },
      features: ['foo']
      });
      cacheRetrieveSpy.calledOnce.should.equal(true);
      beforeSpy.notCalled.should.equal(true);
      getDataSpy.notCalled.should.equal(true);
      afterSpy.notCalled.should.equal(true);
      cacheinsertSpy.notCalled.should.equal(true);
    });

    it('should send error in callback', async () => {
      const beforeSpy = sinon.spy((req, beforeCallback) => {
        beforeCallback();
      });

      const afterSpy = sinon.spy(function (req, data, callback) {
        callback(null, data);
      });

      const cacheRetrieveSpy = sinon.spy((key, query, callback) => {
        callback(null);
      });

      const cacheinsertSpy = sinon.spy(() => {});

      const getDataSpy = sinon.spy(function (req, callback) {
        callback(new Error('err in getData'));
      });

      class Model extends MockModel {}
      Model.prototype.getData = getDataSpy;
      const model = createModel({ ProviderModel: Model, koop: koopMock }, {
        cache: {
          retrieve: cacheRetrieveSpy,
          insert: cacheinsertSpy
        },
        before: beforeSpy,
        after: afterSpy
      });
      const pullData = promisify(model.pull).bind(model);

      try {
        await pullData({ url: 'domain/test-provider', params: {}, query: {} });
        should.fail();
      } catch (err) {
        err.message.should.equal('err in getData');
      }
    });
  });

  describe('createKey', function () {
    it('should create cache-key from Model defined createKey function', async () => {
      const retrieveSpy = sinon.spy(function (key, queryParams, callback) {
        callback(null, {});
      });
      const pullSpy = sinon.spy();

      class Model extends MockModel {
        createKey () { return 'custom-key'; }
      }
      // create a model with mocked cache "retrieve" function
      const model = createModel({ ProviderModel: Model, koop: koopMock }, {
        cache: {
          retrieve: retrieveSpy,
          insert: () => {}
        }
      });
      await model.pull({ url: 'domain/test-provider', query: {} }, pullSpy);
      retrieveSpy.should.be.calledOnce();
      retrieveSpy.firstCall.args.length.should.equal(3);
      retrieveSpy.firstCall.args[0].should.equal('custom-key');
      retrieveSpy.firstCall.args[1].should.be.an.Object().and.be.empty();
      retrieveSpy.firstCall.args[2].should.be.an.Function();
      pullSpy.should.be.calledOnce();
      pullSpy.firstCall.args.length.should.equal(2);
      should.not.exist(pullSpy.firstCall.args[0]);
      pullSpy.firstCall.args[1].should.be.an.Object().and.be.empty();
    });
  });

  describe('auth methods', () => {
    const koopMock = {
      test: 'value',
      _authModule: {
        authenticate: () => {},
        authorize: () => {},
        authenticationSpecification: sinon.spy()
      },
      log: {
        debug: () => {},
        info: () => {}
      }
    };

    it('should attach auth methods when auth plugin is registered with Koop', () => {
      const model = createModel({ ProviderModel: MockModel, namespace: 'test-provider', koop: koopMock }, {
        cache: {
          retrieve: () => {},
          insert: () => {}
        }
      });
      model.should.have.property('authorize').and.be.a.Function();
      model.should.have.property('authenticate').and.be.a.Function();
      model.should.have.property('authenticationSpecification').and.deepEqual({ provider: 'test-provider' });
    });
  });

  describe('transformation functions', function () {
    it('before function should modify request object', async () => {
      let beforeReq;
      const beforeSpy = sinon.spy((req, beforeCallback) => {
        // capture args because the req gets mutated
        beforeReq = _.cloneDeep(req);
        req.query.hello = 'world';
        beforeCallback();
      });

      const getDataSpy = sinon.spy(function (req, callback) {
        callback(null, { metadata: {} });
      });
      class Model extends MockModel {}
      Model.prototype.getData = getDataSpy;

      const model = createModel({ ProviderModel: Model, koop: koopMock }, {
        cache: {
          retrieve: (key, query, callback) => {
            callback(new Error('no cache'));
          },
          insert: () => {}
        },
        before: beforeSpy
      });

      await model.pull({ url: 'domain/test-provider', params: {}, query: {} }, function () {});
      beforeSpy.should.be.calledOnce();
      beforeSpy.firstCall.args.length.should.equal(2);
      beforeSpy.firstCall.args[0].should.be.an.Object();
      beforeReq.should.deepEqual({ url: 'domain/test-provider', params: {}, query: {} });
      beforeSpy.firstCall.args[1].should.be.a.Function();

      getDataSpy.should.be.calledOnce();
      getDataSpy.firstCall.args.length.should.equal(2);
      getDataSpy.firstCall.args[0].should.be.an.Object().and.deepEqual({ url: 'domain/test-provider', params: {}, query: { hello: 'world' } });
      getDataSpy.firstCall.args[1].should.be.a.Function();
    });

    it('after function should modify request and data object', async () => {
      let getDataArgs;
      let afterSpyArgs;
      const getDataSpy = sinon.spy(function (req, callback) {
        // capture args because the req gets mutated
        getDataArgs = _.cloneDeep(arguments);
        callback(null, { metadata: {} });
      });

      class Model extends MockModel {}
      Model.prototype.getData = getDataSpy;

      const afterSpy = sinon.spy(function (req, data, callback) {
        // capture args because the req and data get mutated
        afterSpyArgs = _.cloneDeep(arguments);
        req.query.hello = 'world';
        data.metadata.food = 'bar';
        callback(null, data);
      });
      const pullCallbackSpy = sinon.spy(function () {});
      const model = createModel({ ProviderModel: Model, koop: koopMock }, {
        cache: {
          retrieve: (key, query, callback) => {
            callback(null);
          },
          insert: () => {}
        },
        after: afterSpy
      });

      await model.pull({ url: 'domain/test-provider', params: {}, query: {} }, pullCallbackSpy);
      getDataSpy.should.be.calledOnce();
      getDataSpy.firstCall.args.length.should.equal(2);
      getDataArgs[0].should.deepEqual({ url: 'domain/test-provider', params: {}, query: {} });
      getDataSpy.firstCall.args[1].should.be.an.Function();

      afterSpy.should.be.calledOnce();
      afterSpy.firstCall.args.length.should.equal(3);
      afterSpy.firstCall.args[0].should.be.an.Object();
      afterSpyArgs[0].should.deepEqual({ url: 'domain/test-provider', params: {}, query: { } });
      afterSpy.firstCall.args[0].should.deepEqual({ url: 'domain/test-provider', params: {}, query: { hello: 'world' } }); // captures the expected change to the req argument in the after function
      afterSpyArgs[1].should.deepEqual({ metadata: {} });
      afterSpy.firstCall.args[2].should.be.an.Function();

      pullCallbackSpy.should.be.calledOnce();
      pullCallbackSpy.firstCall.args.length.should.equal(2);
      should.not.exist(pullCallbackSpy.firstCall.args[0]);
      pullCallbackSpy.firstCall.args[1].should.be.an.Object().and.deepEqual({ metadata: { food: 'bar' } });
    });
  });

  describe('model pullLayer method', function () {
    afterEach(function () {
      // reset the getLayer() function to default
      createModel.prototype.getLayer = undefined;
      createModel.prototype.createKey = undefined;
    });

    it('should throw an error if the getLayer() function is not implemented', async () => {

      class Model extends MockModel {}
      Model.prototype.getLayer = undefined;

      // create a model with mocked cache "retrieve" function
      const model = createModel({ ProviderModel: Model, koop: koopMock, namespace: 'test-provider' }, {});

      const pullLayer = promisify(model.pullLayer).bind(model);

      try {
        await pullLayer({ url: 'domain/test-provider', params: {}, query: {} });
        should.fail('should have thrown');
      } catch (err) {
        err.message.should.equal('getLayer() method is not implemented in the test-provider provider.');
      }
    });

    it('logs error from cache retrieve', async function () {
      const retrieveSpy = sinon.spy(function (key, queryParams, callback) {
        callback(new Error('cache error'));
      });

      // create a model with mocked cache "retrieve" function
      const model = createModel({ ProviderModel: MockModel, koop: koopMock }, {
        cache: {
          retrieve: retrieveSpy,
          insert: () => {}
        }
      });

      const pullLayer = promisify(model.pullLayer).bind(model);

      const data = await pullLayer({ url: 'domain/test-provider', params: {}, query: {} });
      data.should.deepEqual({
        layer: 'foo'
      });
      retrieveSpy.should.be.calledOnce();
      koopMock.log.debug.should.be.calledOnce();
    });

    it('should try to fetch from cache', async function () {
      const retrieveSpy = sinon.spy(function (key, queryParams, callback) {
        callback(null, {
          layer: 'cached'
        });
      });

      const getLayerSpy = sinon.spy(function (req, callback) {
        callback(null, {});
      });

      createModel.prototype.getLayer = getLayerSpy;

      // create a model with mocked cache "retrieve" function
      const model = createModel({ ProviderModel: MockModel, koop: koopMock }, {
        cache: {
          retrieve: retrieveSpy,
          insert: () => {}
        }
      });

      const pullLayer = promisify(model.pullLayer).bind(model);

      const data = await pullLayer({ url: 'domain/test-provider', params: {}, query: {} });
      data.should.deepEqual({
        layer: 'cached'
      });
      retrieveSpy.should.be.calledOnce();
      getLayerSpy.should.not.be.called();
    });

    it('should call the getLayer() function if cache misses', async function () {
      const retrieveSpy = sinon.spy(function (key, queryParams, callback) {
        callback(new Error('not found'));
      });

      // create a model with mocked cache "retrieve" function
      const model = createModel({ ProviderModel: MockModel, koop: koopMock }, {
        cache: {
          retrieve: retrieveSpy,
          insert: () => {}
        }
      });


      const pullLayer = promisify(model.pullLayer).bind(model);

      const data = await pullLayer({ url: 'domain/test-provider', params: {}, query: {} });
      data.should.deepEqual({
        layer: 'foo'
      });
      retrieveSpy.should.be.calledOnce();
    });

    it('should call the getLayer() function if cache misses, inserts to cache', async function () {
      const retrieveSpy = sinon.spy(function (key, queryParams, callback) {
        callback(null);
      });

      const insertSpy = sinon.spy();
      
      const getLayerSpy = sinon.spy(function (req, callback) {
        callback(null, { layer: 'foo', ttl: 10 });
      });

      MockModel.prototype.getLayer = getLayerSpy;

      // create a model with mocked cache "retrieve" function
      const model = createModel({ ProviderModel: MockModel, koop: koopMock }, {
        cache: {
          retrieve: retrieveSpy,
          insert: insertSpy
        }
      });

      model.getLayer = getLayerSpy;

      const pullLayer = promisify(model.pullLayer).bind(model);

      const data = await pullLayer({ url: 'domain/test-provider', params: {}, query: {} });
      data.should.deepEqual({
        layer: 'foo',
        ttl: 10
      });
      retrieveSpy.should.be.calledOnce();
      insertSpy.should.be.calledOnce();
    });

    it('should send error in callback', async () => {
      const beforeSpy = sinon.spy((req, beforeCallback) => {
        beforeCallback();
      });

      const afterSpy = sinon.spy(function (req, data, callback) {
        callback(null, data);
      });

      const cacheRetrieveSpy = sinon.spy((key, query, callback) => {
        callback(null);
      });

      const cacheinsertSpy = sinon.spy(() => {});

      const getLayerSpy = sinon.spy(function (req, callback) {
        callback(new Error('err in getLayer'));
      });

      class Model extends MockModel {}
      Model.prototype.getLayer = getLayerSpy;
      const model = createModel({ ProviderModel: Model, koop: koopMock }, {
        cache: {
          retrieve: cacheRetrieveSpy,
          insert: cacheinsertSpy
        },
        before: beforeSpy,
        after: afterSpy
      });
      const pullLayer = promisify(model.pullLayer).bind(model);

      try {
        await pullLayer({ url: 'domain/test-provider', params: {}, query: {} });
        should.fail();
      } catch (err) {
        err.message.should.equal('err in getLayer');
      }
    });
  });

  describe('model pullCatalog method', function () {
    afterEach(function () {
      // reset the getCatalog() function to default
      createModel.prototype.getCatalog = undefined;
    });

    it('should throw an error if the getCatalog() function is not implemented', async () => {

      class Model extends MockModel {}
      Model.prototype.getCatalog = undefined;

      // create a model with mocked cache "retrieve" function
      const model = createModel({ ProviderModel: Model, koop: koopMock, namespace: 'test-provider' }, {});

      const pullCatalog = promisify(model.pullCatalog).bind(model);

      try {
        await pullCatalog({ url: 'domain/test-provider', params: {}, query: {} });
        should.fail('should have thrown');
      } catch (err) {
        err.message.should.equal('getCatalog() method is not implemented in the test-provider provider.');
      }
    });

    it('should try to fetch from cache', async function () {
      const retrieveSpy = sinon.spy(function (key, queryParams, callback) {
        callback(null, { foo: 'bar' });
      });
      const getCatalogSpy = sinon.spy(function (req, callback) {
        callback(null, {});
      });

      class Model extends MockModel {}
      Model.prototype.getCatalog = getCatalogSpy;

      // create a model with mocked cache "retrieve" function
      const model = createModel({ ProviderModel: MockModel, koop: koopMock }, {
        cache: {
          retrieve: retrieveSpy,
          insert: () => {}
        }
      });


      const pullCatalog = promisify(model.pullCatalog).bind(model);

      const data = await pullCatalog({ url: 'domain/test-provider', params: {}, query: {} });
      data.should.deepEqual({ foo: 'bar' });
      retrieveSpy.should.be.calledOnce();
      retrieveSpy.firstCall.args.length.should.equal(3);
      retrieveSpy.firstCall.args[0].should.be.a.String();
      retrieveSpy.firstCall.args[1].should.be.an.Object().and.be.empty();
      retrieveSpy.firstCall.args[2].should.be.an.Function();
      getCatalogSpy.should.not.be.called();
    });

    it('logs error from cache retrieve', async function () {
      const retrieveSpy = sinon.spy(function (key, queryParams, callback) {
        callback(new Error('cache error'));
      });

      // create a model with mocked cache "retrieve" function
      const model = createModel({ ProviderModel: MockModel, koop: koopMock }, {
        cache: {
          retrieve: retrieveSpy,
          insert: () => {}
        }
      });

      const pullCatalog = promisify(model.pullCatalog).bind(model);

      const data = await pullCatalog({ url: 'domain/test-provider', params: {}, query: {} });
      data.should.deepEqual({
        catalog: 'foo'
      });
      retrieveSpy.should.be.calledOnce();
      koopMock.log.debug.should.be.calledOnce();
    });

    it('should call the getCatalog() function if cache misses', async function () {
      const retrieveSpy = sinon.spy(function (key, queryParams, callback) {
        callback();
      });

      // create a model with mocked cache "retrieve" function
      const model = createModel({ ProviderModel: MockModel, koop: koopMock }, {
        cache: {
          retrieve: retrieveSpy,
          insert: () => {}
        }
      });

      const pullCatalog = promisify(model.pullCatalog).bind(model);

      const data = await pullCatalog({ url: 'domain/test-provider', params: {}, query: {} });
      data.should.deepEqual({
        catalog: 'foo'
      });
      retrieveSpy.should.be.calledOnce();

    });

    it('should call the getCatalog() function if cache misses, inserts to cache', async function () {
      const retrieveSpy = sinon.spy(function (key, queryParams, callback) {
        callback(null);
      });

      const insertSpy = sinon.spy();
      
      const getCatalogSpy = sinon.spy(function (req, callback) {
        callback(null, { catalog: 'foo', ttl: 10 });
      });

      MockModel.prototype.getCatalog = getCatalogSpy;

      // create a model with mocked cache "retrieve" function
      const model = createModel({ ProviderModel: MockModel, koop: koopMock }, {
        cache: {
          retrieve: retrieveSpy,
          insert: insertSpy
        }
      });

      model.getLayer = getCatalogSpy;

      const pullCatalog = promisify(model.pullCatalog).bind(model);

      const data = await pullCatalog({ url: 'domain/test-provider', params: {}, query: {} });
      data.should.deepEqual({
        catalog: 'foo',
        ttl: 10
      });
      retrieveSpy.should.be.calledOnce();
      insertSpy.should.be.calledOnce();
    });

    it('should send error in callback', async () => {
      const beforeSpy = sinon.spy((req, beforeCallback) => {
        beforeCallback();
      });

      const afterSpy = sinon.spy(function (req, data, callback) {
        callback(null, data);
      });

      const cacheRetrieveSpy = sinon.spy((key, query, callback) => {
        callback(null);
      });

      const cacheinsertSpy = sinon.spy(() => {});

      const getCatalogSpy = sinon.spy(function (req, callback) {
        callback(new Error('err in getCatalog'));
      });

      class Model extends MockModel {}
      Model.prototype.getCatalog = getCatalogSpy;
      const model = createModel({ ProviderModel: Model, koop: koopMock }, {
        cache: {
          retrieve: cacheRetrieveSpy,
          insert: cacheinsertSpy
        },
        before: beforeSpy,
        after: afterSpy
      });
      const pullCatalog = promisify(model.pullCatalog).bind(model);

      try {
        await pullCatalog({ url: 'domain/test-provider', params: {}, query: {} });
        should.fail();
      } catch (err) {
        err.message.should.equal('err in getCatalog');
      }
    });
  });

  describe('model pullStream method', function () {
    let getStreamSpy;
    beforeEach(function () {
      getStreamSpy = sinon.stub().resolves(new Readable({ read () { } }));
      MockModel.prototype.getStream = getStreamSpy;
    });

    afterEach(function () {
      // reset the getStream() function to default
      MockModel.prototype.getStream = undefined;
    });

    it('should resolve with result of getStream', async function () {
      const model = createModel({ ProviderModel: MockModel, koop: koopMock });

      const stream = await model.pullStream({ some: 'options' });

      getStreamSpy.should.be.calledOnce();
      stream.should.be.an.instanceOf(Readable);
    });

    it('should call "before" before getStream', async function () {
      const beforeSpy = sinon.stub().callsFake((_, cb) => cb());

      const model = createModel({ ProviderModel: MockModel, koop: koopMock }, { before: beforeSpy });

      await model.pullStream({ some: 'options' });

      beforeSpy.should.be.calledOnce();
      should(beforeSpy.calledBefore(getStreamSpy)).be.ok();
      getStreamSpy.should.be.calledOnce();
    });

    it('should reject if the getStream() function is not implemented', async function () {
      MockModel.prototype.getStream = undefined; // no getStream function

      const model = createModel({ ProviderModel: MockModel, koop: koopMock });

      try {
        await model.pullStream({ some: 'options' });
        should.fail();
      } catch (err) {
        err.should.be.an.Error();
      }
    });
  });
});
