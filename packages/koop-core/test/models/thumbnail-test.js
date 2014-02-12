var should = require('should');

before(function (done) {
  thumb = require('../../api/models/Thumbnail.js');
  data = require('../fixtures/snow.geojson');
  done();
});

describe('Thumbnail Model', function(){

    describe('when filtering via where', function(){
      it('should return features that match where clause', function(done){
        Query.filter( data, { where: '1=1' }, function( err, service ){
          service.should.be.an.instanceOf(Object);
          service.features.length.should.equal( data.features.length );
          done();
        });
      });

    });

});

