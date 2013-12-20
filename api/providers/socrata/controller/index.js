var extend = require('node.extend'),
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

  findResource: function(req, res){
    Socrata.find(req.params.id, function(err, data){
      if (err) {
        res.send( err, 500);
      } else {
        // Get the item 
        Socrata.getResource( data[0].host, req.params.item, req.query, function(error, itemJson){
          if (error) {
            res.send( error, 500);
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

    Socrata.find(req.params.id, function(err, data){
      if (err) {
        res.send( err, 500);
      } else {
        // Get the item 
        Socrata.getResource( data[0].host, req.params.item, req.query, function(error, geojson){
          if (error) {
            res.send( error, 500);
          } else {
            // pass to the shared logic for FeatureService routing
            Controller._processFeatureServer( req, res, err, geojson, callback);
          }
        });
      }
    });
    
  }

}, base);

module.exports = Controller;
