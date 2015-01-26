var should = require('should');
   
var opts = { styleFile: __dirname+'/../fixtures/style.xml' };

before(function (done) {
  data = require('../fixtures/11.geojson');
  koop = require('../../lib/index');
  tiles = new require('../../lib/Tiles.js')( koop );
  done();
});

describe('Mapnik Tiles Model', function(){


    describe('errors when params are wrong', function(){
      it('when missing a z', function(done){
        tiles.get( {x: 1, y: 1, format: 'png', key: 'fake-key'}, opts, function( err, res ){
          should.exist(err);
          should.not.exist(res);
          done();
        });
      });
    });

    describe('vector-tiles', function(){
      it('when creating a tile', function(done){
        var file = __dirname + '/../fixtures/co.6.13.24.vector.pbf',
          format = 'vector.pbf';

        tiles._stash( file, format, data, 6, 12, 24, opts, function( err, res ){
          should.not.exist(err);
          should.exist(res);
          done();
        });
      });

       it('when creating a tile', function(done){
        var file = __dirname + '/../fixtures/5.5.12.vector.pbf',
          format = 'vector.pbf';

        tiles._stash( file, format, data, 5, 5, 11, opts, function( err, res ){
          should.not.exist(err);
          should.exist(res);
          done();
        });
      });
    });

    describe('png-tiles', function(){
      it('when creating a tile', function(done){

        var file = __dirname + '/../fixtures/5.5.12.png',
          format = 'png';

        tiles._stash( file, format, data, 5, 5, 12, opts, function( err, res ){
          should.not.exist(err);
          should.exist(res);
          done();
        });
      });
    });

    describe('utf-tiles', function(){
      it('when creating a tile', function(done){

        var file = __dirname + '/../fixtures/5.5.12.utf',
          format = 'utf';

        tiles._stash( file, format, data, 5, 5, 12, opts, function( err, res ){
          should.not.exist(err);
          should.exist(res);
          done();
        });
      });
    });

});

