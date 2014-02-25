var should = require('should');

before(function (done) {
  fs = require('../../api/models/FeatureServices.js');
  esri_json = require('../fixtures/ski.geojson');
  GeoJSON = require('../../api/models/GeoJSON.js');
  done();
});

describe('GeoJSON Model', function(){

    describe('when converting esri style features to geojson', function(){
      it('should return a proper geojson object', function(done){
        GeoJSON.fromEsri( esri_json, function( err, geojson ){
          geojson.should.be.an.instanceOf(Object);
          geojson.features.length.should.equal(esri_json.features.length);
          done();
        });
      });
    });
  

});

