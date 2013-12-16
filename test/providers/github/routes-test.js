var should = require('should');
var path = require('path');
var superagent = require('superagent');

before(function (done) {
    done();
});

describe('Koop Routes', function(){

    var agent = superagent.agent();

    describe('/github', function() {
      it('should return 404', function(done) {
          agent.get('http://localhost:1337/github/').end(function(err, res) {
            res.should.have.status(200);
            return done();
          });
      });
    });

    describe('/github/blarg/', function() {
      it('should return 404', function(done) {
          agent.get('http://localhost:1337/github/blarg/').end(function(err, res) {
            res.should.have.status(404);
            return done();
          });
      });
    });

    describe('/github/colemanm/hurricanes/fl_2004_hurricanes', function() {
      it('should return 200', function(done) {
          agent.get('http://localhost:1337/github/colemanm/hurricanes/fl_2004_hurricanes').end(function(err, res) {
            res.should.have.status(200);
            return done();
          });
      });
    });

    describe('/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer', function() {
      it('should return 200', function(done) {
          agent.get('http://localhost:1337/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer').end(function(err, res) {
            res.should.have.status(200);
            return done();
          });
      });
    });

    describe('/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/0', function() {
      it('should return 200', function(done) {
          agent.get('http://localhost:1337/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/0').  end(function(err, res) {
            res.should.have.status(200);
            return done();
          });
      });
    });

    describe('/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/0/query', function() {
      it('should return 200', function(done) {
          agent.get('http://localhost:1337/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/0/query').end(function(err, res) {
            res.should.have.status(200);
            return done();
          });
      });
    });

});

