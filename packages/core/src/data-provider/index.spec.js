const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
const DataProvider = require('./');

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

class MockOutput {
  static routes = [
    {
      path: '/mock-output/',
      methods: ['get', 'post'],
      handler: 'pullData'
    }
  ];

  static name = 'MockOutput';
   
  async pullData (req, res) {
    await this.model.pull(req);
    res.status(200).json({ message: 'success' });
  }
}

const mockPluginDefinition = {
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

describe('Tests for Provider', function () {
  const mockCache = {};
  const mockLogger = {
    info: () => {}
  };

  it('should create instance of DataProvider', function () {
    const providerRegistration = new DataProvider({
      logger: mockLogger,
      cache: mockCache,
      outputPlugins: [{ outputClass: MockOutput }],
      pluginDefinition: { ...mockPluginDefinition },
    });
    providerRegistration.should.be.instanceOf(DataProvider);
    providerRegistration.should.have.property('namespace', 'test-provider');
    providerRegistration.should.have.property('version', '99.0.0');
    providerRegistration.should.have.property('providerRoutes').length(1);
    providerRegistration.providerRoutes[0].should.have.property('path', '/mock-provider-route/:id');
    providerRegistration.should.have.property('outputPluginRoutes').length(1);
    providerRegistration.outputPluginRoutes[0].should.have.property('namespace', 'MockOutput');
    providerRegistration.outputPluginRoutes[0].should.have.property('routes').length(1);
    providerRegistration.outputPluginRoutes[0].routes[0].should.have.property('path', '/test-provider/:id/mock-output');
  });

  it('should create instance of DataProvider with unknown version number', function () {
    const providerRegistration = new DataProvider({
      logger: mockLogger,
      cache: mockCache,
      outputPlugins: [{ outputClass: MockOutput }],
      pluginDefinition: { ...mockPluginDefinition, version: undefined },
    });
    providerRegistration.should.be.instanceOf(DataProvider);
    providerRegistration.should.have.property('version', 'unknown');
  });

  it('should create instance of DataProvider without provider-defined routes', function () {
    const providerRegistration = new DataProvider({
      logger: mockLogger,
      cache: mockCache,
      outputPlugins: [{ outputClass: MockOutput }],
      pluginDefinition: { ...mockPluginDefinition, routes: undefined },
    });
    providerRegistration.should.have.property('providerRoutes').length(0);
  });

  it('should create instance of DataProvider without output plugin routes', function () {
    const providerRegistration = new DataProvider({
      logger: mockLogger,
      cache: mockCache,
      pluginDefinition: { ...mockPluginDefinition },
    });
    providerRegistration.should.have.property('outputPluginRoutes').length(0);
  });

  it('should add routes to server, output routes last', function () {
    const providerRegistration = new DataProvider({
      logger: mockLogger,
      cache: mockCache,
      outputPlugins: [{ outputClass: MockOutput }],
      pluginDefinition: { ...mockPluginDefinition },
    });

    const mockServer = {
      get: sinon.spy(),
      post: sinon.spy()
    };
    providerRegistration.addRoutesToServer(mockServer);
    mockServer.get.callCount.should.equal(2);
    mockServer.get.firstCall.args[0].should.equal('/mock-provider-route/:id');
    mockServer.get.secondCall.args[0].should.equal('/test-provider/:id/mock-output');
    mockServer.post.callCount.should.equal(1);
    mockServer.post.firstCall.args[0].should.equal('/test-provider/:id/mock-output');
  });

  it('should add routes to server, provider routes last', function () {
    const providerRegistration = new DataProvider({
      logger: mockLogger,
      cache: mockCache,
      outputPlugins: [{ outputClass: MockOutput }],
      pluginDefinition: { ...mockPluginDefinition },
      options: { defaultToOutputRoutes: true }
    });

    const mockServer = {
      get: sinon.spy(),
      post: sinon.spy()
    };
    providerRegistration.addRoutesToServer(mockServer);
    mockServer.get.callCount.should.equal(2);
    mockServer.get.firstCall.args[0].should.equal('/test-provider/:id/mock-output');
    mockServer.get.secondCall.args[0].should.equal('/mock-provider-route/:id');
    mockServer.post.callCount.should.equal(1);
    mockServer.post.firstCall.args[0].should.equal('/test-provider/:id/mock-output');
  });

  it('should add routes to server, no provider-defined routes', function () {
    const providerRegistration = new DataProvider({
      logger: mockLogger,
      cache: mockCache,
      outputPlugins: [{ outputClass: MockOutput }],
      pluginDefinition: { ...mockPluginDefinition, routes: undefined },
      options: { defaultToOutputRoutes: true }
    });

    const mockServer = {
      get: sinon.spy(),
      post: sinon.spy()
    };
    providerRegistration.addRoutesToServer(mockServer);
    mockServer.get.callCount.should.equal(1);
    mockServer.get.firstCall.args[0].should.equal('/test-provider/:id/mock-output');
    mockServer.post.callCount.should.equal(1);
    mockServer.post.firstCall.args[0].should.equal('/test-provider/:id/mock-output');
  });

  it('should throw error on bad provider option', () => {
    try {
      new DataProvider({
        logger: mockLogger,
        cache: mockCache,
        outputPlugins: [{ outputClass: MockOutput }],
        pluginDefinition: { ...mockPluginDefinition },
        options: { routePrefix: 99 }
      });
    } catch (error) {
      error.message.should.equal('Provider "test-provider" has invalid option: "routePrefix" must be a string');
    }
  });
});
