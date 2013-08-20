
module.exports = {
  
  provider: true,

  notFound: function(req, res){
    res.send('Must specify a user, repo, and file', 404);
  },

  index: function(req, res){
    res.view('github/index');
  },

  getRepo: function(req, res){
    if ( req.params.user && req.params.repo && req.params.file ){
      Github.find(req.params.user, req.params.repo, req.params.file, function( err, data ){
        if ( err ){
          res.json( err, 500 );
        } else if ( data ){
          res.json( data );
        } else {
          res.send('There was a problem accessing this repo', 500);
        }
      });
    } else {
      res.send('Must specify a user, repo, and file', 404);
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
        res.send('There a problem accessing this repo', 500);
      }
    };

    if ( req.params.user && req.params.repo && req.params.file ){
      Github.find( req.params.user, req.params.repo, req.params.file, function( err, data){
        send( null, data );
      });
    } else {
      res.send('Must specify a user, repo, and file', 404);
    }

  },

  preview: function(req, res){
   res.view('demo/github', { locals:{ user: req.params.user, repo: req.params.repo, file: req.params.file } });
  }


};
