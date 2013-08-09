var should = require('should');
var fs = require('../../api/models/FeatureServices.js');
var data = require('../fixtures/snow.geojson');

before(function (done) {
  Query = require('../../api/models/Query.js');
  done();
});

describe('FeatureServices Model', function(){

    describe('when determining esri field types', function() {
      it('should return an esriFieldTypeString for a string', function(done) {
          var type = fs.fieldType('a string');
          (type).should.equal('esriFieldTypeString');
          done();
      });

      it('should return an esriFieldTypeDouble for a float', function(done) {
          var type = fs.fieldType(10.1);
          (type).should.equal('esriFieldTypeDouble');
          done();
      });

      it('should return an esriFieldTypeInteger for an integer', function(done) {
          var type = fs.fieldType(10);
          (type).should.equal('esriFieldTypeInteger');
          done();
      });
    });

    describe('when building esri fields', function() {

      var input = {
        propInt: 10,
        propFloat:10.1,
        propString:'Awesome'
      };
      var fields = fs.fields( input );

      it('attributes should be an array', function(done) {
          fields.should.be.an.instanceOf(Array);
          done();
      });

      it('attributes should contain a double, int, and string', function(done) {
          fields.forEach(function(f){
            f.should.have.property('type');
            f.should.have.property('name');
            f.should.have.property('alias');
          });
          fields[0].type.should.equal('esriFieldTypeInteger'); 
          fields[1].type.should.equal('esriFieldTypeDouble'); 
          fields[2].type.should.equal('esriFieldTypeString'); 
          done();
      });
    });

    describe('when getting featureserver info from geojson', function(done){
      it('should return a valid feature service object', function(done){
        fs.info( data, 0, {}, function( service ){
          service.should.be.an.instanceOf(Object);
          service.fields.should.be.an.instanceOf(Array);
          done();
        });
      });
    });

    describe('when getting featureserver features from geojson', function(){
      it('should return a valid features', function(done){
        fs.query( data, {}, function( service ){
          service.should.be.an.instanceOf(Object);
          service.fields.should.be.an.instanceOf(Array);
          service.features.should.be.an.instanceOf(Array);
          service.features.forEach(function( feature ){
            feature.should.have.property('geometry');
            feature.should.have.property('attributes');
          });
          done();
        });
      });
    });

    describe('when getting featureserver features by id queries', function(){
      it('should return a proper features', function(done){
        fs.query( data, { objectIds: [ 1, 2, 3 ]}, function( service ){
          service.should.be.an.instanceOf(Object);
          service.fields.should.be.an.instanceOf(Array);
          service.features.should.have.length( 3 );
          done();
        });
      });
    });

    describe('when getting features with returnCountOnly', function(){
      it('should return only count of features', function(done){
        fs.query( data, { returnCountOnly: true, objectIds: [ 1, 2, 3 ]}, function( service ){
          service.should.be.an.instanceOf(Object);
          service.should.have.property('count');
          service.count.should.equal( 3 );
          done();
        });
      });
    });

    describe('when getting features with returnIdsOnly', function(){
      it('should return only ids of features', function(done){
        fs.query( data, { returnIdsOnly: true, objectIds: [ 1, 2, 3 ]}, function( service ){
          service.should.be.an.instanceOf(Object);
          service.should.have.property('objectIds');
          service.objectIds.length.should.equal( 3 );
          done();
        });
      });
    });

    describe('when filtering features with a geometry', function(){
      it('should return geometries that are contained', function(done){
        fs.query( data, { 
          geometry: '-110,30,-106,50', 
          geometryType: 'esriGeometryEnvelope'
        }, function( service ){
            service.should.be.an.instanceOf(Object);
            service.features.length.should.equal( 100 );
            done();
        });
      });
    });

    //http://localhost:1337/github/geobabbler/geodata/geojson-border_crossings/FeatureServer/0/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22xmin%22%3A-20037508.342788905%2C%22ymin%22%3A1820609.8834746983%2C%22xmax%22%3A-10018754.171396958%2C%22ymax%22%3A11839364.054866645%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&geometryType=esriGeometryEnvelope&inSR=102100&outFields=id&outSR=102100

    describe('when filtering features with a geometry and outSR', function(){
      it('should return geometries that are contained', function(done){
        fs.query( data, {
          //geometry: '-110,30,-106,50',
          //geometry: {xmin: -20037508.342788905, ymin: 1820609.8834746983, xmax: -10018754.171396958, ymax: 11839364.054866645, spatialReference:{wkid:102100}},
          geometry: {xmin: -110, ymin: 30, xmax: -106, ymax: 50, spatialReference: { wkid: 4326 }},
          geometryType: 'esriGeometryEnvelope',
        }, function( service ){
            service.should.be.an.instanceOf(Object);
            service.features.length.should.equal( 100 );
            done();
        });
      });
    });

    describe('when filtering features with a geometry and outSR', function(){
      it('should return geometries that are contained', function(done){
        fs.query( data, {
          geometry: {xmin: -110, ymin: 30, xmax: -106, ymax: 50, spatialReference: { wkid: 4326 }},
          geometryType: 'esriGeometryEnvelope',
          spatialRel: 'esriSpatialRelContains'
        }, function( service ){
            service.should.be.an.instanceOf(Object);
            service.features.length.should.equal( 100 );
            done();
        });
      });
    });

    describe('when filtering features with where clauses', function(){
      it('should return filtered features with less than', function(done){
        fs.query( data, {
          where: 'latitude < 39.9137'
        }, function( service ){
            service.should.be.an.instanceOf(Object);
            service.features.length.should.equal( 261 );
            done();
        });
      });
      it('should return filtered features with greater than', function(done){
        fs.query( data, {
          where: 'latitude > 39.9137'
        }, function( service ){
            service.should.be.an.instanceOf(Object);
            service.features.length.should.equal( 144 );
            done();
        });
      });
      it('should return filtered features with equal', function(done){
        fs.query( data, {
          where: 'latitude = 39.9137'
        }, function( service ){
            service.should.be.an.instanceOf(Object);
            service.features.length.should.equal( 1 );
            done();
        });
      });
    });

});

