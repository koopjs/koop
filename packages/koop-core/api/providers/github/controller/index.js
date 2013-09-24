
module.exports = {
  
  provider: true,

  notFound: function(req, res){
    res.send('Must specify a user, repo, and file', 404);
  },

  index: function(req, res){
    res.view('github/index');
  },

  getRepo: function(req, res){
    var _send = function( err, data ){
      if ( err ){
        res.json( err, 500 );
      } else if ( data ){
        console.log('sending data',data);
        res.json( data );
      } else {
        res.send('There was a problem accessing this repo', 500);
      }
    }
    if ( req.params.user && req.params.repo && req.params.file ){
      req.params.file = req.params.file.replace('.geojson', '');
      console.log('wtf?');
      Github.find(req.params.user, req.params.repo, req.params.file, _send );
    } else if ( req.params.user && req.params.repo ) {
      Github.find(req.params.user, req.params.repo, null, _send );
    } else {
      res.send('Must specify at least a user and a repo', 404);
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
          } else if ( data.length ) { 
            //data = data[0];
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
                res.json( d );
              }
            });
          }
        }

      } else {
        res.send('There a problem accessing this repo', 500);
      }
    };

    if ( req.params.user && req.params.repo && req.params.file ){
      req.params.file = req.params.file.replace('.geojson', '');
      Github.find( req.params.user, req.params.repo, req.params.file, function( err, data){
        send( err, data );
      });
    } else if ( req.params.user && req.params.repo && !req.params.file ) {
      Github.find( req.params.user, req.params.repo, null, function( err, data){
        send( err, data );
      });
    } else {
      res.send('Must specify a user, repo, and file', 404);
    }

  },

  preview: function(req, res){
   req.params.file = req.params.file.replace('.geojson', '');
   res.view('demo/github', { locals:{ user: req.params.user, repo: req.params.repo, file: req.params.file } });
  },

  tiles: function( req, res ){
    res.json( req.params );
  }


};
