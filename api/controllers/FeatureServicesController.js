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

    function send( err, data ){
      if ( err ){
        res.json( err, 500 );
      } else if ( data ){
        if ( FeatureServices[ req.params.layer ]){
          FeatureServices[ req.params.layer ]( data, req.query || {}, function( d ){
            if ( callback ){
              res.send( callback + '(' + JSON.stringify( d ) + ')' );
            } else { 
              res.json( d );
            }
          });
        } else {
          if ( req.params.method && FeatureServices[ req.params.method ] ){ 
            FeatureServices[ req.params.method ]( data, req.query || {}, function( d ){
              if ( callback ){
                res.send( callback + '(' + JSON.stringify( d ) + ')' );
              } else {
                res.json( d );
              }
          });
          } else { 
            FeatureServices.info( data, req.params.layer, req.query || {}, function( d ){
              if ( callback ){
                res.send( callback + '(' + JSON.stringify( d ) + ')' );
              } else {
                res.json( d );
              }
          });
          }
        }
      
      } else {
        res.send('There a problem accessing this gist', 500);
      }
    };

    if ( req.params.id ){
        var id = req.params.id;
        if (!Cache.gist[ id ]){
          Geohub.gist( { id: id }, function( err, data ){
            Cache.gist[ id ] = JSON.stringify(data[0]);
            send( err, data[0] );
          });
        } else {
          send( null, JSON.parse(Cache.gist[ id ]) );
        }
      } else {
        res.send('Must specify a gist id', 404);
      }

  },

  github: function(req, res){
    var callback = req.query.callback;
    delete req.query.callback;

    function send( err, data ){
      if ( err ){
        res.json( err, 500 );
      } else if ( data ){
        if ( FeatureServices[ req.params.layer ]){
          FeatureServices[ req.params.layer ]( data, req.query || {}, function( d ){
            if ( callback ){
              res.send( callback + '(' + JSON.stringify( d ) + ')' );
            } else {
              res.json( d );
            }
          });
        } else {
          if ( req.params.method && FeatureServices[ req.params.method ] ){
            FeatureServices[ req.params.method ]( data, req.query || {}, function( d ){
              if ( callback ){
                res.send( callback + '(' + JSON.stringify( d ) + ')' );
              } else {
                res.json( d );
              }
          });
          } else { 
            FeatureServices.info( data, req.params.layer, req.query || {}, function( d ){
              if ( callback ){
                res.send( callback + '(' + JSON.stringify( d ) + ')' );
              } else {
                res.json( d );
              }
          });
          }
        }

      } else {
        res.send('There a problem accessing this repo', 500);
      }
    };

    if ( req.params.user && req.params.repo && req.params.file ){
        var key = [ req.params.user, req.params.repo, req.params.file.replace(/::/g, '/')].join('/');
        if (!Cache.gist[ key ]){
          Geohub.repo( req.params.user, req.params.repo, req.params.file.replace(/::/g, '/'), function( err, data ){
            Cache.gist[ key ] = JSON.stringify( data );
            send( err, data );
          });
        } else {
          send( null, JSON.parse( Cache.gist[ key ] ) );
        }
      } else {
        res.send('Must specify a user, repo, and file', 404);
      }

  }

};
module.exports = FeatureServicesController;
