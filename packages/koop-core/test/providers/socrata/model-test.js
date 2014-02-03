var should = require('should');
var path = require('path');
var superagent = require('superagent');

var model, data;


before(function (done) {
  model = require('../../../api/providers/socrata/models/Socrata');
  data = require('../../fixtures/earthquakes.json');
  done();
});

after(function( done ){
  done();
});


describe('Socrata Model', function(){

    describe('socrata model methods', function() {
      it('toGeoJSON should err when given no data', function(done) {
        model.toGeojson([], 'location', function(err, geojson){
          should.exist(err);
          should.not.exist( geojson );
          return done();
        });
      });

      it('toGeoJSON should return geojson', function(done) {
        model.toGeojson(data, 'location', function(err, geojson){
          should.not.exist(err);
          should.exist( geojson );
          geojson.features.length.should.not.equal(0);
          return done();
        });
      });

    });

});

