var should = require('should');
var path = require('path');
var superagent = require('superagent');
var app = require('../app');

before(function (done) {
  setTimeout(function(){
    done();
  },1500);
})

describe('Koop Routes', function(){

    var agent = superagent.agent();

    describe('/geojson', function() {
      it('should return an array of files in the filesystem store', function(done) {
          agent.get('http://localhost:1337/geojson/').end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(2);
            return done();
          });
      });
    });

    describe('/gist', function() {
      it('should return 404', function(done) {
          agent.get('http://localhost:1337/gist/').end(function(err, res) {
            res.should.have.status(404);
            return done();
          });
      });
    });

    describe('/gist', function() {
      it('should return 200', function(done) {
          agent.get('http://localhost:1337/gist/6021269').end(function(err, res) {
            res.should.have.status(200);
            return done();
          });
      });
    });

    describe('/gist', function() {
      it('should return 200', function(done) {
          agent.get('http://localhost:1337/gist/6021269/FeatureServer').end(function(err, res) {
            res.should.have.status(200);
            return done();
          });
      });
    });

    describe('/gist', function() {
      it('should return 200', function(done) {
          agent.get('http://localhost:1337/gist/6021269/FeatureServer/0').end(function(err, res) {
            res.should.have.status(200);
            return done();
          });
      });
    });

    describe('/gist', function() {
      it('should return 200', function(done) {
          agent.get('http://localhost:1337/gist/6021269/FeatureServer/0/query').end(function(err, res) {
            res.should.have.status(200);
            return done();
          });
      });
    });

    describe('/github', function() {
      it('should return 404', function(done) {
          agent.get('http://localhost:1337/gist/').end(function(err, res) {
            res.should.have.status(404);
            return done();
          });
      });
    });

});

