var should = require('should');

before(function (done) {
  fs = require('../../api/models/FeatureServices.js');
  data = require('../fixtures/snow.geojson');
  Extent = require('../../api/models/Extent.js');
  done();
});

describe('Extent Model', function(){

    describe('when calculating the extent of features', function(){
      it('should return an entent object in esri format', function(done){
        Extent.bounds( data.features, function( err, extent ){
          console.log(extent.xmin, -108.9395);
          extent.xmin.should.equal(-108.9395);
          extent.ymin.should.equal(37.084968);
          extent.xmax.should.equal(-102);
          extent.ymax.should.equal(40.8877);
          extent.should.be.an.instanceOf(Object);
          done();
        });
      });
    });

});

