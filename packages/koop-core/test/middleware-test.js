const middleware = require('../src/middleware');
const should = require('should') // eslint-disable-line

describe('Middleware tests', function () {
  describe('paramsTrim function', function () {
    
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
})


