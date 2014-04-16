var extend = require('node.extend'),
  fs = require('fs'),
  crypto = require('crypto'),
  base = require('../../base/controller.js');

// inherit from base controller
var Controller = extend({
  serviceName: 'socrata',

  register: function(req, res){
    if ( !req.body.host ){
      res.send('Must provide a host to register:', 500); 
    } else { 
      Socrata.register( req.body.id, req.body.host, function(err, id){
        if (err) {
          res.send( err, 500);
        } else {
          res.json({ 'serviceId': id });
        }
    });
    }
  },

  list: function(req, res){
    Socrata.find(null, function(err, data){
      if (err) {
        res.send( err, 500);
      } else {
        res.json( data );
      }
    });
  }, 

  find: function(req, res){
    Socrata.find(req.params.id, function(err, data){
      if (err) {
        res.send( err, 404);
      } else {
        res.json( data );
      }
    });
  },

  findResourcePost: function( req, res ){
    Controller.findResource( req, res );
  },

  findResource: function(req, res){
    Socrata.find(req.params.id, function(err, data){
      if (err) {
        res.send( err, 500);
      } else {
        // Get the item 
        Socrata.getResource( data.host, req.params.item, req.query, function(error, itemJson){
          if (error) {
            res.send( error, 500);
          } else if ( req.params.format ) {
            var dir = ['socrata', req.params.id ].join(':');
            // build the file key as an MD5 hash that's a join on the paams and look for the file 
            var toHash = JSON.stringify( req.params ) + JSON.stringify( req.query );
            var key = crypto.createHash('md5').update( toHash ).digest('hex');

            var fileName = [sails.config.data_dir + 'files', dir, key + '.' + req.params.format].join('/');

            if (fs.existsSync( fileName )){
              res.sendfile( fileName );
            } else {
              Exporter.exportToFormat( req.params.format, key, key, itemJson[0], function(err, file){
                if (err){
                  res.send(err, 500);
                } else {
                  res.sendfile( file );
                }
              });
            }
          } else { 
            res.json( itemJson[0] );
          }
        });
      }
    });
  },

  del: function(req, res){
    if ( !req.params.id ){
      res.send( 'Must specify a service id', 500 );
    } else { 
      Socrata.remove(req.params.id, function(err, data){
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
    
    for (var k in req.body){
      req.query[k] = req.body[k];
    }

    Socrata.find(req.params.id, function(err, data){
      if (err) {
        res.send( err, 500);
      } else {
        // Get the item 
        Socrata.getResource( data.host, req.params.item, req.query, function(error, geojson){
          if (error) {
            res.send( error, 500);
          } else {
            // pass to the shared logic for FeatureService routing
            delete req.query.geometry;
            Controller._processFeatureServer( req, res, err, geojson, callback);
          }
        });
      }
    });
    
  },

  thumbnail: function(req, res){

    // check the image first and return if exists
    var key = ['socrata', req.params.id, req.params.item].join(':');
    var dir = sails.config.data_dir + '/thumbs/';
    req.query.width = parseInt( req.query.width ) || 150;
    req.query.height = parseInt( req.query.height ) || 150;
    req.query.f_base = dir + key + '/' + req.query.width + '::' + req.query.height;

    var fileName = Thumbnail.exists(key, req.query);
    if ( fileName ){
      res.sendfile( fileName );
    } else {

      Socrata.find(req.params.id, function(err, data){
        if (err) {
          res.send( err, 500);
        } else {
          // Get the item 
          Socrata.getResource( data.host, req.params.item, req.query, function(error, itemJson){
            if (error) {
              res.send( error, 500);
            } else {
              var key = ['socrata', req.params.id, req.params.item].join(':');

              // generate a thumbnail
              Thumbnail.generate( itemJson[0], key, req.query, function(err, file){
                if (err){
                  res.send(err, 500);
                } else {
                  // send back image
                  res.sendfile( file );
                }
              });

            }
          });
        }
      });
    }

  },

  
  preview: function(req, res){
   res.view('demo/socrata', { locals:{ host: req.params.id, item: req.params.item } });
  }



}, base);

module.exports = Controller;
