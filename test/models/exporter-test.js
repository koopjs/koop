var should = require('should'),
  fs = require('fs');

var snowData, exporter, koop;

before(function (done) {
  var Cache = {
    data_dir: __dirname + '/output/'
  };
  snowData = require('../fixtures/snow.geojson');
  var Exporter = require('../../lib/Exporter.js');
  koop = require('../../lib/index');
  koop.config = {};
  koop.files = require('../../lib/Files.js')( { config: {} } );
  exporter = new Exporter( koop );
  done();
});

describe('exporter Model', function(){

    describe('when exporting geojson', function(){

      it('should return an err when not given a format', function(done){
         var format = null,
          dir = 'json',
          key = 'snow-data';

        exporter.exportToFormat(format, dir, key, snowData, {}, function( err, file ){
          should.exist(err);
          should.not.exist(file);
          done();
        });
      });     
 
      it('should return a pointer to file', function(done){
        var format = 'json',
          dir = 'json',
          key = 'snow-data';

        exporter.exportToFormat(format, dir, key, snowData, {}, function( err, file ){
          var exists = fs.existsSync(file);
          exists.should.equal(true);
          done();
        });
      });
    });

    describe('when exporting large data', function(){
      it('should return an err when not given a format', function(done){
        var format = null,
          key = 'snow-data';

        exporter.exportLarge(format, 'dummy', key, 'agol', {}, function( err, res ){
          done();
        });
      });
    });

});

