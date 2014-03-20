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
          // limit response to 1000 
          if (d.feature && d.features.length > 1000){
            d.features = d.features.splice(0,1000);
          }
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
            // limit response to 1000 
            if (d.features && d.features.length > 1000){
              d.features = d.features.splice(0,1000);
            }
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

