/*---------------------
	:: Github 
	-> controller
---------------------*/
var request = require('request'); 
var Geohub = require('geohub'); 

var GithubController = {

  notFound: function(req, res){
    res.send('Must specify a user, repo, and file', 404);
  },

  index: function(req, res){
    res.render('github/index');
  },

  getRepo: function(req, res){
      if ( req.params.user && req.params.repo && req.params.file ){
        Geohub.repo( req.params.user, req.params.repo, req.params.file.replace(/::/g, '/'), function( err, data ){
          if ( err ){
            res.json( err, 500 );
          } else if ( data ){
            res.json( data );
          } else {
            res.send('There was a problem accessing this repo', 500);
          }
        });  
      } else {
        res.send('Must specify a user, repo, and file', 404);
      }
  }


};
module.exports = GithubController;
