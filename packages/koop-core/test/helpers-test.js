var helpers = require('../src/helpers')
const should = require('should') // eslint-disable-line

describe('Tests for helper functions', function () {
  describe('Tests for composeRouteString', function () {
    it('create route with :host and :id parameter', function () {
      let fullRoute = helpers.composeRouteString('FeatureServer/:layer/:method', 'test', { hosts: true })
      fullRoute.should.equal('/test/:host/:id/FeatureServer/:layer/:method')
    })
    it('create route with :host parameter and without :id parameter', function () {
      let fullRoute = helpers.composeRouteString('FeatureServer/:layer/:method', 'test', { hosts: true, disableIdParam: true })
      fullRoute.should.equal('/test/:host/FeatureServer/:layer/:method')
    })

    it('create route without :host parameter', function () {
      let fullRoute = helpers.composeRouteString('FeatureServer/:layer/:method', 'test')
      fullRoute.should.equal('/test/:id/FeatureServer/:layer/:method')
    })

    it('create route without :host and :id parameter', function () {
      let fullRoute = helpers.composeRouteString('FeatureServer/:layer/:method', 'test', { disableIdParam: true })
      fullRoute.should.equal('/test/FeatureServer/:layer/:method')
    })

    it('create route with templated $namespace$ and $providerParams$ substrings', function () {
      let fullRoute = helpers.composeRouteString('$namespace/rest/services/$providerParams/FeatureServer/:layer/:method', 'test', { hosts: true })
      fullRoute.should.equal('/test/rest/services/:host/:id/FeatureServer/:layer/:method')
    })

    it('create route with templated $namespace$ substring', function () {
      let fullRoute = helpers.composeRouteString('$namespace/rest/services/FeatureServer/:layer/:method', 'test', { disableIdParam: true })
      fullRoute.should.equal('/test/rest/services/FeatureServer/:layer/:method')
    })

    it('create route with templated $namespace$ substring', function () {
      let fullRoute = helpers.composeRouteString('$namespace/rest/services/FeatureServer/:layer/:method', 'test')
      fullRoute.should.equal('/test/rest/services/FeatureServer/:layer/:method')
    })

    it('create route with templated $namespace$ substring', function () {
      let fullRoute = helpers.composeRouteString('$providerParams/rest/services/FeatureServer/:layer/:method', 'test')
      fullRoute.should.equal('/test/:id/rest/services/FeatureServer/:layer/:method')
    })

    it('create route without decoration', function () {
      let fullRoute = helpers.composeRouteString('rest/info', 'test', { absolutePath: true })
      fullRoute.should.equal('/rest/info')
    })

    it('create route without prefix and :host parameter', function () {
      let fullRoute = helpers.composeRouteString('FeatureServer/:layer/:method', 'test', { routePrefix: '/api/test' })
      fullRoute.should.equal('/api/test/test/:id/FeatureServer/:layer/:method')
    })

    it('create route with prefix and without decoration', function () {
      let fullRoute = helpers.composeRouteString('rest/info', 'test', { absolutePath: true, routePrefix: '/api/test' })
      fullRoute.should.equal('/api/test/rest/info')
    })

    it('create route with prefix and templated $namespace$ and $providerParams$ substrings', function () {
      let fullRoute = helpers.composeRouteString('$namespace/rest/services/$providerParams/FeatureServer/:layer/:method', 'test', { hosts: true })
      fullRoute.should.equal('/test/rest/services/:host/:id/FeatureServer/:layer/:method')
    })
  })
})
