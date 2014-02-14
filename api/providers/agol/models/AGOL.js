var request = require('request');

var AGOL = function(){

  // adds a service to the Cache.db
  // needs a host, generates an id 
  this.register = function( id, host, callback ){
    var type = 'agol:services';
    //var id = (new Date()).getTime();
    Cache.db.services.count( type, function(error, count){
      id = id || count++;
      Cache.db.services.register( type, {'id': id, 'host': host},  function( err, success ){
        callback( err, id );
      });
    });
  };

  this.remove = function( id, callback ){
    Cache.db.services.remove( 'agol:services', parseInt(id) || id,  callback);
  }; 

  // get service by id, no id == return all
  this.find = function( id, callback ){
    Cache.db.services.get( 'agol:services', parseInt(id) || id, callback);
  };

  this.agol_path = '/sharing/rest/content/items/';

  // got the service and get the item
  this.getItem = function( host, itemId, options, callback ){
    var url = host + this.agol_path + itemId+'?f=json';
    request.get(url, function(err, data ){
      if (err) {
        callback(err, null);
      } else {
        var json = JSON.parse( data.body );
        callback( null, json );
      }
    }); 
  };

  // got the service and get the item
  this.getItemData = function( host, itemId, options, callback ){
    var self = this;
    this.getItem(host, itemId, options, function( err, itemJson ){
      if ( err ){
        callback(err, null);
      } else {
        if (itemJson.type == 'Feature Collection' || itemJson.type == 'Feature Service' ) {
          self[ itemJson.type.replace(' ', '') ]( host + self.agol_path, itemId, itemJson, options, callback );
        } else {
          callback('Requested Item must be a Feature Collection', null);
        }
      }
    });
  };

  this.FeatureCollection = function(base_url, id, itemJson, options, callback){
    var url = base_url + '/' + id + '/data?f=json'; 
    request.get(url, function(err, data ){
      if (err) {
        callback(err, null);
      } else {
        itemJson.data = JSON.parse( data.body ).featureCollection.layers[0].featureSet;
        callback( null, itemJson );
      }
    });
  };

  this.FeatureService = function(base_url, id, itemJson, options, callback){
    if ( !itemJson.url ){
      callback('Missing url parameter for Feature Service Item', null);
    } else {
      var url = itemJson.url + '/' + (options.layer || 0) + '/query?outSR=4326&where=1=1&f=json'; 
      if (options.geometry){
        url += '&spatialRel=esriSpatialRelIntersects&geometry=' + JSON.stringify(options.geometry);
      }
      request.get( url, function(err, data ){
        if (err) {
          callback(err, null);
        } else {
          try { 
            itemJson.data = {features: JSON.parse( data.body ).features};
            callback( null, itemJson );
          } catch (e){
            console.log('Error', e);
            callback( 'Unable to parse Feature Service response', null );
          }
        }
      });
    }
  };

};
  

module.exports = new AGOL();
  
