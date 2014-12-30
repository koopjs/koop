var FeatureServices = require('./FeatureServices.js'),
  fs = require('fs');

// A base controller that we can use to inherit from
// contains help methods to process complex query structures for request routing

var BaseController = function(){

  // shared logic for handling Feature Service requests
  // most providers will use this mehtod to figure out what request is being made
  function processFeatureServer(req, res, err, data, callback){
    delete req.query.geometry;
    if ( err ){
      res.json( err, 500 );
    } else if ( data ){

      //check for info requests and respond like ArcGIS Server would
      if (req._parsedUrl.pathname.substr(-4) === 'info'){
        var arcGisServerLikeResponse = {
            currentVersion: 10.21,
            fullVersion: "10.2.1",
            soapUrl: "http://sampleserver6.arcgisonline.com/arcgis/services",
            secureSoapUrl: "https://sampleserver6.arcgisonline.com/arcgis/services",
            authInfo: {
            isTokenBasedSecurity: true,
            tokenServicesUrl: "https://sampleserver6.arcgisonline.com/arcgis/tokens/",
            shortLivedTokenValidity: 60
          }
        };
        res.send( arcGisServerLikeResponse, 200 );
      }

      if ( FeatureServices[ req.params.layer ]){
        // requests for specific layers - pass data and the query string
        FeatureServices[ req.params.layer ]( data, req.query || {}, function( err, d ){
          if (err){
            res.send(err, 500);
            return;
          }
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
            if (err){
              res.send(err, 500);
              return;
            }
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
  }

  return {
    processFeatureServer: processFeatureServer
  };
};

module.exports = BaseController;
