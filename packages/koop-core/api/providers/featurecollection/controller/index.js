var request = require('request');


module.exports = {

  provider: true,
 
  proxy: function(req, res){
    if (!req.query || !req.query.url ){ 
      res.send('Must specifiy a url', 500);
    } else {
      // get featureservice data
      var url = req.query.url.replace('?','&');
      delete req.query.url;
      FeatureCollectionProxy.proxy( url, req.query, function(err, json){
        if (err) {
          res.send(err, 500);
        } else {
          res.json( json );
        }
      });
    }
  },

  // TODO this logic appears in a lot or places. We could move it into a shared component 
  // or figure out a better to have controllers extend from a base controller (its prototype)
  featureservice: function(req, res){
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

    if (!req.query || !req.query.url ){
      res.send('Must specifiy a url', 500);
    } else {
      // get featureservice data
      var url = req.query.url.replace('?','&');
      delete req.query.url;
      req.query.geojson = true;
      FeatureCollectionProxy.proxy( url, req.query, function( err, fsjson) {
        _send( err, [fsjson] );
      });
    }

  }


};
