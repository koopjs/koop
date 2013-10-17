var sm = require('sphericalmercator'),
  merc = new sm({size:256}),
  fs = require('fs');

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
        res.json( data );
      } else {
        res.send('There was a problem accessing this repo', 500);
      }
    }
    if ( req.params.user && req.params.repo && req.params.file ){
      req.params.file = req.params.file.replace('.geojson', '');
      Github.find(req.params.user, req.params.repo, req.params.file, req.query, _send );
    } else if ( req.params.user && req.params.repo, req.query ) {
      Github.find(req.params.user, req.params.repo, null, req.query, _send );
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
      Github.find( req.params.user, req.params.repo, req.params.file, req.query, function( err, data){
        send( err, data );
      });
    } else if ( req.params.user && req.params.repo && !req.params.file ) {
      Github.find( req.params.user, req.params.repo, null, req.query, function( err, data){
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

  tile_preview: function(req, res){
   req.params.file = req.params.file.replace('.geojson', '');
   res.view('demo/github_tiles', { locals:{ user: req.params.user, repo: req.params.repo, file: req.params.file } });
  },

  tiles: function( req, res ){
    //console.log( req.params );
    var key,
      layer = req.params.layer || 0;

    var _send = function( err, data ){
      req.params.key = key + ':' + layer;
        Tiles.get( req.params, data[ layer ], function(err, tile){
          if ( req.params.format == 'png'){
            //res.contentType('image/png');
            res.sendfile( tile );
          } else {
            res.send( tile );
          }
        });
    }

    // build the geometry from z,x,y
    var bounds = merc.bbox( req.params.x, req.params.y, req.params.z );
    //console.log(req.params.z, req.params.x, req.params.y, bounds);
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

    if ( req.params.user && req.params.repo && req.params.file ){
      req.params.file = req.params.file.replace('.geojson', '');
      key = ['github', req.params.user, req.params.repo, req.params.file].join(':');
      var file = sails.config.data_dir + 'tiles/';
        file += key + ':' + layer + '/' + req.params.format;
        file += '/' + req.params.z + '/' + req.params.x + '/' + req.params.y + '.' + req.params.format;
      
      if ( !fs.existsSync( file ) ) {
        console.log('NOPE', file);
        Github.find(req.params.user, req.params.repo, req.params.file, req.query, _send );
      } else {
        _sendImmediate(file);
      }

    } else if ( req.params.user && req.params.repo ) {
      key = ['github', req.params.user, req.params.repo].join(':');
      var file = sails.config.data_dir + 'tiles/';
        file += key + ':' + layer + '/' + req.params.format;
        file += '/' + req.params.z + '/' + req.params.x + '/' + req.params.y + '.' + req.params.format;

      if ( !fs.existsSync( file ) ) {
        Github.find(req.params.user, req.params.repo, null, req.query, _send );
      } else {
        _sendImmediate(file);
      }

    } else {
      res.send('Must specify at least a user and a repo', 404);
    }
  }


};
