var should = require('should');

before(function (done) {
  key = 'test/repo/file';
  repoData = require('../fixtures/repo.geojson');
  Cache = require('../../api/models/Cache.js');
  Cache.redis = false;
  done();
});

describe('Cache Model', function(){

    describe('when caching a github file', function(){
    
      it('should error when missing key is sent', function(done){
        Cache.get('repo', key+'-BS', function( err, data ){
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
            Cache.get('repo', key, function(err, result){
              should.exist( err );
              done();
            });
          });
        });
      });

      it('should insert and get the sha', function(done){
        Cache.insert( 'repo', key, repoData, function( error, success ){
          should.not.exist(error);
          success.should.equal( true );
          Cache.get('repo', key, function( err, d ){
            should.not.exist(err);
            d.should.be.an.instanceOf( Array );
            done();
          });
        });
      });
    });

});

