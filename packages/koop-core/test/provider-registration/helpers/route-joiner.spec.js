const routeJoiner = require('../../../lib/provider-registration/helpers/route-joiner')
const should = require('should') // eslint-disable-line

describe('Tests for routeJoiner', function () {
  it('create route with simple fragments', function () {
    const fullRoute = routeJoiner('hello', 'world', 'from', 'mocha')
    fullRoute.should.equal('/hello/world/from/mocha')
  })

  it('create route with complex fragments', function () {
    const fullRoute = routeJoiner('hello/world/', '/from/mocha')
    fullRoute.should.equal('/hello/world/from/mocha')
  })

  it('create route with empty fragments', function () {
    const fullRoute = routeJoiner('hello/world/', '', undefined, null)
    fullRoute.should.equal('/hello/world')
  })

  it('create route with fragments that are "/" ', function () {
    const fullRoute = routeJoiner('hello/world/', '/', 'foo')
    fullRoute.should.equal('/hello/world/foo')
  })
})
