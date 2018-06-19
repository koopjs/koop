const middleware = require('../src/middleware');
const should = require('should') // eslint-disable-line

describe('Middleware tests', function () {
  describe('paramTrim function', function () {
    
    it('should trim leading and trail white space from body params', function () {
      const req = {query: { param1: ' needs-a-trim '} };
      middleware.paramTrim(req, {}, function(){});
      req.query.param1.should.equal('needs-a-trim')
    })

    it('should leave non-string type intact', function () {
      const req = {query: { param1: 1} };
      middleware.paramTrim(req, {}, function(){});
      req.query.param1.should.equal(1)
    })
  })

  describe('paramParse function', function () {
    it('should convert a JSON (escaped) string parameter to a JSON object', function () {
      const req = {query: { param1: '{\"jsonstr\":\"foobar\"}'} };
      middleware.paramParse(req, {}, function(){});
      req.query.param1.hasOwnProperty('jsonstr').should.equal(true)
      req.query.param1.jsonstr.should.equal('foobar')
    })

    it('should convert a JSON string parameter to a JSON object', function () {
      const req = {query: { param1: '{"jsonstr":"foobar"}'} };
      middleware.paramParse(req, {}, function(){});
      req.query.param1.hasOwnProperty('jsonstr').should.equal(true)
      req.query.param1.jsonstr.should.equal('foobar')
    })
  })

  describe('paramCoerce function', function () {
    it('should convert strings "true" or "false" to booleans', function () {
      const req = {query: { param1: 'true', param2: 'false'} };
      middleware.paramCoerce(req, {}, function(){});
      req.query.param1.should.equal(true)
      req.query.param2.should.equal(false)
    })
  })
})


