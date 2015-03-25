var should = require('should'),
  fs = require('fs');

var snowData, exporter, koop;

before(function (done) {
  snowData = require('../fixtures/snow.geojson');
  exporter = require('../../lib/Exporter.js');
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

        exporter.exportToFormat(format, dir, key, snowData, {}, function( err, res ){
          var exists = fs.existsSync(res.file);
          exists.should.equal(true);
          done();
        });
      });
    });

    describe('when exporting large data', function(){
      it('should return an err when not given a format', function(done){
        var format = null,
          key = 'snow-data';

        exporter.exportLarge({}, format, 'dummy', key, 'agol', {}, function(){}, function( err, res ){
          done();
        });
      });
    });

    describe('when creating paths for exports', function(){
      it('should return an object with files and paths', function(done){
        var format = 'csv',
          dir = 'testdir',
          key = 'testkey';

        var options = {
          name: 'dummy'
        };

        var paths = exporter.createPaths(dir, key, format, options);
        paths.base.should.equal('.//files/'+dir+'/'+key);
        paths.newFile.should.equal('dummy.csv');
        done();
      });
    });

    describe('when creating ogr params for exports', function(){
      it('should create a correct ogr string of commands', function(done){
        var format = 'csv',
          inFile = 'infile.json',
          outFile = 'outfile.csv';

        var options = {
          name: 'dummy'
        };

        var params = exporter.getOgrParams(format, inFile, outFile, null, options).split(' ');
        params[6].should.equal(outFile);
        params[7].should.equal(inFile);
        done();
      });

      it('should create a correct ogr string of commands with a WKID', function(done){
        var format = 'shp',
          inFile = 'infile.json',
          outFile = 'outfile.shp';

        var options = {
          name: 'dummy',
          wkid: 2962
        };

        var params = exporter.getOgrParams(format, inFile, outFile, null, options).split(' ');
        params[9].should.equal('"EPSG:2962"');
        done();
      });
    });

});

