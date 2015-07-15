var should = require('should');

before(function (done) {
  insertKey = 'test:repo:file';
  key = 'test:repo:file:0';
  repoData = require('../fixtures/repo.geojson');
  repoData[0].info = {name: 'somename'};
  Cache = require('../../lib/Local.js');
  done();
});

describe('Local Cache Tests', function(){

    describe('when requesting bogus data', function(){
      it('should error when missing key is sent', function(done){
        Cache.select(key + '-fake', {}, function( err, data ){
          should.exist( err );
          done();
        });
      });
    });

    describe('when caching geojson', function(){

      beforeEach(function(done){
        Cache.insert( insertKey, repoData[0], 0, function( error, success ){
          done();
        });
      });

      afterEach(function(done){
        Cache.remove(key, done);
      });

      it('should remove the data', function(done){
          Cache.remove(key, function( err, d ){
            should.not.exist( err );
            Cache.select( key, {}, function( err, result ){
              should.exist( err );
              done();
            });
          });
      });

      it('should get the name', function(done){
          Cache.select(key, {}, function( err, d ){
            should.not.exist(err);
            should.exist(d[0].name);
            d[0].name.should.equal('forks.geojson');
            done();
          });
      });

      it('should get count', function(done){
          Cache.getCount(key, {}, function( err, count ){
            should.not.exist(err);
            should.exist(count);
            count.should.equal(417);
            done();
          });
      });

      it('should get info', function(done){
          Cache.getInfo(key, function( err, info ){
            should.not.exist(err);
            should.exist( info );
            done();
          });
      });

      it('should update info', function(done){
          Cache.updateInfo( key, {'name': 'newname'}, function( err, success ){
            should.not.exist( err );
            Cache.getInfo(key, function( err, info ){
              should.exist(info);
              info.name.should.equal('newname');
              done();
            });
          });
      });

    });

    describe('when setting/getting timers', function(){
      var table = 'timer';
      var len = 10000;

      it('should return false when no timer exists', function (done) {
        Cache.timerGet(table, function (err, timer) {
          timer.should.equal(false);
          done();
        })
      });

      it('should return the timer when a timer is set', function (done) {
        Cache.timerSet(table, len, function (err, timer) {
          should.exist(timer);
          Cache.timerGet(table, function (err, timer) {
            should.exist(timer);
            done();
          });
        })
      });

      it('should return false when a timer expires', function (done) {
        Cache.timerSet(table, 100, function () {
          setTimeout(function () {
            Cache.timerGet(table, function (err, timer) {
              timer.should.equal(false);
              done();
            });
          }, 500);
        });
      });

    });

});
