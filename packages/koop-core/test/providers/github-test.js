var should = require('should');

before(function (done) {
  key = 'test/repo/file';
  snowKey = 'chelm/geodata/snow';
  repoData = require('../fixtures/repo.geojson');
  snowData = require('../fixtures/snow.geojson');
  global['gist'] = require('../../api/providers/gist/models/Gist.js');
  Mongo = require('../../api/models/Mongo.js');
  Cache = require('../../api/models/Cache.js');
  var redis = require("redis");
  Cache.redis = redis.createClient();
  Cache.db = Mongo.connect( 'localhost:27017/koop?auto_reconnect=true&poolSize=10', {safe:false} );
  done();
});

describe('Cache Model', function(){

    describe('when caching a github file', function(){
    
      /*it('should error when missing key is sent', function(done){
        Cache.get('repo', key+'-BS', {}, function( err, data ){
          should.exist( err );
          done();
        });
      });

      it('should insert and remove the data', function(done){
        Cache.insert( 'repo', key, repoData, function( error, success ){
          should.not.exist(error);
          success.should.equal( true );
          Cache.remove('repo', key, function( err, d ){
            should.not.exist(err);
            d.should.equal( true );
            Cache.get('repo', key, {}, function(err, result){
              should.exist( err );
              done();
            });
          });
        });
      });*/

      /*it('should insert and get the sha', function(done){
        Cache.insert( 'repo', key, repoData, function( error, success ){
          should.not.exist(error);
          success.should.equal( true );
          Cache.get('repo', key, {}, function( err, d ){
            should.not.exist(err);
            d.should.be.an.instanceOf( Array );
            done();
          });
        });
      });*/
    });

    describe('when caching snow data', function(){
      var type = 'Github',
        options = {geometry: {xmin: -110, ymin: 30, xmax: -106, ymax: 50, spatialReference: { wkid: 4326 }}};

      it('should spatially select the data', function(done){
        Cache.remove( type, snowKey, function( err, d ){
          Cache.insert( type, snowKey, [snowData], function( error, success ){
            should.not.exist(error);
            success.should.equal( true );
            Cache.get( type, snowKey, options, function(err, data){
              should.not.exist(error);
              data[0].features.length.should.equal( 101 );
              done();
            });
          });
        });
      });
    });
});

