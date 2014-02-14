var should = require('should'),
  mongo = require('mongoskin');

before(function (done) {
  key = 'test/repo/file';
  repoData = require('../fixtures/repo.geojson');
  global['gist'] = require('../../api/providers/gist/models/Gist.js');
  PostGIS = require('../../api/models/PostGIS.js');
  Cache = require('../../api/models/Cache.js');

  table = "repo:test/repo/file:0";

  // use mongo to store data 
  Cache.db = PostGIS.connect( 'postgres://localhost/koopdev' );
  done();
});

describe('Mongo Cache Model', function(){

    describe('when caching a github file', function(){

      afterEach(function(done){
        Cache.remove('repo', key, done);
      });

      it('should error when missing key is sent', function(done){
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
            Cache.get('repo', key, {}, function(err, result){
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
          Cache.get('repo', key, {}, function( err, d ){
            should.not.exist(err);
            should.exist(d[0].sha);
            d[0].sha.should.equal('e3729d510e786be80126225579214a78cf06e7a1');
            done();
          });
        });
      });
    });

});

