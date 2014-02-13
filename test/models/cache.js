var should = require('should'),
  mongo = require('mongoskin');

before(function (done) {
  key = 'test/repo/file';
  snowData = require('../fixtures/snow2.geojson');
  global['gist'] = require('../../api/providers/gist/models/Gist.js');
  PostGIS = require('../../api/models/PostGIS.js');
  Cache = require('../../api/models/Cache.js');

  // use mongo to store data 
  Cache.db = PostGIS.connect( 'postgres://localhost/koopdev' );
  done();
});

describe('Mongo Cache Model', function(){

    describe('when caching a github file', function(){

      it('should error when missing key is sent', function(done){
        Cache.get('repo', key+'-BS', {}, function( err, data ){
          should.exist( err );
          done();
        });
      });

      it('should insert and remove the data', function(done){
        Cache.insert( 'repo', key, snowData, function( error, success ){
          console.log('cache, insert, remove', error, success);
          should.not.exist(error);
          success.should.equal( true );
          done();
          /*Cache.remove('repo', key, function( err, d ){
            should.not.exist(err);
            //d.should.equal( true );
            Cache.get('repo', key, {}, function(err, result){
              should.exist( err );
            });
          });*/
        });
      });

    /*  it('should insert and get the sha', function(done){
        Cache.insert( 'repo', key, repoData, function( error, success ){
          should.not.exist(error);
          success.should.equal( true );
          Cache.get('repo', key, {}, function( err, d ){
            should.not.exist(err);
            //d.should.be.an.instanceOf( Array );
            done();
          });
        });
      });*/
    });

});

