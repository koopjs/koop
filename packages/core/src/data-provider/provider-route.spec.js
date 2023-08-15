const should = require('should') // eslint-disable-line
const proxyquire = require('proxyquire');
const ProviderRoute = proxyquire('./provider-route', {
  './helpers/compose-route-path': () => {
    return 'the/path/for/route';
  }
});

describe('ProviderRoute', function () {
  it('should create instance of ProviderRoute', function () {
    const controller =  { someHandler: () => {} };
    const providerRoute = new ProviderRoute({
      controller,
      handler: 'someHandler',
      path: 'some/route',
      absolutePath: true,
      methods: ['post'],
      providerNamespace: 'test-provider',
    });
    providerRoute.should.be.instanceOf(ProviderRoute);
    providerRoute.should.have.property('controller', controller);
    providerRoute.should.have.property('handler').and.be.a.Function();
    providerRoute.should.have.property('path', 'the/path/for/route');
    providerRoute.should.have.property('methods', ['post']);
  });

  it('should fail HTTP method validation', function () {
    const controller =  { someHandler: () => {} };
    try {
      new ProviderRoute({
        controller,
        handler: 'someHandler',
        path: 'some-route/:id',
        methods: ['poszt'],
        providerNamespace: 'test-provider',
        routePrefix: 'cantaloupe',
      });
    } catch (error) {
      error.message.should.equal('defines route "some-route/:id" with unsupported HTTP method: poszt');
    }    
  });

  it('should fail controller validation', function () {
    const controller =  { someHandler: () => {} };
    try {
      new ProviderRoute({
        controller,
        handler: 'someOtherHandler',
        path: 'some-route/:id',
        methods: ['post'],
        providerNamespace: 'test-provider',
        routePrefix: 'cantaloupe',
      });
    } catch (error) {
      error.message.should.equal('defines route "some-route/:id" with unknown handler: someOtherHandler');
    }    
  });
});
