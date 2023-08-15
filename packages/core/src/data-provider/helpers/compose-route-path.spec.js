const { composeRoutePath } = require('./');
const should = require('should') // eslint-disable-line

describe('Tests for composeRoutePath', function () {
  it('create route with :host and :id parameter', function () {
    const params = { hosts: true, providerNamespace: 'test', path: 'FeatureServer/:layer/:method' };
    const fullRoute = composeRoutePath(params);
    fullRoute.should.equal('/test/:host/:id/FeatureServer/:layer/:method');
  });

  it('create route with :host parameter and without :id parameter', function () {
    const params = { hosts: true, disableIdParam: true, providerNamespace: 'test', path: 'FeatureServer/:layer/:method' };
    const fullRoute = composeRoutePath(params);
    fullRoute.should.equal('/test/:host/FeatureServer/:layer/:method');
  });

  it('create route without :host parameter', function () {
    const params = { providerNamespace: 'test', path: 'FeatureServer/:layer/:method' };
    const fullRoute = composeRoutePath(params);
    fullRoute.should.equal('/test/:id/FeatureServer/:layer/:method');
  });

  it('create route without :host and :id parameter', function () {
    const params = { providerNamespace: 'test', disableIdParam: true, path: 'FeatureServer/:layer/:method' };
    const fullRoute = composeRoutePath(params);
    fullRoute.should.equal('/test/FeatureServer/:layer/:method');
  });

  it('create route with templated $namespace$ substring', function () {
    const params = { providerNamespace: 'test', disableIdParam: true, path: '$namespace/rest/services/FeatureServer/:layer/:method' };
    const fullRoute = composeRoutePath(params);
    fullRoute.should.equal('/test/rest/services/FeatureServer/:layer/:method');
  });

  it('create route with templated $namespace$ and $providerParams$ substrings', function () {
    const params = { providerNamespace: 'test', hosts: true, path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/:method' };
    const fullRoute = composeRoutePath(params);
    fullRoute.should.equal('/test/rest/services/:host/:id/FeatureServer/:layer/:method');
  });

  it('create route without path construction', function () {
    const params = { path: 'rest/info', absolutePath: true };
    const fullRoute = composeRoutePath(params);
    fullRoute.should.equal('/rest/info');
  });

  it('create route with prefix, :host, :id parameters', function () {
    const params = { providerNamespace: 'test', routePrefix: 'api/v1', path: 'FeatureServer/:layer/:method' };
    const fullRoute = composeRoutePath(params);
    fullRoute.should.equal('/api/v1/test/:id/FeatureServer/:layer/:method');
  });
});
