var request = require('request'),
  terraformer = require('Terraformer'),
  terraformerParser = require('terraformer-arcgis-parser');

module.exports = {

  provider: true,
 
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

    function _send( err, data ){
      if ( err ){
        res.json( err, 500 );
      } else if ( data ){
        if ( FeatureServices[ req.params.layer ]){
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
            data = data[ req.params.layer ];
          } else if ( req.params.layer && !data[req.params.layer]){
            res.send('Layer not found', 404);
          }

          if ( req.params.method && FeatureServices[ req.params.method ] ){
            FeatureServices[ req.params.method ]( data, req.query || {}, function( err, d ){
              if ( callback ){
                res.send( callback + '(' + JSON.stringify( d ) + ')' );
              } else {
                res.json( d );
              }
            });
          } else {
            FeatureServices.info( data, req.params.layer, req.query || {}, function( err, d ){
              if ( callback ){
                res.send( callback + '(' + JSON.stringify( d ) + ')' );
              } else {
                res.send( d, 200 );
              }
            });
          }
        }

      } else {
        res.send('There a problem accessing this overlay', 500);
      }
    };

    AGOL.find(req.params.id, function(err, data){
      if (err) {
        res.send( err, 500);
      } else {
        // Get the item 
        AGOL.getItemData( data[0].host, req.params.item, req.query, function(error, itemJson){
          if (error) {
            res.send( error, 500);
          } else {
            FeatureCollectionProxy.geojson(itemJson.data.featureCollection.layers[0].featureSet, function(err, geojson){
              if ( !geojson.length ) {
                geojson = [geojson];
              }
              _send( null, geojson);
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
            var features = itemJson.data.featureCollection.layers[0].featureSet.features;
            var geojson = {type: 'FeatureCollection', features: []};
            var feature;
            features.forEach(function(f, i){
              feature = JSON.parse( terraformerParser.parse( f ).toJson() );
              delete feature.bbox;
              delete feature.geometry.bbox;
              geojson.features.push( feature );
            });

            if ( !itemJson.extent ){
              var extent = {
                xmin: -180,
                ymin: 85,
                xmax: 180,
                ymax: 85,
                spatialReference: {
                  wkid: 4326,
                  latestWkid: 4326
                }
              };
            } else {
              var extent = {
                xmin: itemJson.extent[0][0],
                ymin: itemJson.extent[0][1],
                xmax: itemJson.extent[1][0],
                ymax: itemJson.extent[1][1],
                spatialReference: {
                  wkid: 4326,
                  latestWkid: 4326
                }
              };
            }

            console.log(extent, geojson.features[0].geometry );

            Thumbnail.generate( geojson, extent, req.query, function(err, file){
              if (err) {
                res.send(err, 500);
              } else {
                console.log('send file', file);
                res.sendfile( file );
              }
            });
          }
        });
      }
    });
  } 
};
