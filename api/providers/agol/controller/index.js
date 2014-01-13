var request = require('request'),
  terraformer = require('Terraformer'),
  terraformerParser = require('terraformer-arcgis-parser'),
  extend = require('node.extend'),
  base = require('../../base/controller.js');

// inherit from base controller
var Controller = extend({

  register: function(req, res){
    if ( !req.body.host ){
      res.send('Must provide a host to register:', 500); 
    } else { 
      AGOL.register( req.body.id, req.body.host, function(err, id){
        if (err) {
          res.send( err, 500);
        } else {
          res.json({ 'serviceId': id });
        }
    });
    }
  },

  list: function(req, res){
    AGOL.find(null, function(err, data){
      if (err) {
        res.send( err, 500);
      } else {
        res.json( data );
      }
    });
  }, 

  find: function(req, res){
    AGOL.find(req.params.id, function(err, data){
      if (err) {
        res.send( err, 500);
      } else {
        res.json( data );
      }
    });
  },

  findItem: function(req, res){
    AGOL.find(req.params.id, function(err, data){
      if (err) {
        res.send( err, 500);
      } else {
        // Get the item 
        AGOL.getItem( data[0].host, req.params.item, req.query, function(error, itemJson){
          if (error) {
            res.send( error, 500);
          } else { 
            res.json( itemJson );
          }
        });
      }
    });
  },

  findItemData: function(req, res){
    AGOL.find(req.params.id, function(err, data){
      if (err) {
        res.send( err, 500);
      } else {
        // if we have a layer then pass it along
        if ( req.params.layer ) {
          req.query.layer = req.params.layer;
          console.log('using a feature service layer', req.params.layer);
        }
        // Get the item
        AGOL.getItemData( data[0].host, req.params.item, req.query, function(error, itemJson){
          if (error) {
            res.send( error, 500);
          } else {
            res.json( itemJson );
          }
        });
      }
    });
  },

  del: function(req, res){
    if ( !req.params.id ){
      res.send( 'Must specify a service id', 500 );
    } else { 
      AGOL.remove(req.params.id, function(err, data){
        if (err) {
          res.send( err, 500);
        } else {
          res.json( data );
        }
      });
    }
  }, 
  
  featureserver: function( req, res ){
    var callback = req.query.callback;
    delete req.query.callback;

    AGOL.find(req.params.id, function(err, data){
      if (err) {
        res.send( err, 500);
      } else {
        // Get the item 
        AGOL.getItemData( data[0].host, req.params.item, req.query, function(error, itemJson){
          if (error) {
            res.send( error, 500);
          } else {
            GeoJSON.fromEsri(itemJson.data, function(err, geojson){
              if ( !geojson.length ) {
                geojson = [geojson];
              }
              // pass to the shared logic for FeatureService routing
              Controller._processFeatureServer( req, res, err, geojson, callback);
            });
          }
        });
      }
    });
    
  },

  thumbnail: function(req, res){

     AGOL.find(req.params.id, function(err, data){
      if (err) {
        res.send( err, 500);
      } else {
        // Get the item 
        AGOL.getItemData( data[0].host, req.params.item, req.query, function(error, itemJson){
          if (error) {
            res.send( error, 500);
          } else {
            GeoJSON.fromEsri(itemJson.data, function(err, geojson){
              req.query.cache = false;
              var key = ['agol', req.params.id, req.params.item].join(':');

              if ( itemJson.extent ){
                req.query.extent = {
                  xmin: itemJson.extent[0][0],
                  ymin: itemJson.extent[0][1],
                  xmax: itemJson.extent[1][0],
                  ymax: itemJson.extent[1][1]
                }; 
              }

              // generate a thumbnail
              Thumbnail.generate( geojson, key, req.query, function(err, file){
                if (err){
                  res.send(err, 500);
                } else {
                  // send back image
                  res.sendfile( file );
                }
              });
              
            });
          }
        });
      }
    });

  }


}, base);

module.exports = Controller;
