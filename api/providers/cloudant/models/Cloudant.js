var request = require('request'),
  async = require('async'),
  terraformerWKT = require('terraformer-wkt-parser'),
  terraformerParser = require('terraformer-arcgis-parser');

var Cloudant = function(){

  // adds a service to the Cache.db
  // needs a host, generates an id 
  this.register = function( id, host, callback ){
    var type = 'cloudant:services';
    Cache.db.services.count( type, function(error, count){
      id = id || count++;
      Cache.db.services.register( type, {'id': id, 'host': host},  function( err, success ){
        callback( err, id );
      });
    });
  };

  this.remove = function( id, callback ){
    Cache.db.services.remove( 'cloudant:services', parseInt(id) || id,  callback);
  }; 

  // get service by id, no id == return all
  this.find = function( id, callback ){
    Cache.db.services.get( 'cloudant:services', parseInt(id) || id, callback);
  };

  // got the service and get the item
  this.getResource = function( host, id, options, callback ){
    var self = this,
      type = 'Cloudant',
      key = [host,id].join('::'); 

    Cache.get( type, key, options, function(err, entry ){
      if ( err ){
        // idField*
        // objectIds
        // returnCountOnly (true or false)
        // returnIdsOnly (true or false)
        // geometry (xmin,ymin,xmax,ymax)

        var url = host + '/' + id + '/_design/' + options.view + '/_geo/' + options.index + '?include_docs=true';

        if (options.geometry){
          // convert from esri json to geojson to wkt
          var g = terraformerParser.parse(options.geometry);
          var wkt = terraformerWKT.convert(g.geometry);
          url += '&g=' + wkt;
        } else {
          url += '&bbox=-180,-90,180,90'
        }

        if (options.resultOffset){
          url += 'startIndex=' + options.resultOffset;
        }    

        request.get(url, function(err, data, response ){
          if (err) {
            callback(err, null);
          } else {
            var geojson = JSON.parse(data.body);
            Cache.insert( type, key, geojson, 0, function( err, success){
              if ( success ) callback( null, [geojson] );
            }); 
          }
        });
      } else {
        callback( null, entry );
      }     
    });
  };

}
  

module.exports = new Cloudant();
  
