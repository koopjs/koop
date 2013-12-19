var request = require('request');

var Socrata = function(){

  // adds a service to the Cache.db
  // needs a host, generates an id 
  this.register = function( id, host, callback ){
    var type = 'socrata:services';
    //var id = (new Date()).getTime();
    Cache.db.services.count( type, function(error, count){
      id = id || count++;
      Cache.db.services.register( type, {'_id': id, 'host': host},  function( err, success ){
        callback( err, id );
      });
    });
  };

  this.remove = function( id, callback ){
    Cache.db.services.remove( 'socrata:services', parseInt(id) || id,  callback);
  }; 

  // get service by id, no id == return all
  this.find = function( id, callback ){
    Cache.db.services.get( 'socrata:services', parseInt(id) || id, callback);
  };

  this.socrata_path = '/resource/';

  // got the service and get the item
  this.getResource = function( host, id, options, callback ){
    var self = this;
    var url = host + this.socrata_path + id + '.json';
    request.get(url, function(err, data ){
      if (err) {
        callback(err, null);
      } else {
        self.toGeojson( JSON.parse( data.body ), function(err, geojson){
          geojson.name = id;
          callback( err, geojson );
        });
      }
    }); 
  };

  this.toGeojson = function(json, callback){
    if (!json || !json.length){
      callback('Error converting data to geojson', null);
    } else {
      var geojson = {type: 'FeatureCollection', features: []};
      var geojsonFeature;
      json.forEach(function(feature, i){
        geojsonFeature = {type: 'Feature', geometry: {}, id: i+1};
        if (feature){
          if (feature.location && feature.location.latitude && feature.location.longitude){
            geojsonFeature.geometry.coordinates = [parseFloat(feature.location.longitude), parseFloat(feature.location.latitude)];
            geojsonFeature.geometry.type = 'Point';
            delete feature.location;
          } 
          if (feature.latitude && feature.longitude){
            geojsonFeature.geometry.coordinates = [parseFloat(feature.longitude), parseFloat(feature.latitude)];
            geojsonFeature.geometry.type = 'Point';
            delete feature.latitude;
            delete feature.longitude;
          }
          geojsonFeature.properties = feature;
          geojson.features.push( geojsonFeature );
        }
      });
      callback(null, geojson);
    }
  };

}
  

module.exports = new Socrata();
  
