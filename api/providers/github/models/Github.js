var Geohub = require('geohub');

module.exports = {
  find: function( user, repo, file, callback ){
    file = ( file ) ? file.replace(/::/g, '/') : null;

    var key = [ user, repo, file].join('/');
    
    if (!Cache.gist[ key ]){
      Geohub.repo( user, repo, file, function( err, data ){
        if ( !data.length ){
          data = [ data ];
        }
        Cache.gist[ key ] = JSON.stringify( data );
        callback( err, data );
      });
    } else {
      callback( null, JSON.parse( Cache.gist[ key ] ) );
    }
  
  }
};
