var should = require('should');
var path = require('path');
var superagent = require('superagent');

before(function (done) {
  done();
});

after(function( done ){
  var agent = superagent.agent();
  done();
});

describe('OSM Provider', function(){

    var agent = superagent.agent();

    describe('/osm routes', function() {
      it('root should return 200', function(done) {
          agent.get('http://localhost:1337/osm')
          .end( function( err, res ) {
            res.should.have.status( 200 );
            return done();
          });
      });

      it('points should return 200', function(done) {
          agent.get('http://localhost:1337/osm/points')
          .end( function( err, res ) {
            res.should.have.status( 200 );
            return done();
          });
      });

      it('points should return 200', function(done) {
          agent.get('http://localhost:1337/osm/points')
          .end( function( err, res ) {
            res.should.have.status( 200 );
            return done();
          });
      });

      it('points should return 200', function(done) {
          agent.get('http://localhost:1337/osm/points/FeatureServer')
          .end( function( err, res ) {
            res.should.have.status( 200 );
            return done();
          });
      });

      it('points should return 200', function(done) {
          agent.get('http://localhost:1337/osm/points/FeatureServer/0')
          .end( function( err, res ) {
            res.should.have.status( 200 );
            return done();
          });
      });

    });

});
