/*---------------------
	:: Services 
	-> controller
---------------------*/
var fs = require('fs'),
  Geohub = require('geohub');

var FeatureServicesController = {

  geojson: function(req, res){
    var path = __dirname + '/../geojson/' + req.params.id;
    var exists = fs.existsSync( path + '.json' );
  
    var callback = req.query.callback;
    delete req.query.callback;

    if ( exists ) { 
      var geojson = require( path );
      // process as a feature service
      if ( req.params.method ) {
        FeatureServices[ req.params.method ]( geojson, req.query || {}, function( d ){
          if ( callback ){
            res.send( callback + '(' + JSON.stringify( d ) + ')' );
          } else {
            res.json( d );
          }
        });
      } else {  
        FeatureServices.info( geojson, req.params.layer, req.query || {}, function( d ){
          if ( callback ){
            res.send( callback + '(' + JSON.stringify( d ) + ')' );
          } else {
            res.json( d );
          }
        });
      }
    } else {
      res.send(404);
    }
  },

  gist: function(req, res){
    var callback = req.query.callback;
    delete req.query.callback;

    if ( req.params.id ){
        Geohub.gist( req.params.id , function( err, data ){
          if ( err ){
            res.json( err, 500 );
          } else if ( data.length ){
            if ( req.params.method ) {
              FeatureServices[ req.params.method ]( data[0], req.query || {}, function( d ){
                if ( callback ){
                  res.send( callback + '(' + JSON.stringify( d ) + ')' );
                } else { 
                  res.json( d );
                }
              });
            } else { 
              FeatureServices.info( data[0], req.params.layer, req.query || {}, function( d ){
                if ( callback ){
                  res.send( callback + '(' + JSON.stringify( d ) + ')' );
                } else { 
                  res.json( d );
                }
              });
            }
          } else {
            res.send('There a problem accessing this gist', 500);
          }
        });
      } else {
        res.send('Must specify a user and gist id', 404);
      }

  },

  github: function(req, res){
    var callback = req.query.callback;
    delete req.query.callback;
    if ( req.params.user && req.params.repo && req.params.file ){
        Geohub.repo( req.params.user, req.params.repo, req.params.file.replace(/::/g, '/'), function( err, data ){
          if ( err ){
            res.json( err, 500 );
          } else if ( data ){
            if ( req.params.method ) {
              FeatureServices[ req.params.method ]( data, req.query || {}, function( d ){
                if ( callback ){
                  res.send( callback + '(' + JSON.stringify( d ) + ')' );
                } else {
                  res.json( d );
                }
              });
            } else {
              FeatureServices.info( data, req.params.layer, res.query || {}, function( d ){
                if ( callback ){
                  res.send( callback + '(' + JSON.stringify( d ) + ')' );
                } else {
                  res.json( d );
                }
              });
            }
          } else {
            res.send('There was a problem accessing this repo', 500);
          }
        });
      } else {
        res.send('Must specify a user, repo, and file', 404);
      }

  }

};
module.exports = FeatureServicesController;
