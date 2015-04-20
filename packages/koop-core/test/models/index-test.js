var should = require('should');
var fs = require('fs');

var config = require('config');
var provider = require('../fixtures/fake-provider');
var kooplib = require('../../lib');
var koop = require('../../')(config);

before(function (done) {
  done();
});

describe('Index tests for registering providers', function(){

    describe('can register a provider', function(){
      it('when the provider has a pattern', function(done){
        koop.register( provider );
        Object.keys(koop.services).length.should.equal(1);
        koop._router.stack.length.should.equal(17);
        done();  
      });
    });

});

