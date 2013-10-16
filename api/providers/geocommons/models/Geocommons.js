var request = require('request');
module.exports = {
  find: function( id, options, callback ){
    // looks for data in the cache first
    var type = 'Geocommons';
    Cache.get( type, id, options, function(err, entry ){
      if ( err ){
        var url = "http://geocommons.com/overlays/" + id + "/features.json";
        request.get( url , function( err, data ){
          var geojson = JSON.parse( data.body );
          if ( !geojson.length ){
            geojson = [ geojson ];
          }
          Cache.insert( type, id, geojson, function( err, success){
            if ( success ) callback( null, geojson );
          });
        });
      } else {
        callback( null, entry );
      }
    });
  }
  
};
