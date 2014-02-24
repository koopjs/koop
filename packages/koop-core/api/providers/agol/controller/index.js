var request = require('request'),
  terraformer = require('Terraformer'),
  terraformerParser = require('terraformer-arcgis-parser'),
  extend = require('node.extend'),
  sm = require('sphericalmercator'),
  merc = new sm({size:256}),
  fs = require('fs'),
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
    if (req.params.format){
      Controller.findItemData(req, res);
    } else {
      AGOL.find(req.params.id, function(err, data){
        if (err) {
          res.send( err, 500);
        } else {
          // Get the item 
          AGOL.getItem( data.host, req.params.item, req.query, function(error, itemJson){
            if (error) {
              res.send( error, 500);
            } else { 
              res.json( itemJson );
            }
          });
        }
      });
    }
  },

  findItemData: function(req, res){
    var _get = function(id, item, options, callback){
       AGOL.find( id, function( err, data ){
        if (err) {
          callback(err, null);
        } else {
          // Get the item
          if ( !parseInt(options.layer) ){
            options.layer = 0;
          }
          AGOL.getItemData( data.host, item, options, function(error, itemJson){
            if (error) {
              callback( error, null);
            } else {
              if (itemJson.data[0].features.length > 1000){
                itemJson.data[0].features = itemJson.data[0].features.splice(0,1000);
              }
              callback( null, itemJson );
            }
          });
        }
      });  
    }; 

    // if we have a layer then append it to the query params 
    if ( req.params.layer ) {
      req.query.layer = req.params.layer;
    }

    // check format for exporting data
    if ( req.params.format ){
      // build the file key and look for the file 
      var key = [req.params.id, req.params.item, parseInt(req.query.layer) || 0 ].join(':');
      var fileName = [sails.config.data_dir + 'files', key, key + '.' + req.params.format].join('/');

      console.log(fileName);

      if (fs.existsSync( fileName )){
        res.sendfile( fileName );
      } else {

        _get(req.params.id, req.params.item, req.query, function( err, itemJson ){
          //console.log(itemJson.data[req.query.layer || 0]);
          if ( !itemJson.data[0].features.length ){
            res.send( 'No features exist for the requested FeatureService layer', 500 );
          } else {
            Controller.exportToFormat( req.params.format, key, itemJson.data[0], function(err, result){
              if (err) {
                res.send( err, 500 );
              } else {
                console.log( result );
                res.sendfile( result );
              }
            });
          }
        });
      }

    } else {
      // get the esri json data for the service
      _get(req.params.id, req.params.item, req.query, function( err, itemJson ){
          if (err) {
            res.send( err, 500 );
          } else {
            res.send( itemJson );
          }
      });
    }
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

    if (!req.params.layer){
      req.query.layer = 0;
    }

    AGOL.find(req.params.id, function(err, data){
      if (err) {
        res.send( err, 500);
      } else {
        // Get the item 
        AGOL.getItemData( data.host, req.params.item, req.query, function(error, itemJson){
          if (error) {
            res.send( error, 500);
          } else {
            //GeoJSON.fromEsri( {features: itemJson.data.features}, function(err, geojson){
            //  if ( !geojson.length ) {
            //    geojson = [geojson];
            //  }
              // pass to the shared logic for FeatureService routing
              Controller._processFeatureServer( req, res, err, itemJson.data, callback);
            //});
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

        // check the image first and return if exists
        var key = ['agol', req.params.id, req.params.item, (req.params.layer || 0)].join(':');
        var dir = sails.config.data_dir + '/thumbs/';
        req.query.width = parseInt( req.query.width ) || 150;
        req.query.height = parseInt( req.query.height ) || 150;
        req.query.f_base = dir + key + '/' + req.query.width + '::' + req.query.height;
        // var png = req.query.f_base+'.png';

        var fileName = Thumbnail.exists(key, req.query); 
        if ( fileName ){
          res.sendfile( fileName );
        } else {

          // if we have a layer then pass it along
          if ( req.params.layer ) {
            req.query.layer = req.params.layer;
          }

          // Get the item 
          AGOL.getItemData( data.host, req.params.item, req.query, function(error, itemJson){
            if (error) {
              res.send( error, 500);
            } else {
              GeoJSON.fromEsri({features: itemJson.data.features}, function(err, geojson){
                req.query.cache = false;

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
      }
    });

  },

  preview: function(req, res){
   res.view('demo/agol', { locals:{ host: req.params.id, item: req.params.item } });
  },

  tiles: function( req, res ){
    var key,
      layer = req.params.layer || 0;

    var _send = function( err, data ){
      req.params.key = key + ':' + layer;
        GeoJSON.fromEsri( data, function(err, geojson){
          Tiles.get( req.params, geojson, function(err, tile){
            if ( req.params.format == 'png'){
              res.sendfile( tile );
            } else {
              res.send( tile );
            }
          });
        });
    }

    // build the geometry from z,x,y
    var bounds = merc.bbox( req.params.x, req.params.y, req.params.z );
    req.query.geometry = {
        xmin: bounds[0],
        ymin: bounds[1],
        xmax: bounds[2],
        ymax: bounds[3],
        spatialReference: { wkid: 4326 }
    };

    var _sendImmediate = function( file ){
      if ( req.params.format == 'png'){
        res.sendfile( file );
      } else {
        res.sendfile( file );
      }
    }; 

    key = ['agol', req.params.id, req.params.item].join(':');
    var file = sails.config.data_dir + 'tiles/';
      file += key + ':' + layer + '/' + req.params.format;
      file += '/' + req.params.z + '/' + req.params.x + '/' + req.params.y + '.' + req.params.format;

    if ( !fs.existsSync( file ) ) {
      console.log('NO tile in cache, go get the data', file);
      AGOL.find(req.params.id, function(err, data){
        if (err) {
          res.send( err, 500);
        } else {
          // if we have a layer then pass it along
          if ( req.params.layer ) {
            req.query.layer = req.params.layer;
          }
          // Get the item
          AGOL.getItemData( data.host, req.params.item, req.query, function(error, itemJson){
            if (error) {
              res.send( error, 500);
            } else {
              _send(error, itemJson.data);
            }
          });
        }
      });
    } else {
      _sendImmediate(file);
    }
  }

}, base);

module.exports = Controller;
