var should = require('should');

before(function (done) {
  fs = require('../../api/models/FeatureServices.js');
  data = require('../fixtures/snow.geojson');
  Query = require('../../api/models/Query.js');
  done();
});

describe('Query Model', function(){

    describe('when returning count only', function(){
      it('should return the count', function(done){
        Query.filter( data, { returnCountOnly: true }, function( service ){
          service.should.be.an.instanceOf(Object);
          service.count.should.equal( data.features.length );
          done();
        });
      });
    });

    describe('when returning ids only', function(){
      it('should return an array of object ids', function(done){
        Query.filter( data, { returnIdsOnly: true, idField: 'station' }, function( service ){
          service.should.be.an.instanceOf(Object);
          service.objectIds.should.be.an.instanceOf(Array);
          service.objectIdField.should.equal( 'station' );
          service.objectIds.length.should.equal( data.features.length );
          done();
        });
      });
    });

    describe('when not returning geometrys', function(){
      it('should return an array of features with no geometries', function(done){
        Query.filter( data, { returnGeometry: false }, function( service ){
          service.should.be.an.instanceOf(Object);
          service.features[0].should.not.have.property( 'geometry' );
          done();
        });
      });
    });

    describe('when not returning geometrys', function(){
      it('should return an array of features with no geometries', function(done){
        Query.filter( data, { returnGeometry: false }, function( service ){
          service.should.be.an.instanceOf(Object);
          service.features[0].should.not.have.property( 'geometry' );
          done();
        });
      });
    });

    describe('when filtering outFields', function(){
      it('should return features with only given outFields', function(done){
        Query.filter( data, { outFields: 'station' }, function( service ){
          service.should.be.an.instanceOf(Object);
          service.features[0].properties.should.have.property( 'station' );
          service.features[0].properties.should.not.have.property( 'latitude' );
          done();
        });
      });
    });

});

