var request = require('request');

var AGOL = function(){

  // adds a service to the Cache.db
  // needs a host, generates an id 
  this.register = function( id, host, callback ){
    var type = 'agol:services';
    //var id = (new Date()).getTime();
    Cache.db.services.count( type, function(error, count){
      id = id || count++;
      Cache.db.services.register( type, {'_id': id, 'host': host},  function( err, success ){
        callback( err, id );
      });
    });
  };

  this.remove = function( id, callback ){
    Cache.db.services.remove( 'agol:services', id,  callback);
  }; 

  // get service by id, no id == return all
  this.find = function( id, callback ){
    Cache.db.services.get( 'agol:services', id, callback);
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
      if (itemJson.type != 'Feature Collection') {
        callback('Item must be a Feature Collection', null);
      } else {
        var url = host + self.agol_path + itemId+'/data?f=json'; 
        request.get(url, function(err, data ){
          if (err) {
            callback(err, null);
          } else {
            itemJson.data = JSON.parse( data.body );
            callback( null, itemJson );
          }
        });
      }
    });
  };

}
  

module.exports = new AGOL();
  
