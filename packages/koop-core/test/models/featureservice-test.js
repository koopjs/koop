var should = require('should');
var fs = require('../../api/models/FeatureServices.js');
var data = require('../fixtures/snow.geojson');
var polyData = require('../fixtures/polygon.geojson');

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
      /*it('should return a valid feature service object', function(done){
        fs.info( data, 0, {}, function( service ){
          service.should.be.an.instanceOf(Object);
          service.fields.should.be.an.instanceOf(Array);
          done();
        });
      });*/

      it('should return a feature service with the proper geom type', function(done){
        //data.features[0].geometry.type = "Polygon";
        /*var copy = JSON.stringify(data);
        var polyData = JSON.parse(copy);
        polyData.features[0].geometry.type = "Polygon";*/
        fs.info( polyData, 0, {}, function( err, service ){
          service.geometryType.should.equal("esriGeometryPolygon");
          done();
        });
      });
    });

    describe('when getting featureserver features from geojson', function(){
      it('should return a valid features', function(done){
        fs.query( data, {}, function( err, service ){
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
        fs.query( data, { objectIds: [ 1, 2, 3 ]}, function( err, service ){
          service.should.be.an.instanceOf(Object);
          service.fields.should.be.an.instanceOf(Array);
          service.features.should.have.length( 3 );
          done();
        });
      });
    });

    describe('when getting features with returnCountOnly', function(){
      it('should return only count of features', function(done){
        fs.query( data, { returnCountOnly: true, objectIds: [ 1, 2, 3 ]}, function( err, service ){
          service.should.be.an.instanceOf(Object);
          service.should.have.property('count');
          service.count.should.equal( 3 );
          done();
        });
      });
    });

    describe('when getting features with returnIdsOnly', function(){
      it('should return only ids of features', function(done){
        fs.query( data, { returnIdsOnly: true, objectIds: [ 1, 2, 3 ]}, function( err,service ){
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
        }, function( err, service ){
            service.should.be.an.instanceOf(Object);
            service.features.length.should.equal( 100 );
            done();
        });
      });
    });


    describe('when filtering features with a geometry and outSR', function(){
      it('should return geometries that are contained', function(done){
        fs.query( data, {
          //geometry: '-110,30,-106,50',
          //geometry: {xmin: -20037508.342788905, ymin: 1820609.8834746983, xmax: -10018754.171396958, ymax: 11839364.054866645, spatialReference:{wkid:102100}},
          geometry: {xmin: -110, ymin: 30, xmax: -106, ymax: 50, spatialReference: { wkid: 4326 }},
          //geometry: {xmin: -258.046875, ymin: -40.58058466412763, xmax: 12.83203125, ymax:81.20141954209073, spatialReference:{wkid: 4326}},
          geometryType: 'esriGeometryEnvelope',
        }, function( err, service ){
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
        }, function( err, service ){
            service.should.be.an.instanceOf(Object);
            service.features.length.should.equal( 100 );
            done();
        });
      });
    });

    describe('when filtering polygon features with a geometry', function(){
      it('should return geometries that are contained by given bounds', function(done){
        fs.query( polyData, {
          geometry: {xmin: -180, ymin: -90, xmax: 180, ymax: 90, spatialReference: { wkid: 4326 }},
          geometryType: 'esriGeometryEnvelope',
          spatialRel: 'esriSpatialRelContains'
        }, function( err, service ){
            service.should.be.an.instanceOf(Object);
            service.features.length.should.equal( 1 );
            done();
        });
      });
    });

    describe('when filtering features with where clauses', function(){
      it('should return filtered features with less than', function(done){
        fs.query( data, {
          where: 'latitude < 39.9137'
        }, function( err, service ){
            service.should.be.an.instanceOf(Object);
            service.features.length.should.equal( 261 );
            done();
        });
      });
      it('should return filtered features with greater than', function(done){
        fs.query( data, {
          where: 'latitude > 39.9137'
        }, function( err, service ){
            service.should.be.an.instanceOf(Object);
            service.features.length.should.equal( 144 );
            done();
        });
      });
      it('should return filtered features with equal', function(done){
        fs.query( data, {
          where: 'latitude = 39.9137'
        }, function( err, service ){
            service.should.be.an.instanceOf(Object);
            service.features.length.should.equal( 1 );
            done();
        });
      });
    });

  /*  [
  {
    "statisticType": "<count | sum | min | max | avg | stddev | var>",
    "onStatisticField": "Field1", 
    "outStatisticFieldName": "Out_Field_Name1"
  },
  {
    "statisticType": "<count | sum | min | max | avg | stddev | var>",
    "onStatisticField": "Field2",
    "outStatisticFieldName": "Out_Field_Name2"
  }  
]*/

    describe('when querying features with false outStatistics params', function(){
      it('should return an error when an empty json string is passed', function(done){
        fs.query( data, {
          outStatistics: '{}'
        }, function( err, service ){
            should.exist( err );
            should.not.exist( service );
            done();
        });
      });
    });

    describe('when querying for statistics', function(){
      it('should return correct fields and features for one stat', function(done){
        fs.query( data, {
          outStatistics: '[{"statisticType": "min", "onStatisticField": "total precip","outStatisticFieldName":"min_precip"}]'
        }, function( err, service ){
            //console.log(service.features[0]['attributes']['min_precip'])
            service.should.be.an.instanceOf(Object);
            service.fields.length.should.equal( 1 );
            service.features.length.should.equal( 1 );
            service.features[0]['attributes']['min_precip'].should.equal( 0 );
            done();
        });
      });

      it('should return correct number of fields and features for 2 stats', function(done){
        fs.query( data, {
          outStatistics: '[{"statisticType": "min", "onStatisticField": "total precip","outStatisticFieldName":"min_precip"},{"statisticType": "max", "onStatisticField": "total precip","outStatisticFieldName":"max_precip"}]'
        }, function( err, service ){
            // console.log(service.features[0]['attributes']['max_precip'])
            service.should.be.an.instanceOf(Object);
            service.fields.length.should.equal( 2 );
            service.features.length.should.equal( 1 );
            service.features[0]['attributes']['min_precip'].should.equal( 0 );
            service.features[0]['attributes']['max_precip'].should.equal( 1.5 );
            done();
        });
      });

      it('should return correct number of fields and features for 2 stats', function(done){
        fs.query( data, {
          outStatistics: '[{"statisticType": "count", "onStatisticField": "total precip","outStatisticFieldName":"count_precip"}]'
        }, function( err, service ){
            //console.log(service.features[0]['attributes']['count_precip'])
            service.should.be.an.instanceOf(Object);
            service.fields.length.should.equal( 1 );
            service.features.length.should.equal( 1 );
            service.features[0]['attributes']['count_precip'].should.not.equal( 0 );
            done();
        });
      });

      it('should return correct number of fields and features for sum stats', function(done){
        fs.query( data, {
          outStatistics: '[{"statisticType": "sum", "onStatisticField": "total precip","outStatisticFieldName":            "sum_precip"}]'
        }, function( err, service ){
            //console.log(service.features[0]['attributes']['sum_precip'])
            service.should.be.an.instanceOf(Object);
            service.fields.length.should.equal( 1 );
            service.features.length.should.equal( 1 );
            service.features[0]['attributes']['sum_precip'].should.equal( 135.69000000000003 );
            done();
        });
      });

      it('should return correct number of fields and features for avg stats', function(done){
        fs.query( data, {
          outStatistics: '[{"statisticType": "avg", "onStatisticField": "total precip","outStatisticFieldName":              "avg_precip"}]'
        }, function( err, service ){
            service.features[0]['attributes']['avg_precip'].should.equal( 0.3253956834532375 );
            done();
        });
      });

      it('should return correct number of fields and features for var/stddev stats', function(done){
        fs.query( data, {
          outStatistics: '[{"statisticType": "var", "onStatisticField": "total precip","outStatisticFieldName":              "var_precip"},{"statisticType": "stddev", "onStatisticField": "total precip","outStatisticFieldName":              "stddev_precip"}]'
        }, function( err, service ){
            service.features[0]['attributes']['var_precip'].should.equal( 0.07643107844659537 );
            service.features[0]['attributes']['stddev_precip'].should.equal( 0.27646171244242007 );
            done();
        });
      });

    });

});

