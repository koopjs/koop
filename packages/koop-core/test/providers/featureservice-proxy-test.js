var should = require('should');
var path = require('path');
var superagent = require('superagent');

//before(function (done) {
//  done();
//});

describe('FeatureService Proxy Provider', function(){

    var agent = superagent.agent();

    describe('/featureservice routes', function() {
      it('proxy should return 500 with no url param', function(done) {
          agent.get('http://localhost:1337/featureservice/proxy').end( function( err, res ) {
            res.should.have.status( 500 );
            return done();
          });
      });
      it('proxy should return 200 with a url param', function(done) {
          agent.get('http://localhost:1337/featureservice/proxy?url=http://localhost:1337/github/chelm/geodata/ski_areas/FeatureServer').end( function( err, res ) {
            res.should.have.status( 200 );
            return done();
          });
      });
      it('proxy should return 200 and geojson with url param & geojson', function(done) {
          agent.get('http://localhost:1337/featureservice/proxy?url=http://localhost:1337/github/chelm/geodata/ski_areas/FeatureServer/0/query&geojson=true').end( function( err, res ) {
            var json = res.body;
            res.should.have.status( 200 );
            json.type.should.equal( 'FeatureCollection' );
            should.exist( json.features );
            console.log(json);
            return done();
          });
      });
      it('thumbnail should return 500 with no url', function(done) {
          agent.get('http://localhost:1337/featureservice/thumbnail').end( function( err, res ) {
            res.should.have.status( 500 );
            return done();
          });
      });
      it('thumbnail should return 500 with a url param to a non query url', function(done) {
          agent.get('http://localhost:1337/featureservice/thumbnail?url=http://localhost:1337/github/chelm/geodata/ski_areas/FeatureServer').end( function( err, res ) {
            res.should.have.status( 500 );
            return done();
          });
      });
      it('thumbnail should return 200 with a url param to a query url', function(done) {
          agent.get('http://localhost:1337/featureservice/thumbnail?url=http://localhost:1337/github/chelm/geodata/ski_areas/FeatureServer/0/query').end( function( err, res ) {
            res.should.have.status( 200 );
            return done();
          });
      });
    });

});
