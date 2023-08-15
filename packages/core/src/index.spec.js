const proxyquire = require('proxyquire');
const sinon = require('sinon');
const _ = require('lodash');
const DataProvider = require('./data-provider');

const providerConstructorSpy = sinon.spy();
class mockDataProviderModule extends DataProvider {
  constructor(params) {
    providerConstructorSpy(params);
    super(params);
  }
}

const Koop = proxyquire('./', {
  './data-provider': mockDataProviderModule
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
  getData (req, callback) {
    callback(null, {
      type: 'FeatureCollection',
      features: []
    });
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

const Geoservices = require('@koopjs/output-geoservices');

const should = require('should') // eslint-disable-line

const geoservicesFixtureRoutes = Geoservices.routes.reduce((acc, route) => {
  return acc + route.methods.length;
}, 0);
const providerFixtureRoutes = mockProviderDefinition.routes.reduce((acc, route) => {
  return acc + route.methods.length;
}, 0);

describe('Index tests', function () {
  describe('Koop instantiation', function () {
    it('should instantiate Koop with config', function () {
      const koop = new Koop({ foo: 'bar', logLevel: 'error' });
      koop.config.should.have.property('foo', 'bar');
    });
  });

  describe('Provider registration', function () {
    it('should register provider and add output and provider routes to router stack', function () {
      const koop = new Koop({ logLevel: 'error' });
      koop.register(mockProviderDefinition, { routePrefix: 'watermelon' });
      koop.providers.length.should.equal(1);
      
      koop.providers[0].should.have.property('namespace', 'test-provider');
      // Check that the stack includes routes with the provider name in the path
      const providerRoutes = koop.server._router.stack
        .filter((layer) => {
          return layer?.route?.path.includes('watermelon');
        })
        .map(layer => { 
          return _.get(layer, 'route.path');
        });
      providerRoutes.length.should.equal(geoservicesFixtureRoutes + providerFixtureRoutes);
    });
  });
});

describe('Auth plugin registration', function () {
  const mockAuthPlugin = {
    type: 'auth',
    authenticationSpecification: function () {
      return function () { };
    },
    authenticate: function () {},
    authorize: function () {}
  };

  it('should register successfully', function () {
    const koop = new Koop({ logLevel: 'error' });
    koop.register(mockAuthPlugin);
    koop._authModule.should.be.instanceOf(Object);
    koop._authModule.authenticate.should.be.instanceOf(Function);
    koop._authModule.authorize.should.be.instanceOf(Function);
    koop._authModule.authenticationSpecification.should.be.instanceOf(Function);
  });
});

describe('Generic plugin registration', function () {
  class fakePlugin {
    static type = 'plugin';
    static version = '0.0.0';

    testFunc () {
      return true;
    }
  }
  it('should register successfully', function () {
    const koop = new Koop({ logLevel: 'error' });
    koop.register(fakePlugin);
    koop.fakePlugin.should.be.instanceOf(Object);
    koop.fakePlugin.testFunc.should.be.instanceOf(Function);
    koop.fakePlugin.testFunc().should.equal(true);
  });
});
