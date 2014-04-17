var request = require('request');

var Socrata = function(){

  // adds a service to the Cache.db
  // needs a host, generates an id 
  this.register = function( id, host, callback ){
    var type = 'socrata:services';
    //var id = (new Date()).getTime();
    Cache.db.services.count( type, function(error, count){
      id = id || count++;
      Cache.db.services.register( type, {'id': id, 'host': host},  function( err, success ){
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
    var self = this,
      type = 'Socrata',
      key = [host,id].join('::'); 

    Cache.get( type, key, options, function(err, entry ){
      if ( err ){
        var url = host + self.socrata_path + id + '.json';
        request.get(url, function(err, data, response ){
          if (err) {
            callback(err, null);
          } else {
            var types = JSON.parse( data.headers['x-soda2-types'] );
              fields = JSON.parse( data.headers['x-soda2-fields'] );
            var locationField;
            types.forEach(function(t,i){
              if (t == 'location'){
                locationField = fields[i];
              } 
            });
            self.toGeojson( JSON.parse( data.body ), locationField, function(err, geojson){
              geojson.updated_at = new Date(data.headers['last-modified']).getTime();
              geojson.name = id;
              Cache.insert( type, key, geojson, 0, function( err, success){
                if ( success ) callback( null, [geojson] );
              });
            });
          }
        });
      } else {
        callback( null, entry );
      }
    });

  };

  this.toGeojson = function(json, locationField, callback){
    if (!json || !json.length){
      callback('Error converting data to geojson', null);
    } else {
      var geojson = {type: 'FeatureCollection', features: []};
      var geojsonFeature;
      json.forEach(function(feature, i){
        geojsonFeature = {type: 'Feature', geometry: {}, id: i+1};
        if (feature && locationField){
          if (feature[locationField] && feature[locationField].latitude && feature[locationField].longitude){
            geojsonFeature.geometry.coordinates = [parseFloat(feature[locationField].longitude), parseFloat(feature[locationField].latitude)];
            geojsonFeature.geometry.type = 'Point';
            delete feature.location;
            geojsonFeature.properties = feature;
            geojson.features.push( geojsonFeature );
          } 
        } else if ( feature && feature.latitude && feature.longitude ){
           geojsonFeature.geometry.coordinates = [parseFloat(feature.longitude), parseFloat(feature.latitude)];
           geojsonFeature.geometry.type = 'Point';
           geojsonFeature.properties = feature;
           geojson.features.push( geojsonFeature );
        }
      });
      callback(null, geojson);
    }
  };

  // compares the sha on the cached data and the hosted data
  // this method name is special reserved name that will get called by the cache model
  this.checkCache = function(key, data, options, callback){
    var self = this;
    var parts = key.split('::');
    url = parts[0] + this.socrata_path + parts[1] + '.json';

    if (data.updated_at && (new Date().getTime() - data.updated_at) > (1000*60*60)){
      callback(null, false);
    } else { 
      request.get(url, function( err, data, response ){
        if (err) {
          callback( err, null );
        } else {
          var types = JSON.parse( data.headers['x-soda2-types'] );
          var fields = JSON.parse( data.headers['x-soda2-fields'] );
          var locationField;
          types.forEach(function(t,i){
            if (t == 'location'){
              locationField = fields[i];
            }
          });
          self.toGeojson( JSON.parse( data.body ), locationField, function( error, geojson ){
            geojson.updated_at = new Date(data.headers['last-modified']).getTime();
            geojson.name = parts[1];
            callback( error, [geojson] );
          });
        }
      });
    }

  };

}
  

module.exports = new Socrata();
  
