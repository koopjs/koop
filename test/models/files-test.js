var should = require('should'),
  koop = require('../../lib/index');
  Files = require('../../lib/Files.js');

var config = { logfile: __dirname + "/../test.log" };

// init the koop log based on config params 
koop.log = new koop.Logger( config );

before(function (done) {
  koop.config = config;
  done();
});

describe('Files', function(){

    describe('when initializing files', function(){
      it('local and S3 storage should be false when nothing is configured', function(done){
        // init with an empty dir 
        var files = new Files( koop );
        files.localDir.should.equal( false );
        files.s3Bucket.should.equal( false );
        done();
      });
      it('local storage should be configured when passing a local dir', function(done){
        // init with a local dir 
        var dir = __dirname + '/output' 
        var files = new Files( { log: koop.log, config: { data_dir: dir } });
        files.localDir.should.equal( dir );
        files.s3Bucket.should.equal( false );
        done();
      });
      it('local storage and s3 should be configured when passing a local dir and a bucket', function(done){
        // init with a local dir 
        var dir = __dirname + '/output',
          bucket = 'test-bucket';
        var files = new Files( { log: koop.log, config: { data_dir: dir, s3: { bucket: bucket } } });
        files.localDir.should.equal( dir );
        files.s3Bucket.should.equal( bucket );
        done();
      });
    });

    // -------------- EXISTS --------------- 

    describe('when checking if a file exists', function(){
      it('with local storage a non-existant', function(done){
        var dir = __dirname + '/output';
        var files = new Files( { log: koop.log, config: { data_dir: dir } });
        files.exists( null, 'dummy.png', function( exists ){
          exists.should.equal( false );
          done();
        });
      });
      it('with local storage and existing', function(done){
        var dir = __dirname + '/../fixtures';
        var files = new Files( { log: koop.log, config: { data_dir: dir } });
        files.exists( null, 'repo.geojson', function( exists ){
          exists.should.equal( true );
          done();
        });
      });
      it('with s3 storage a non-existant', function(done){
        var files = new Files( { log: koop.log, config: { s3: { bucket: 'chelm-koop-shoot-local'} } });
        files.exists( null, 'dummy.png', function( exists ){
          exists.should.equal( false );
          done();
        });
      });
    });


    // -------------- PATHS --------------- 

    describe('when getting the path to a file', function(){
      it('should error with local storage and a non-existant file', function(done){
        var dir = __dirname + '/output';
        var files = new Files( { log: koop.log, config: { data_dir: dir } });
        files.path( null, 'dummy.png', function( err, path ){
          should.exist( err );
          done();
        });
      });
      it('should return the path with local storage and an existing file', function(done){
        var dir = __dirname + '/../fixtures';
        var files = new Files( { log: koop.log, config: { data_dir: dir } });
        files.path( null, 'repo.geojson', function( err, path){
          should.not.exist(err);
          should.exist(path);
          done();
        });
      });
      it('should error with s3 storage and a non-existant file', function(done){
        var files = new Files( { log: koop.log, config: { s3: { bucket: 'chelm-koop-shoot-local'} } });
        files.path( null, 'dummy.png', function( err, path ){
          should.exist(err);
          should.not.exist(path);
          done();
        });
      });
      it('should return url with s3 storage and an existing file', function(done){
        var files = new Files( { log: koop.log, config: { s3: { bucket: 'chelm-koop-shoot-local'} } });
        files.path( 'test', 'test.json', function( err, path ){
          should.not.exist(err);
          should.exist(path);
          done();
        });
      });
    });


    // -------------- READS --------------- 

    describe('when reading a file', function(){
      it('with local storage', function(done){
        var dir = __dirname + '/../fixtures';
        var files = new Files( { log: koop.log, config: { data_dir: dir } });
        files.read( null, 'repo.geojson', function( err, data ){
          should.not.exist( err );
          should.exist( data );
          done();
        });
      });
    });

    
    // -------------- WRITES --------------- 

    describe('when writing a file', function(){
      it('with local storage', function(done){
        var dir = __dirname + '/output',
          name = 'test.json';
        var files = new Files( { log: koop.log, config: { data_dir: dir } });
        files.write( null, name, JSON.stringify({"say":"yes"}), function( err, success ){
          should.not.exist( err );
          files.exists( null, name, function( exists ){
            exists.should.equal( true );
            done();
          });
        });
      });

      it('with s3 storage', function(done){
        var name = 'test.json',
          dir = null;
        var files = new Files( { log: koop.log, config: { s3: { bucket: 'chelm-koop-shoot-local'} } });
        files.write( dir, name, JSON.stringify({"say":"yes"}), function( err, success ){
          should.not.exist( err );
          files.exists( dir, name, function( exists ){
            exists.should.equal( true );
            done();
          });
        });
      });

      it('with local storage and a subdir', function(done){
        var dir = __dirname + '/output',
          name = 'test.json',
          subdir = 'testfiles';
        
        var files = new Files( { log: koop.log, config: { data_dir: dir } });
        files.write( subdir, name, JSON.stringify({"say":"yes"}), function( err, success ){
          should.not.exist( err );
          files.exists( subdir, name, function( exists ){
            exists.should.equal( true );
            done();
          });
        });
      });
      it('can write a file with s3 storage subdir', function(done){
        var bucket = 'chelm-koop-shoot-local',
          dir = 'test',
          name = 'test.json';
        
        var files = new Files( { log: koop.log, config: { s3: { bucket: bucket } } });
        files.write( dir, name, JSON.stringify({"say":"yes"}), function( err, success ){
          should.not.exist( err );
          files.exists( dir, name, function( exists ){
            exists.should.equal( true );
            done();
          });
        });
      });
    });

    // -------------- REMOVES --------------- 
    describe('when removing a file', function(){
      it('with local storage', function(done){
        var dir = __dirname + '/output',
          name = 'test2.json';
        var files = new Files( { log: koop.log, config: { data_dir: dir } });
        files.write( null, name, JSON.stringify({"say":"yes"}), function( err, success ){
          should.not.exist( err );
          files.remove(null, name, function(err, success){
            files.exists( null, name, function( exists ){
              exists.should.equal( false );
              done();
            });
          });
        });
      });

      it('with s3 storage and subdir', function(done){
        var bucket = 'chelm-koop-shoot-local',
          dir = '/test-rm',
          name = 'test-rm.json';

        var files = new Files( { log: koop.log, config: { s3: { bucket: 'chelm-koop-shoot-local'} } });
        files.write( dir, name, JSON.stringify({"say":"hello goodbye"}), function( err, success ){
          should.not.exist( err );
          files.remove( dir, name, function( err, success ){
            files.exists( dir, name, function( exists ){
              //console.log(exists);
              exists.should.equal( false );
              done();
            });
          });
        });
      });
    });

    // ------------------- REMOVE DIR --------------------

    describe('when removing a dir', function(){
      it('with local storage', function(done){
        var dir = __dirname + '/output',
          subdir = 'subdir',
          name = 'test2.json';
        var files = new Files( { log: koop.log, config: { s3: { bucket: 'chelm-koop-shoot-local'} } });
        files.write( subdir, name, JSON.stringify({"say":"yes"}), function( err, success ){
          should.not.exist( err );
          files.removeDir(subdir, function(err, success){
            files.exists( subdir, name, function( exists ){
              exists.should.equal( false );
              done();
            });
          });
        });
      });
    });

});

