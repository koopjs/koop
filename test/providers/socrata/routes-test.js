var should = require('should');
var path = require('path');
var superagent = require('superagent');

var resourceId = 'f7f2-ggz5';

before(function (done) {
  done();
});

after(function( done ){
  var agent = superagent.agent();
 // agent.del('http://localhost:1337/socrata/tester')
 //   .end( function( err, res ) {
      done();
 //   });
});

describe('Socrata Controller and Routes', function(){

    var agent = superagent.agent();

    describe('/socrata routes', function() {
      it('register should return 500 when POSTing w/o a host', function(done) {
          agent.post('http://localhost:1337/socrata/register')
          .end( function( err, res ) {
            res.should.have.status( 500 );
            return done();
          });
      });

      it('register should return 200 when POSTing w/o a host', function(done) {
          var id = 'tester';
          agent.post('http://localhost:1337/socrata/register')
          .send({ host: 'https://data.cityofchicago.org', id: id })
          .end( function( err, res ) {
            var json = res.body;
            json.serviceId.should.not.equal( null );
            res.should.have.status( 200 );
            return done();
          });
      });

      it('register should return 200 when GETing all registered providers', function(done) {
          agent.get('http://localhost:1337/socrata')
          .end( function( err, res ) {
            var json = res.body;
            res.should.have.status( 200 );
            return done();
          });
      });

      it('should return 200 when GETing a registered provider', function(done) {
          agent.get('http://localhost:1337/socrata/tester')
          .end( function( err, res ) {
            var json = res.body;
            res.should.have.status( 200 );
            return done();
          });
      });

      it('should return 404 when GETing an unknown provider/host', function(done) {
          agent.get('http://localhost:1337/socrata/bogus')
          .end( function( err, res ) {
            res.should.have.status( 404 );
            return done();
          });
      });

      it('should return 200 when accessing item data', function(done) {
          
          agent.get('http://localhost:1337/socrata/tester/'+resourceId )
              .end( function( err, res ) {
                res.should.have.status( 200 );
                should.not.exist(err);
                return done();
              });
      });

      it('should return 200 when accessing item as a featureservice', function(done) {
          agent.get('http://localhost:1337/socrata/tester/'+resourceId+'/FeatureServer')
              .end( function( err, res ) {
                res.should.have.status( 200 );
                should.not.exist(err);
                return done();
              });
      });

      it('should return 200 when accessing item as a featureservice layer', function(done) {
          agent.get('http://localhost:1337/socrata/tester/'+resourceId+'/FeatureServer/0')
              .end( function( err, res ) {
                res.should.have.status( 200 );
                should.not.exist(err);
                return done();
              });
      });

      it('should return 200 when accessing item as a featureservice query', function(done) {
          agent.get('http://localhost:1337/socrata/tester/'+resourceId+'/FeatureServer/0/query')
              .end( function( err, res ) {
                res.should.have.status( 200 );
                should.not.exist(err);
                return done();
              });
      });

    });

});
