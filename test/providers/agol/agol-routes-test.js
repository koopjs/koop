var should = require('should');
var path = require('path');
var superagent = require('superagent');

before(function (done) {
  global['agol'] = require('../../../api/providers/agol/models/AGOL.js');
  Mongo = require('../../../api/models/Mongo.js');
  Cache = require('../../../api/models/Cache.js');
  var redis = require("redis");
  Cache.redis = redis.createClient();
  Cache.db = Mongo.connect( 'localhost:27017/koop?auto_reconnect=true&poolSize=10', {safe:false} );
  done();
});

after(function( done ){
  var agent = superagent.agent();
  agent.del('http://localhost:1337/agol/tester')
    .end( function( err, res ) {
      done();
    });
});

describe('FeatureService Proxy Provider', function(){

    var agent = superagent.agent();

    describe('/agol routes', function() {
      it('register should return 500 when POSTing w/o a host', function(done) {
          agent.post('http://localhost:1337/agol/register')
          .end( function( err, res ) {
            res.should.have.status( 500 );
            return done();
          });
      });

      it('register should return 200 when POSTing w/o a host', function(done) {
          var id = 'tester';
          agent.post('http://localhost:1337/agol/register')
          .send({ host: 'arcgis.com', id: id })
          .end( function( err, res ) {
            var json = res.body;
            json.serviceId.should.not.equal( null );
            res.should.have.status( 200 );
            return done();
          });
      });

      it('register should return 200 when GETing all registered providers', function(done) {
          agent.get('http://localhost:1337/agol')
          .end( function( err, res ) {
            var json = res.body;
            res.should.have.status( 200 );
            return done();
          });
      });

      it('should return 200 when GETing a registered provider', function(done) {
          agent.get('http://localhost:1337/agol/tester')
          .end( function( err, res ) {
            var json = res.body;
            json[0].host.should.equal('arcgis.com');
            res.should.have.status( 200 );
            return done();
          });
      });

      it('should register and return 200 when accessing an item', function(done) {
          var id = 'dcdev';
          agent.post('http://localhost:1337/agol/register')
          .send({ host: 'http://dcdev.maps.arcgis.com', id: id })
          .end( function( err, res ) {
            var json = res.body;
            json.serviceId.should.not.equal( null );
            res.should.have.status( 200 );

            agent.get('http://localhost:1337/agol/dcdev/9f44b197ff9444559c46cb2994dd618d')
              .end( function( err, res ) {
                should.not.exist(err);
                var item = res.body;
                item.id.should.equal( '9f44b197ff9444559c46cb2994dd618d' );
                res.should.have.status( 200 );
                return done();
              });
          });
      });

      it('should return 200 when accessing item data', function(done) {
          agent.get('http://localhost:1337/agol/dcdev/9f44b197ff9444559c46cb2994dd618d/data')
              .end( function( err, res ) {
                res.should.have.status( 200 );
                should.not.exist(err);
                var item = res.body;
                item.data.should.not.equal( null );
                item.id.should.equal( '9f44b197ff9444559c46cb2994dd618d' );
                return done();
              });
      });

      /*it('should return 200 when accessing item as a featureservice', function(done) {
          agent.get('http://localhost:1337/agol/dcdev/9f44b197ff9444559c46cb2994dd618d/FeatureServer')
              .end( function( err, res ) {
                res.should.have.status( 200 );
                should.not.exist(err);
                return done();
              });
      });*/

      it('should return 200 when accessing item as a featureservice layer', function(done) {
          agent.get('http://localhost:1337/agol/dcdev/9f44b197ff9444559c46cb2994dd618d/FeatureServer/0')
              .end( function( err, res ) {
                //console.log('back');
                //var json = res.body;
                //console.log(json);
                res.should.have.status( 200 );
                should.not.exist(err);
                return done();
              });
      });

      /*it('should return 200 when accessing item as a featureservice query', function(done) {
          agent.get('http://localhost:1337/agol/dcdev/9f44b197ff9444559c46cb2994dd618d/FeatureServer/0/query')
              .end( function( err, res ) {
                res.should.have.status( 200 );
                should.not.exist(err);
                return done();
              });
      });*/

    });

});
