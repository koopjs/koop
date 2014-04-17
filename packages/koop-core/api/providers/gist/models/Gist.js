var Geohub = require('geohub');

exports.find = function( id, options, callback ){
  // looks for data in the cache first
  var type = 'Gist';
  Cache.get( type, id, options, function(err, entry ){
    if ( err ){
      Geohub.gist( { id: id, token: sails.config.github_token }, function( err, geojson ){
        if ( !geojson.length ){
          geojson = [ geojson ];
        }

        var _totalLayer = geojson.length,
          finalJson = [];
        // local method to collect layers and send them all
        var _send = function(data){
          finalJson.push(data);
          if ( finalJson.length == _totalLayer ) {
            callback(null, finalJson);
          }
        };

        geojson.forEach(function(layer, i){
          Cache.insert( type, id, layer, i, function( err, success){
            if ( success ) {
              _send(layer);
            } 
          });
        });
      });
    } else {
      callback( null, entry );
    }
  });
};

// compares the updated_at timestamp on the cached data and the hosted data
// this method name is special reserved name that will get called by the cache model
exports.checkCache = function(id, data, options, callback){
  var json = data;
  Geohub.gistSha(id, sails.config.github_token, function(err, sha){
    if ( sha == json[0].updated_at ){
      callback(null, false);
    } else {
      Geohub.gist( { id: id, token: sails.config.github_token }, function( err, geojson ){
        callback(null, geojson);  
      });
    }
  });
};
