var spawnasync = require('spawn-async');
var worker = spawnasync.createWorker({'log': sails.config.log});

var nfs = require('node-fs'),
  fs = require('fs');

// A base controller that we can use to inherit from
// contains help methods to process complex query structures for request routing
  // tells koop that this is a provider and should be listed as such
exports.provider = true;

  // shared logic for handling Feature Service requests 
  // most providers will use this mehtod to figure out what request is being made 
exports._processFeatureServer = function(req, res, err, data, callback){
    if ( err ){
      res.json( err, 500 );
    } else if ( data ){
      if ( FeatureServices[ req.params.layer ]){
        // requests for specific layers - pass data and the query string  
        FeatureServices[ req.params.layer ]( data, req.query || {}, function( err, d ){
          if ( callback ){
            res.send( callback + '(' + JSON.stringify( d ) + ')' );
          } else {
            res.json( d );
          }
        });
      } else {
        // have a layer
        if (req.params.layer && data[ req.params.layer ]){
          // pull out the layer data 
          data = data[ req.params.layer ];
        } else if ( data.length ) {
          //data = data[0];
        } else if ( req.params.layer && !data[req.params.layer]){
          res.send('Layer not found', 404);
        }
        if ( req.params.method && FeatureServices[ req.params.method ] ){
          // we have a method call like "/layers"
          FeatureServices[ req.params.method ]( data, req.query || {}, function( err, d ){
            if ( callback ){
              res.send( callback + '(' + JSON.stringify( d ) + ')' );
            } else {
              res.json( d );
            }
          });
        } else {
          // make a straight up feature service info request
          // we still pass the layer here to conform to info method, though its undefined  
          FeatureServices.info( data, req.params.layer, req.query || {}, function( err, d ){
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


// Exports data as any supported format 
// take in a format, file key, geojson, and callback
//   
exports.exportToFormat = function( format, key, geojson, callback ){
    console.log(format, key, geojson);
    var p = [sails.config.data_dir + 'files', key].join('/');
    var file = p + '/export.json';

    nfs.mkdir( p, '0777', true, function(){
      if ( !nfs.existsSync( file ) ) {
        //self._stash( file, format, data, z, x, y, function( err, newfile ){
        fs.writeFile( file, JSON.stringify( geojson ), function(){
          callback( null, file );
        });
        //});
      } else {
        console.log( 'File Exists! ', file );
        callback( null, file );
      }
    });
    // check for geojson file on disk  
       // else create a geojson file on disk 
    // build the conversion string for org2ogr
    // execute command 
    // respond to request  

  /*  worker.aspawn(['ogr2ogr', '--formats'],
      function (err, stdout, stderr) {
          if (err) {
              callback(err.message, null);
          } else {
              callback(null, stdout);
          }
      });*/
};
