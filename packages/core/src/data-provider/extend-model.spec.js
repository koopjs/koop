const should = require('should');
const sinon = require('sinon');
const { promisify } = require('util');
require('should-sinon');
const _ = require('lodash');
const { Readable } = require('stream');

const extendModel = require('./extend-model');

const mockCache = {
  retrieve(req, callback) {
    callback();
  },
  insert() {},
};

const mockLogger = {
  debug: sinon.spy(),
  warn: sinon.spy(),
  info: () => {},
};

class MockModel {
  constructor(koop, options) {
    this.options = options;
  }

  async getData() {
    return {
      type: 'FeatureCollection',
      features: [],
    };
  }

  async getLayer() {
    return {
      layer: 'foo',
    };
  }

  async getCatalog() {
    return {
      catalog: 'foo',
    };
  }
}

describe('Tests for extend-model', function () {
  beforeEach(() => {
    mockLogger.debug.resetHistory();
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
      const model = extendModel(
        { ProviderModel: Model, logger: mockLogger, cache: mockCache },
        {
          foo: 'bar',
        },
      );
      model.koop.should.deepEqual({ log: mockLogger, logger: mockLogger });
      model.options.should.deepEqual({ foo: 'bar' });
    });

    it('should use model defined cache', () => {
      const modelDefinedCache = { retrieve: _.noop, insert: _.noop };
      class Model extends MockModel {
        constructor(koop, options) {
          super(koop, options);
          this.koop = koop;
          this.options = options;
          this.cache = modelDefinedCache;
        }
      }
      const model = extendModel(
        { ProviderModel: Model, logger: mockLogger, cache: mockCache },
        {
          foo: 'bar',
        },
      );

      model.cache.should.deepEqual(modelDefinedCache);
    });

    it('should work without cache', () => {
      const model = extendModel(
        { ProviderModel: MockModel, logger: mockLogger },
        {
          foo: 'bar',
        },
      );

      model.should.be.not.null();
    });
  });

  describe('model pull method', () => {
    describe('async getData without callback', () => {
      it('should not find in cache, should not add to cache', async () => {
        const mockCache = {
          retrieve: sinon.spy((key, query, callback) => {
            callback(null);
          }),
          insert: sinon.spy(() => {}),
        };

        const getDataSpy = sinon.spy(async function () {
          return { metadata: {} };
        });

        class Model extends MockModel {}
        Model.prototype.getData = getDataSpy;

        const model = extendModel({
          ProviderModel: Model,
          logger: mockLogger,
          cache: mockCache,
        });

        const data = await model.pull({
          url: 'domain/test-provider',
          params: {},
          query: {},
        });
        data.should.deepEqual({ metadata: {} });
        mockCache.retrieve.calledOnce.should.equal(true);
        getDataSpy.called.should.equal(true);
        mockCache.insert.notCalled.should.equal(true);
      });

      it('should not find in cache, should add to cache due to data ttl', async () => {
        const mockCache = {
          retrieve: sinon.spy((key, query, callback) => {
            callback(null);
          }),
          insert: sinon.spy(() => {}),
        };

        const getDataSpy = sinon.spy(async function () {
          return { metadata: {}, ttl: 5 };
        });
        class Model extends MockModel {}
        Model.prototype.getData = getDataSpy;
        const model = extendModel({
          ProviderModel: Model,
          logger: mockLogger,
          cache: mockCache,
        });

        const data = await model.pull({
          url: 'domain/test-provider',
          params: {},
          query: {},
        });
        data.should.deepEqual({ metadata: {}, ttl: 5 });
        mockCache.retrieve.calledOnce.should.equal(true);
        getDataSpy.calledOnce.should.equal(true);
        mockCache.insert.calledOnce.should.equal(true);
      });

      it('should not find in cache, should add to cache due to provider ttl', async () => {
        const mockCache = {
          retrieve: sinon.spy((key, query, callback) => {
            callback(null);
          }),
          insert: sinon.spy(() => {}),
        };

        const getDataSpy = sinon.spy(async function () {
          return { metadata: {} };
        });

        class Model extends MockModel {}
        Model.prototype.getData = getDataSpy;
        const model = extendModel(
          { ProviderModel: Model, logger: mockLogger, cache: mockCache },
          {
            cacheTtl: 10,
          },
        );

        const data = await model.pull({
          url: 'domain/test-provider',
          params: {},
          query: {},
        });
        data.should.deepEqual({ metadata: {} });
        mockCache.retrieve.calledOnce.should.equal(true);
        getDataSpy.calledOnce.should.equal(true);
        mockCache.insert.calledOnce.should.equal(true);
      });

      it('should pull from cache', async () => {
        const mockCache = {
          retrieve: sinon.spy((key, query, callback) => {
            callback(null, { foo: 'bar' });
          }),
          insert: sinon.spy(() => {}),
        };

        const getDataSpy = sinon.spy(async function () {
          return;
        });

        class Model extends MockModel {}
        Model.prototype.getData = getDataSpy;
        const model = extendModel({
          ProviderModel: Model,
          logger: mockLogger,
          cache: mockCache,
        });

        const data = await model.pull({
          url: 'domain/test-provider',
          params: {},
          query: {},
        });
        data.should.deepEqual({
          foo: 'bar',
        });
        mockCache.retrieve.calledOnce.should.equal(true);
        getDataSpy.notCalled.should.equal(true);
        mockCache.insert.notCalled.should.equal(true);
      });

      it('should pull from cache and use deprecated _cache info', async () => {
        const now = Date.now();
        const mockCache = {
          retrieve: sinon.spy((key, query, callback) => {
            callback(null, {
              _cache: {
                updated: 0,
                expires: now + 86400000,
              },
              features: ['foo'],
            });
          }),
          insert: sinon.spy(() => {}),
        };

        const getDataSpy = sinon.spy(async function () {
          return;
        });

        class Model extends MockModel {}
        Model.prototype.getData = getDataSpy;
        const model = extendModel({
          ProviderModel: Model,
          logger: mockLogger,
          cache: mockCache,
        });

        const data = await model.pull({
          url: 'domain/test-provider',
          params: {},
          query: {},
        });
        data.should.deepEqual({
          _cache: {
            updated: 0,
            expires: now + 86400000,
          },
          features: ['foo'],
        });
        mockCache.retrieve.calledOnce.should.equal(true);
        getDataSpy.notCalled.should.equal(true);
        mockCache.insert.notCalled.should.equal(true);
      });

      it('should pull from cache and use deprecated metadata info check', async () => {
        const now = Date.now();
        const mockCache = {
          retrieve: sinon.spy((key, query, callback) => {
            callback(null, {
              metadata: {
                updated: 0,
                expires: now + 86400000,
              },
              features: ['foo'],
            });
          }),
          insert: sinon.spy(() => {}),
        };

        const getDataSpy = sinon.spy(async function () {
          return;
        });

        class Model extends MockModel {}
        Model.prototype.getData = getDataSpy;
        const model = extendModel({
          ProviderModel: Model,
          logger: mockLogger,
          cache: mockCache,
        });

        const data = await model.pull({
          url: 'domain/test-provider',
          params: {},
          query: {},
        });
        data.should.deepEqual({
          metadata: {
            updated: 0,
            expires: now + 86400000,
          },
          features: ['foo'],
        });
        mockCache.retrieve.calledOnce.should.equal(true);
        getDataSpy.notCalled.should.equal(true);
        mockCache.insert.notCalled.should.equal(true);
      });

      it('should pass authorization error in callback', async () => {
        const mockCache = {
          retrieve: sinon.spy((key, query, callback) => {
            callback(null);
          }),
          insert: sinon.spy(() => {}),
        };

        class Model extends MockModel {}
        Model.prototype.authorize = async () => {
          throw new Error('unauthorized');
        };

        const model = extendModel({
          ProviderModel: Model,
          logger: mockLogger,
          cache: mockCache,
        });

        try {
          await model.pull({
            url: 'domain/test-provider',
            params: {},
            query: {},
          });
          should.fail();
        } catch (err) {
          err.message.should.equal('unauthorized');
        }
      });

      it('should send error in callback', async () => {
        const mockCache = {
          retrieve: sinon.spy((key, query, callback) => {
            callback(null);
          }),
          insert: sinon.spy(() => {}),
        };

        const getDataSpy = sinon.spy(async function () {
          throw new Error('err in getData');
        });

        class Model extends MockModel {}
        Model.prototype.getData = getDataSpy;
        const model = extendModel({
          ProviderModel: Model,
          logger: mockLogger,
          cache: mockCache,
        });

        try {
          await model.pull({
            url: 'domain/test-provider',
            params: {},
            query: {},
          });
          should.fail();
        } catch (err) {
          err.message.should.equal('err in getData');
        }
      });
    });

    describe('getData with callback', () => {
      it('should not find in cache, should not add to cache', async () => {
        const mockCache = {
          retrieve: sinon.spy((key, query, callback) => {
            callback(null);
          }),
          insert: sinon.spy(() => {}),
        };

        const getDataSpy = sinon.spy(function (req, callback) {
          callback(null, { metadata: {} });
        });

        class Model extends MockModel {}
        Model.prototype.getData = getDataSpy;

        const model = extendModel({
          ProviderModel: Model,
          logger: mockLogger,
          cache: mockCache,
        });

        const pullData = promisify(model.pull).bind(model);

        const data = await pullData({
          url: 'domain/test-provider',
          params: {},
          query: {},
        });
        data.should.deepEqual({ metadata: {} });
        mockCache.retrieve.calledOnce.should.equal(true);
        getDataSpy.called.should.equal(true);
        mockCache.insert.notCalled.should.equal(true);
      });
    });
  });

  describe('createKey', function () {
    it('should create cache-key from Model defined createKey function', async () => {
      const mockCache = {
        retrieve: sinon.spy((key, query, callback) => {
          callback(null, { foo: 'bar' });
        }),
        insert: sinon.spy(() => {}),
      };
      const pullSpy = sinon.spy();

      class Model extends MockModel {
        createKey() {
          return 'custom-key';
        }
      }
      // create a model with mocked cache "retrieve" function
      const model = extendModel({
        ProviderModel: Model,
        logger: mockLogger,
        cache: mockCache,
      });
      await model.pull({ url: 'domain/test-provider', query: {} }, pullSpy);
      mockCache.retrieve.should.be.calledOnce();
      mockCache.retrieve.firstCall.args.length.should.equal(3);
      mockCache.retrieve.firstCall.args[0].should.equal('custom-key');
      mockCache.retrieve.firstCall.args[1].should.be.an.Object().and.be.empty();
      mockCache.retrieve.firstCall.args[2].should.be.an.Function();
      pullSpy.should.be.calledOnce();
      pullSpy.firstCall.args.length.should.equal(2);
      should.not.exist(pullSpy.firstCall.args[0]);
      pullSpy.firstCall.args[1].should.deepEqual({ foo: 'bar' });
    });
  });

  describe('auth methods', () => {
    it('should attach auth methods from authModule if provider does not already define them', async () => {
      const model = extendModel({
        ProviderModel: MockModel,
        namespace: 'test-provider',
        logger: mockLogger,
        cache: mockCache,
        authModule: {
          authenticate: () => {
            return 'from auth-module';
          },
          authorize: () => {
            return 'from auth-module';
          },
          authenticationSpecification: () => {
            return 'from auth-module';
          },
        },
      });
      const authenticateResult = await model.authenticate();
      authenticateResult.should.equal('from auth-module');
      const authorizeResult = await model.authorize();
      authorizeResult.should.equal('from auth-module');
      const specResult = await model.authenticationSpecification();
      specResult.should.equal('from auth-module');
    });

    it('should use provider auth methods if defined', async () => {
      class Model extends MockModel {}
      Model.prototype.authenticate = async () => {
        return 'from provider';
      };

      Model.prototype.authorize = async () => {
        return 'from provider';
      };

      const model = extendModel({
        ProviderModel: Model,
        namespace: 'test-provider',
        logger: mockLogger,
        cache: mockCache,
        authModule: {
          authenticate: () => {
            return 'from auth-module';
          },
          authorize: () => {
            return 'from auth-module';
          },
        },
      });
      const authenticateResult = await model.authenticate();
      authenticateResult.should.equal('from provider');
      const authorizeResult = await model.authorize();
      authorizeResult.should.equal('from provider');
    });

    it('should use dummy auth methods', async () => {
      const model = extendModel({
        ProviderModel: MockModel,
        namespace: 'test-provider',
        logger: mockLogger,
        cache: mockCache,
      });
      const authenticateResult = await model.authenticate();
      authenticateResult.should.deepEqual({});
      const authorizeResult = await model.authorize();
      should(authorizeResult).deepEqual(undefined);
    });
  });

  describe('transformation functions', function () {
    it('before function should modify request object', async () => {
      const beforeSpy = sinon.spy((req, beforeCallback) => {
        req.query.hello = 'world';
        beforeCallback();
      });

      const getDataSpy = sinon.spy(function (req, callback) {
        callback(null, { metadata: {} });
      });

      class Model extends MockModel {}
      Model.prototype.getData = getDataSpy;

      const model = extendModel(
        { ProviderModel: Model, logger: mockLogger, cache: mockCache },
        {
          before: beforeSpy,
        },
      );

      const req = { url: 'domain/test-provider', params: {}, query: {} };
      await model.pull(req, function () {});
      beforeSpy.should.be.calledOnce();
      beforeSpy.firstCall.args.length.should.equal(2);
      beforeSpy.firstCall.args[0].should.be.an.Object();
      beforeSpy.firstCall.args[1].should.be.a.Function();

      getDataSpy.should.be.calledOnce();
      getDataSpy.firstCall.args.length.should.equal(2);
      getDataSpy.firstCall.args[0].should.be.an.Object().and.deepEqual({
        url: 'domain/test-provider',
        params: {},
        query: { hello: 'world' },
      });
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
      const model = extendModel(
        { ProviderModel: Model, logger: mockLogger, cache: mockCache },
        {
          after: afterSpy,
        },
      );

      await model.pull(
        { url: 'domain/test-provider', params: {}, query: {} },
        pullCallbackSpy,
      );
      getDataSpy.should.be.calledOnce();
      getDataSpy.firstCall.args.length.should.equal(2);
      getDataArgs[0].should.deepEqual({
        url: 'domain/test-provider',
        params: {},
        query: {},
      });
      getDataSpy.firstCall.args[1].should.be.an.Function();

      afterSpy.should.be.calledOnce();
      afterSpy.firstCall.args.length.should.equal(3);
      afterSpy.firstCall.args[0].should.be.an.Object();
      afterSpyArgs[0].should.deepEqual({
        url: 'domain/test-provider',
        params: {},
        query: {},
      });
      afterSpy.firstCall.args[0].should.deepEqual({
        url: 'domain/test-provider',
        params: {},
        query: { hello: 'world' },
      }); // captures the expected change to the req argument in the after function
      afterSpyArgs[1].should.deepEqual({ metadata: {} });
      afterSpy.firstCall.args[2].should.be.an.Function();

      pullCallbackSpy.should.be.calledOnce();
      pullCallbackSpy.firstCall.args.length.should.equal(2);
      should.not.exist(pullCallbackSpy.firstCall.args[0]);
      pullCallbackSpy.firstCall.args[1].should.be.an
        .Object()
        .and.deepEqual({ metadata: { food: 'bar' } });
    });
  });

  describe('model pullLayer method', function () {
    afterEach(function () {
      // reset the getLayer() function to default
      extendModel.prototype.getLayer = undefined;
      extendModel.prototype.createKey = undefined;
    });

    it('should pass authorization error in callback', async () => {
      const mockCache = {
        retrieve: sinon.spy((key, query, callback) => {
          callback(null);
        }),
        insert: sinon.spy(() => {}),
      };

      class Model extends MockModel {}
      Model.prototype.authorize = async () => {
        throw new Error('unauthorized');
      };

      const model = extendModel({
        ProviderModel: Model,
        logger: mockLogger,
        cache: mockCache,
      });
      const pullLayer = promisify(model.pullLayer).bind(model);

      try {
        await pullLayer({ url: 'domain/test-provider', params: {}, query: {} });
        should.fail();
      } catch (err) {
        err.message.should.equal('unauthorized');
      }
    });

    it('should throw an error if the getLayer() function is not implemented', async () => {
      class Model extends MockModel {}
      Model.prototype.getLayer = undefined;

      // create a model with mocked cache "retrieve" function
      const model = extendModel({
        ProviderModel: Model,
        logger: mockLogger,
        cache: mockCache,
        namespace: 'test-provider',
      });

      const pullLayer = promisify(model.pullLayer).bind(model);

      try {
        await pullLayer({ params: {}, query: {} });
        should.fail('should have thrown');
      } catch (err) {
        err.message.should.equal(
          'getLayer() method is not implemented in the test-provider provider.',
        );
      }
    });

    it('logs error from cache retrieve', async function () {
      const mockCache = {
        retrieve: sinon.spy((key, query, callback) => {
          callback(new Error('cache error'));
        }),
        insert: sinon.spy(() => {}),
      };

      const model = extendModel({
        ProviderModel: MockModel,
        logger: mockLogger,
        cache: mockCache,
      });

      const pullLayer = promisify(model.pullLayer).bind(model);

      const data = await pullLayer({
        url: 'domain/test-provider',
        params: {},
        query: {},
      });
      data.should.deepEqual({
        layer: 'foo',
      });
      mockCache.retrieve.should.be.calledOnce();
      mockLogger.debug.should.be.calledOnce();
    });

    it('should fetch from cache', async function () {
      const mockCache = {
        retrieve: sinon.spy((key, query, callback) => {
          callback(null, {
            layer: 'cached',
          });
        }),
        insert: sinon.spy(() => {}),
      };

      const getLayerSpy = sinon.spy(function (req, callback) {
        callback(null, {});
      });

      extendModel.prototype.getLayer = getLayerSpy;

      const model = extendModel({
        ProviderModel: MockModel,
        logger: mockLogger,
        cache: mockCache,
      });

      const pullLayer = promisify(model.pullLayer).bind(model);

      const data = await pullLayer({
        url: 'domain/test-provider',
        params: {},
        query: {},
      });
      data.should.deepEqual({
        layer: 'cached',
      });
      mockCache.retrieve.should.be.calledOnce();
      getLayerSpy.should.not.be.called();
    });

    it('should call the getLayer() function if cache misses', async function () {
      const mockCache = {
        retrieve: sinon.spy((key, query, callback) => {
          callback(null);
        }),
        insert: sinon.spy(() => {}),
      };

      const model = extendModel({
        ProviderModel: MockModel,
        logger: mockLogger,
        cache: mockCache,
      });

      const pullLayer = promisify(model.pullLayer).bind(model);

      const data = await pullLayer({
        url: 'domain/test-provider',
        params: {},
        query: {},
      });
      data.should.deepEqual({
        layer: 'foo',
      });
      mockCache.retrieve.should.be.calledOnce();
    });

    it('should work without a cache', async function () {
      const getLayerSpy = sinon.spy(function (req, callback) {
        callback(null, { layer: 'foo', ttl: 10 });
      });

      MockModel.prototype.getLayer = getLayerSpy;

      // create a model with mocked cache "retrieve" function
      const model = extendModel({
        ProviderModel: MockModel,
        logger: mockLogger,
      });

      model.getLayer = getLayerSpy;

      const pullLayer = promisify(model.pullLayer).bind(model);

      const data = await pullLayer({
        url: 'domain/test-provider',
        params: {},
        query: {},
      });
      data.should.deepEqual({
        layer: 'foo',
        ttl: 10,
      });
    });

    it('should call the getLayer() function if cache misses, inserts to cache', async function () {
      const mockCache = {
        retrieve: sinon.spy((key, options, callback) => {
          callback(null);
        }),
        insert: sinon.spy((key, data, options, callback) => {
          callback();
        }),
      };

      const getLayerSpy = sinon.spy(function (req, callback) {
        callback(null, { layer: 'foo', ttl: 10 });
      });

      MockModel.prototype.getLayer = getLayerSpy;

      // create a model with mocked cache "retrieve" function
      const model = extendModel({
        ProviderModel: MockModel,
        logger: mockLogger,
        cache: mockCache,
      });

      model.getLayer = getLayerSpy;

      const pullLayer = promisify(model.pullLayer).bind(model);

      const data = await pullLayer({
        url: 'domain/test-provider',
        params: {},
        query: {},
      });
      data.should.deepEqual({
        layer: 'foo',
        ttl: 10,
      });
      mockCache.retrieve.should.be.calledOnce();
      mockCache.insert.should.be.calledOnce();
    });

    it('should send error in callback', async () => {
      const mockCache = {
        retrieve: sinon.spy((key, query, callback) => {
          callback(null);
        }),
        insert: sinon.spy((key, data, options, callback) => {
          callback();
        }),
      };

      const getLayerSpy = sinon.spy(function (req, callback) {
        callback(new Error('err in getLayer'));
      });

      class Model extends MockModel {}
      Model.prototype.getLayer = getLayerSpy;
      const model = extendModel({
        ProviderModel: Model,
        logger: mockLogger,
        cache: mockCache,
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
      extendModel.prototype.getCatalog = undefined;
    });

    it('should throw an error if the getCatalog() function is not implemented', async () => {
      class Model extends MockModel {}
      Model.prototype.getCatalog = undefined;

      // create a model with mocked cache "retrieve" function
      const model = extendModel({
        ProviderModel: Model,
        logger: mockLogger,
        cache: mockCache,
        namespace: 'test-provider',
      });

      const pullCatalog = promisify(model.pullCatalog).bind(model);

      try {
        await pullCatalog({
          url: 'domain/test-provider',
          params: {},
          query: {},
        });
        should.fail('should have thrown');
      } catch (err) {
        err.message.should.equal(
          'getCatalog() method is not implemented in the test-provider provider.',
        );
      }
    });

    it('should fetch from cache', async function () {
      const mockCache = {
        retrieve: sinon.spy((key, query, callback) => {
          callback(null, { foo: 'bar' });
        }),
        insert: sinon.spy(() => {}),
      };

      const getCatalogSpy = sinon.spy(function (req, callback) {
        callback(null, {});
      });

      class Model extends MockModel {}
      Model.prototype.getCatalog = getCatalogSpy;

      const model = extendModel({
        ProviderModel: Model,
        logger: mockLogger,
        cache: mockCache,
        namespace: 'test-provider',
      });

      const pullCatalog = promisify(model.pullCatalog).bind(model);

      const data = await pullCatalog({
        url: 'domain/test-provider',
        params: {},
        query: {},
      });
      data.should.deepEqual({ foo: 'bar' });
      mockCache.retrieve.should.be.calledOnce();
      mockCache.retrieve.firstCall.args.length.should.equal(3);
      mockCache.retrieve.firstCall.args[0].should.be.a.String();
      mockCache.retrieve.firstCall.args[1].should.be.an.Object().and.be.empty();
      mockCache.retrieve.firstCall.args[2].should.be.an.Function();
      getCatalogSpy.should.not.be.called();
    });

    it('logs error from cache retrieve', async function () {
      const mockCache = {
        retrieve: sinon.spy((key, query, callback) => {
          callback(new Error('cache error'));
        }),
        insert: sinon.spy(() => {}),
      };

      // create a model with mocked cache "retrieve" function
      const model = extendModel({
        ProviderModel: MockModel,
        logger: mockLogger,
        cache: mockCache,
      });

      const pullCatalog = promisify(model.pullCatalog).bind(model);

      const data = await pullCatalog({
        url: 'domain/test-provider',
        params: {},
        query: {},
      });
      data.should.deepEqual({
        catalog: 'foo',
      });
      mockCache.retrieve.should.be.calledOnce();
      mockLogger.debug.should.be.calledOnce();
    });

    it('should call the getCatalog() function if cache misses, inserts to cache', async function () {
      const mockCache = {
        retrieve: sinon.spy((key, query, callback) => {
          callback(null);
        }),
        insert: sinon.spy(() => {}),
      };

      const getCatalogSpy = sinon.spy(function (req, callback) {
        callback(null, { catalog: 'foo', ttl: 10 });
      });

      MockModel.prototype.getCatalog = getCatalogSpy;

      const model = extendModel({
        ProviderModel: MockModel,
        logger: mockLogger,
        cache: mockCache,
        namespace: 'test-provider',
      });

      model.getLayer = getCatalogSpy;

      const pullCatalog = promisify(model.pullCatalog).bind(model);

      const data = await pullCatalog({
        url: 'domain/test-provider',
        params: {},
        query: {},
      });
      data.should.deepEqual({
        catalog: 'foo',
        ttl: 10,
      });
      mockCache.retrieve.should.be.calledOnce();
      mockCache.insert.should.be.calledOnce();
    });

    it('should send error in callback', async () => {
      const mockCache = {
        retrieve: sinon.spy((key, query, callback) => {
          callback(null);
        }),
        insert: sinon.spy(() => {}),
      };

      const getCatalogSpy = sinon.spy(function (req, callback) {
        callback(new Error('err in getCatalog'));
      });

      class Model extends MockModel {}
      Model.prototype.getCatalog = getCatalogSpy;
      const model = extendModel({
        ProviderModel: Model,
        logger: mockLogger,
        cache: mockCache,
        namespace: 'test-provider',
      });
      const pullCatalog = promisify(model.pullCatalog).bind(model);

      try {
        await pullCatalog({
          url: 'domain/test-provider',
          params: {},
          query: {},
        });
        should.fail();
      } catch (err) {
        err.message.should.equal('err in getCatalog');
      }
    });

    it('should pass authorization error in callback', async () => {
      const mockCache = {
        retrieve: sinon.spy((key, query, callback) => {
          callback(null);
        }),
        insert: sinon.spy(() => {}),
      };

      class Model extends MockModel {}
      Model.prototype.authorize = async () => {
        throw new Error('unauthorized');
      };

      const model = extendModel({
        ProviderModel: Model,
        logger: mockLogger,
        cache: mockCache,
      });
      const pullCatalog = promisify(model.pullCatalog).bind(model);

      try {
        await pullCatalog({
          url: 'domain/test-provider',
          params: {},
          query: {},
        });
        should.fail();
      } catch (err) {
        err.message.should.equal('unauthorized');
      }
    });
  });

  describe('model pullStream method', function () {
    let getStreamSpy;
    beforeEach(function () {
      getStreamSpy = sinon.stub().resolves(new Readable({ read() {} }));
      MockModel.prototype.getStream = getStreamSpy;
    });

    afterEach(function () {
      // reset the getStream() function to default
      MockModel.prototype.getStream = undefined;
    });

    it('should resolve with result of getStream', async function () {
      const model = extendModel({
        ProviderModel: MockModel,
        logger: mockLogger,
        cache: mockCache,
        namespace: 'test-provider',
      });

      const stream = await model.pullStream({ some: 'options' });

      getStreamSpy.should.be.calledOnce();
      stream.should.be.an.instanceOf(Readable);
    });

    it('should call "before" before getStream', async function () {
      const beforeSpy = sinon.spy((_, cb) => cb());

      const model = extendModel(
        {
          ProviderModel: MockModel,
          logger: mockLogger,
          cache: mockCache,
          namespace: 'test-provider',
        },
        { before: beforeSpy },
      );

      await model.pullStream({ some: 'options' });

      beforeSpy.should.be.calledOnce();
      should(beforeSpy.calledBefore(getStreamSpy)).be.ok();
      getStreamSpy.should.be.calledOnce();
    });

    it('should reject if the getStream() function is not implemented', async function () {
      MockModel.prototype.getStream = undefined; // no getStream function

      const model = extendModel({
        ProviderModel: MockModel,
        logger: mockLogger,
        cache: mockCache,
        namespace: 'test-provider',
      });

      try {
        await model.pullStream({ some: 'options' });
        should.fail();
      } catch (err) {
        err.should.be.an.Error();
      }
    });

    it('should throw authorization error', async () => {
      const mockCache = {
        retrieve: sinon.spy((key, query, callback) => {
          callback(null);
        }),
        insert: sinon.spy(() => {}),
      };

      class Model extends MockModel {}
      Model.prototype.authorize = async () => {
        throw new Error('unauthorized');
      };

      const model = extendModel({
        ProviderModel: Model,
        logger: mockLogger,
        cache: mockCache,
      });

      try {
        await model.pullStream({ some: 'options' });
        should.fail();
      } catch (err) {
        err.message.should.equal('unauthorized');
      }
    });
  });
});
