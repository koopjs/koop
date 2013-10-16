
module.exports = {

  provider: true,
 
  index: function(req, res){
    res.view('geocommons/index');
  },

  find: function(req, res){
    function send( err, data ){
        if ( err ){
          res.json( err, 500 );
        } else { 
          if ( data ){
            res.json( data );
          } else {
            res.send('There a problem accessing this overlay', 500);
          }
        }
    };
    if ( req.params.id ){
      var id = req.params.id;
      var d = {};
      Geocommons.find( id, req.query, function( err, data) {
        if (req.params.layer !== undefined && data[req.params.layer]){
          //d = data[req.params.layer];
          send( err, data[req.params.layer] );
        } else if ( !req.params.layer ) {
          send( err, data );
        } else {
          send( 'Layer not found', null);
        }
      });
    } else {
      res.send('Must specify a user and geocommons id', 404);
    }
  },

  featureservice: function(req, res){
    var callback = req.query.callback;
    delete req.query.callback;

    function send( err, data ){
      if ( err ){
        res.json( err, 500 );
      } else if ( data ){
        if ( FeatureServices[ req.params.layer ]){
          FeatureServices[ req.params.layer ]( data, req.query || {}, function( d ){
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
            FeatureServices[ req.params.method ]( data, req.query || {}, function( d ){
              if ( callback ){
                res.send( callback + '(' + JSON.stringify( d ) + ')' );
              } else {
                res.json( d );
              }
            });
          } else {
            FeatureServices.info( data, req.params.layer, req.query || {}, function( d ){
              if ( callback ){
                res.send( callback + '(' + JSON.stringify( d ) + ')' );
              } else {
                res.json( d );
              }
            });
          }
        }

      } else {
        res.send('There a problem accessing this overlay', 500);
      }
    };

    if ( req.params.id ){
      var id = req.params.id;
      Geocommons.find( id, req.query, function( err, data) {
        send( err, data );
      });
    } else {
      res.send('Must specify an id', 404);
    }

  },

  preview: function(req, res){
    res.view('demo/geocommons', { locals:{ id: req.params.id } });
  }


};
