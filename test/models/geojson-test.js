var should = require('should');

before(function (done) {
  esri_json = require('../fixtures/ski.geojson');
  GeoJSON = require('../../lib/GeoJSON.js');
  done();
});

describe('GeoJSON Model', function(){

    describe('when converting esri style features to geojson', function(){
      it('should return a proper geojson object', function(done){
        GeoJSON.fromEsri( [], esri_json, function( err, geojson ){
          geojson.should.be.an.instanceOf(Object);
          geojson.features.length.should.equal(esri_json.features.length);
          done();
        });
      });
    });
  

});

