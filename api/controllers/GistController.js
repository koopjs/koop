/*---------------------
	:: GeoJson 
	-> controller
---------------------*/
var request = require('request'); 
var Geohub = require('geohub'); 

var GistController = {

  findOne: function(req, res){
      if ( req.params.id ){
        console.log('Sending to geohub', req.params.id);
        Geohub.gist( {id: req.params.id }, function( err, data ){
          console.log('back', req.params.id);
          if ( err ){
            res.json( err, 500 );
          } else { 
            if ( data.length ){
              res.json( data[0] );
            } else {
              res.send('There a problem accessing this gist', 500);
            }
          }
        });  
      } else {
        res.send('Must specify a user and gist id', 404);
      }
  }


};
module.exports = GistController;
