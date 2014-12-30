var should = require('should');

var data, koop, tiles; 

before(function (done) {
  data = require('../fixtures/5.5.12.geojson');
  koop = require('../../lib/index');
  tiles = new require('../../lib/Tiles.js')( koop );
  done();
});

describe('Tiles Model', function(){

    describe('errors when params are wrong', function(){
      it('when missing a z', function(done){
        tiles.get( {x: 1, y: 1, format: 'png', key: 'fake-key'}, {}, function( err, res ){
          should.exist(err);
          should.not.exist(res);
          done();
        });
      });
    });

});

