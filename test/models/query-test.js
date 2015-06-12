var should = require('should');

before(function (done) {
  snowData = require('../fixtures/snow.geojson');
  Query = require('../../lib/Query.js');
  done();
});

describe('Query Model', function(){

    describe('when returning count only', function(){
      it('should return the count', function(done){
        Query.filter( snowData, { returnCountOnly: true }, function( err, service ){
          service.should.be.an.instanceOf(Object);
          service.count.should.equal( snowData.features.length );
          done();
        });
      });
    });

    describe('when returning ids only', function(){
      it('should return an array of object ids', function(done){
        Query.filter( snowData, { returnIdsOnly: true, idField: 'station' }, function( err, service ){
          service.should.be.an.instanceOf(Object);
          service.objectIds.should.be.an.instanceOf(Array);
          service.objectIdField.should.equal( 'station' );
          service.objectIds.length.should.equal( snowData.features.length );
          done();
        });
      });
    });

    describe('when not returning geometrys', function(){
      it('should return an array of features with no geometries', function(done){
        Query.filter( snowData, { returnGeometry: false }, function( err, service ){
          service.should.be.an.instanceOf(Object);
          service.features[0].should.not.have.property( 'geometry' );
          done();
        });
      });
    });

    describe('when not returning geometrys', function(){
      it('should return an array of features with no geometries', function(done){
        Query.filter( snowData, { returnGeometry: false }, function( err, service ){
          service.should.be.an.instanceOf(Object);
          service.features[0].should.not.have.property( 'geometry' );
          done();
        });
      });
    });

    describe('when filtering outFields', function(){
      it('should return features with only given outFields', function(done){
        Query.filter( snowData, { outFields: 'station' }, function( err, service ){
          service.should.be.an.instanceOf(Object);
          service.features[0].properties.should.have.property( 'station' );
          service.features[0].properties.should.not.have.property( 'latitude' );
          done();
        });
      });
    });

    describe('when filtering via where', function(){
      var snow = require('../fixtures/snow.geojson');
      it('should return features that match where clause', function(done){
        Query.filter( snowData, { where: '1=1' }, function( err, service ){
          service.should.be.an.instanceOf(Object);
          service.features.length.should.equal( snowData.features.length );
          done();
        });
      });

      it('should return features that match where clause', function(done){
        Query.filter( snowData, { where: 'latitude > 39.9', outFields: '*' }, function( err, service ){
          service.should.be.an.instanceOf(Object);
          service.features.length.should.equal( snowData.features.length );
          done();
        });
      });
    });

    describe('when requesting data with outStatistics', function(){
      var snow = require('../fixtures/snow.geojson');

      it('should return an error when outStatistics params fails', function(done){
        Query.filter( snowData, { outStatistics : 'xx11xx' }, function( err, service ){
          err.should.not.equal(null);
          should.not.exist( service );
          done();
        });
      });

      it('should return json when outStatistics params is proper', function(done){
        var snow = require('../fixtures/snow2.geojson');
        Query.outStatistics( snow[0], { outStatistics : '[{"statisticType":"min","onStatisticField":"total precip","outStatisticFieldName":"min_precip"}]' }, function( err, service ){
          should.not.exist( err );
          should.exist( service );
          service.fields.should.be.an.instanceOf(Array);
          service.features.should.be.an.instanceOf(Array);
          done();
        });
      });
    });

    describe('when grouping stats', function(){
      it( 'should return json when grouping stats by a field', function( done ){
        var snow3 = require('../fixtures/snow3.geojson');
        Query.outStatistics( snow3[0], { groupByFieldsForStatistics: 'total precip', outStatistics : '[{"statisticType":"count","onStatisticField":"total precip","outStatisticFieldName":"total_precip_COUNT"}]' }, function( err, service ){
          should.not.exist( err );
          should.exist( service );
          service.fields.should.be.an.instanceOf(Array);
          service.features.should.be.an.instanceOf(Array);
          done();
        });
      });
    });

});

