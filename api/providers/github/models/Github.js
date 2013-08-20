var Geohub = require('geohub');

module.exports = {
  find: function( user, repo, file, callback ){

    var key = [ user, repo, file.replace(/::/g, '/')].join('/');
    
    if (!Cache.gist[ key ]){
      Geohub.repo( user, repo, file.replace(/::/g, '/'), function( err, data ){
        Cache.gist[ key ] = JSON.stringify( data );
        callback( err, data );
      });
    } else {
      callback( null, JSON.parse( Cache.gist[ key ] ) );
    }
  
  }
};
