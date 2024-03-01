const proxyquire = require('proxyquire');
const sinon = require('sinon');
const _ = require('lodash');
const DataProvider = require('./data-provider');

const providerConstructorSpy = sinon.spy();

const mockApp = {
  use: sinon.spy(() => mockApp),
  disable: sinon.spy(() => mockApp),
  set: sinon.spy(() => mockApp),
  on: sinon.spy((event, callback) => {
    callback();
    return mockApp;
  }),
  get: sinon.spy((route, handler) => {
    if( route === '/status') {
      handler({}, { json: () => {} });
    }
    return mockApp;
  }),
  post: sinon.spy(() => mockApp),
};

const mockExpress = () => {
  return mockApp;
};

class mockDataProviderModule extends DataProvider {
  constructor(params) {
    providerConstructorSpy(params);
    super(params);
  }
}

class MockLogger {
  warn () {}
  log  () {}
  error  () {}
  info  () {}
  silly () {}
}
const Koop = proxyquire('./', {
  './data-provider': mockDataProviderModule,
  '@koopjs/logger': MockLogger,
  'express': mockExpress
});

class MockProviderPluginController {
  getHandler (req, res) {
    res.send('hello');
  }
  
  otherHandler (req, res) {
    res.send('other hello');
  }
}

class MockModel {
  async getData () {
    return {
      type: 'FeatureCollection',
      features: []
    };
  }
}

const mockProviderDefinition = {
  name: 'test-provider',
  type: 'provider',
  version: '99.0.0',
  Controller: MockProviderPluginController,
  routes: [
    {
      path: '/mock-provider-route/:id',
      methods: ['get'],
      handler: 'getHandler'
    }
  ],
  Model: MockModel
};

const should = require('should') // eslint-disable-line

describe('Index tests', function () {
  beforeEach(() => {
    sinon.reset();
  });
  describe('Koop instantiation', function () {
    it('should instantiate Koop without options', function () {
      const koop = new Koop();
      koop.config.should.be.empty();
      mockApp.use.callCount.should.equal(5);
    });

    it('should instantiate Koop with options', function () {
      const koop = new Koop({ foo: 'bar', logLevel: 'error' });
      koop.config.should.have.property('foo', 'bar');
    });

    it('should skip geoservices registration', function () {
      const koop = new Koop({ skipGeoservicesRegistration: true});
      koop.register(mockProviderDefinition, { routePrefix: 'watermelon' });
      koop.outputs.length.should.equal(0);
    });

    it('should disable CORS and compression', function () {
      new Koop({ disableCors: true, disableCompression: true });

      mockApp.use.callCount.should.equal(3);
    });
  });

  describe('Plugin registration', function () {
    it('should fail if no plugin', () => {
      try {
        const koop = new Koop({ logLevel: 'error' });
        koop.register();
        throw new Error('should have thrown');
      } catch (error) {
        error.should.have.property('message', 'Plugin registration failed: plugin undefined');
      }
    });

    it('should register provider and add output and provider routes to router stack', function () {
      const koop = new Koop({ logLevel: 'error' });
      koop.register(mockProviderDefinition, { routePrefix: 'watermelon' });
      koop.providers.length.should.equal(1);
      koop.providers[0].should.have.property('namespace', 'test-provider');
    });

    it('should register unknown plugin type as provider and add output and provider routes to router stack', function () {
      const koop = new Koop({ logLevel: 'error' });
      const unknownPlugin =  _.cloneDeep(mockProviderDefinition);
      delete unknownPlugin.type;

      koop.register(unknownPlugin, { routePrefix: 'watermelon' });
      koop.providers.length.should.equal(1);
      koop.providers[0].should.have.property('namespace', 'test-provider');
    });

    it('should register auth-plugin successfully', function () {
      const mockAuthPlugin = {
        type: 'auth',
        authenticate: function () {},
        authorize: function () {}
      };
    
      const koop = new Koop({ logLevel: 'error' });
      try {
        koop.register(mockAuthPlugin);
      } catch (error) {
        (error).should.equal(undefined);
      }
  
    });

    it('should register cache-plugin successfully', function () {
      const mockCachePlugin = class MockCache {
        static type = 'cache';
      };
    
      const koop = new Koop({ logLevel: 'error' });
      try {
        koop.register(mockCachePlugin);
      } catch (error) {
        (error).should.equal(undefined);
      }
  
    });
  });

});

