var Geohub = require('geohub');

module.exports = {
  find: function( user, repo, file, options, callback ){
    file = ( file ) ? file.replace(/::/g, '/') : null;

    var key = [ user, repo, file].join('/'),
      type = 'Github';
    
    Cache.get( type, key, options, function(err, entry ){
      if ( err ){
        console.log('Data not found in cache, requesting', key);
        Geohub.repo( user, repo, file, sails.config.github_token, function( err, geojson ){
          if ( !geojson.length ){
            geojson = [ geojson ];
          }
          Cache.insert( type, key, geojson, function( err, success){
            if ( success ) callback( null, geojson );
          });
        });
      } else {
        console.log('Data found!, using cache', key);
        callback( null, entry );
      }
    });
  },

  // compares the sha on the cached data and the hosted data
  // this method name is special reserved name that will get called by the cache model
  checkCache: function(key, data, callback){
    var json = data;
    key = key.split('/');
    var user = key.shift();
    var repo = key.shift();
    var path = key.join('/') + '.geojson';

    Geohub.repoSha(user, repo, path, sails.config.github_token, function(err, sha){
      if ( sha == json[0].sha ){
        callback(null, false);
      } else {
        Geohub.repo( user, repo, path, sails.config.github_token, function( err, geojson ){
          callback(null, geojson );
        });
      }
    });
  }
};
