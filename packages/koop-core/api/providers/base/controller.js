var spawnasync = require('spawn-async');
var worker = spawnasync.createWorker({'log': sails.config.log});


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

exports.exportToFormat = function( req, res ){
    // do we have the file in the format requested?
    // if its json serve it out of the db 
    // else create a geojson file on disk 
    // build the conversion string for org2ogr
    // execute command 
    // respond to request  

    worker.aspawn(['ogr2ogr', '--formats'],
      function (err, stdout, stderr) {
          if (err) {
              res.send(err.message);
              console.log('error: %s', err.message);
              console.error(stderr);
          } else {
              res.send(stdout);
              console.log(stdout);
          }
      });
};
