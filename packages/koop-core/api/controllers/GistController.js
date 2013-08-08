/*---------------------
	:: GeoJson 
	-> controller
---------------------*/
var request = require('request'); 
var Geohub = require('geohub'); 

var GistController = {

  findOne: function(req, res){
      function send( err, data ){
          if ( err ){
            res.json( err, 500 );
          } else { 
            if ( data ){
              res.json( data );
            } else {
              res.send('There a problem accessing this gist', 500);
            }
          }
      };
      if ( req.params.id ){
        var id = req.params.id;
        if ( !Cache.gist[ id ] ){
          Geohub.gist( {id: id }, function( err, data ){
            Cache.gist[ id ] = JSON.stringify( data[0] ); 
            send( err, data[0]);
          });  
        } else {
          send( null, JSON.parse( Cache.gist[ id ] ));
        }
        
      } else {
        res.send('Must specify a user and gist id', 404);
      }
  }


};
module.exports = GistController;
