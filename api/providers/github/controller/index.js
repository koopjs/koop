var sm = require('sphericalmercator'),
  extend = require('node.extend'),
  base = require('../../base/controller.js'),
  merc = new sm({size:256}),
  crypto = require('crypto'),
  fs = require('fs');

// inherit from base controller
var Controller = extend( {}, base );


// general helper for not found repos
Controller.notFound = function(req, res){
  res.send('Must specify a user, repo, and file', 404);
};


// general helper for error'd requests
Controller.Error = function(req, res){
  res.send('There was a problem accessing this repo', 500);
};


// renders an empty map with a text input 
Controller.index = function(req, res){
  res.view('github/index');
};

Controller.thumbnail = function(req, res){
  // check the image first and return if exists
  var key = ['github', req.params.user, req.params.repo, req.params.file].join(':');
  var dir = sails.config.data_dir + '/thumbs/';
  req.query.width = parseInt( req.query.width ) || 150;
  req.query.height = parseInt( req.query.height ) || 150;
  req.query.f_base = dir + key + '/' + req.query.width + '::' + req.query.height;
  
  var _reply = function(err, data){
     if ( err ){
       res.json( err, 500 );
     } else if ( data ){
        // generate a thumbnail
        Thumbnail.generate( data[0], key, req.query, function(err, file){
          if (err){
            res.send(err, 500);
          } else {
            // send back image
            res.sendfile( file );
          }
        });
        //res.json( data );
     } else {
       this.Error(req, res);
     }
  };


  var fileName = Thumbnail.exists(key, req.query);
  if ( fileName ){
    res.sendfile( fileName );
  } else {

   if ( req.params.user && req.params.repo && req.params.file ){
      req.params.file = req.params.file.replace('.geojson', '');
      Github.find(req.params.user, req.params.repo, req.params.file, req.query, _reply );
    } else if ( req.params.user && req.params.repo, req.query ) {
      Github.find(req.params.user, req.params.repo, null, req.query, _reply );
    } else {
      this.notFound(req, res);
    }
  }
};

// 
Controller.getRepo = function(req, res){
    var key = ['github'];

    // method to respond to model finds
    var _send = function( err, data ){
      var len = data.length;
      var allTopojson = [];
      var processTopojson = function( topology ){
        allTopojson.push(topology);
        if ( allTopojson.length == len ) {
          res.json( allTopojson[0] );
        }
      };

      if ( err ){
        res.json( err, 500 );
      } else if ( data ){
        if ( req.query.topojson ){ 
          data.forEach(function( d ){
            Topojson.convert(d, function(err, topology){
              processTopojson( topology );
            });
          });
        } else if ( req.params.format ) {
          var dir = ['github', req.params.user, req.params.repo, req.params.file].join(':');
          // build the file key as an MD5 hash that's a join on the paams and look for the file 
          var toHash = JSON.stringify( req.params ) + JSON.stringify( req.query );
          var key = crypto.createHash('md5').update( toHash ).digest('hex');

          var fileName = [sails.config.data_dir + 'files', dir, key + '.' + req.params.format].join('/');

          if (fs.existsSync( fileName )){
            res.sendfile( fileName );
          } else {
            Exporter.exportToFormat( req.params.format, dir, key, data[0], function(err, file){
              if (err){
                res.send(err, 500);
              } else {
                res.sendfile( file );
              }
            });
          }
        } else {
          res.json( data );
        }
      } else {
        this.Error(req, res);
      }
    }
    if ( req.params.user && req.params.repo && req.params.file ){
      req.params.file = req.params.file.replace('.geojson', '');
      Github.find(req.params.user, req.params.repo, req.params.file, req.query, _send );
    //} else if ( req.params.user && req.params.repo, req.query ) {
    //  Github.find(req.params.user, req.params.repo, null, req.query, _send );
    } else {
      this.notFound(req, res);
    }
};

Controller.featureservice = function(req, res){
    var callback = req.query.callback, self = this;
    delete req.query.callback;

    if ( req.params.user && req.params.repo && req.params.file ){
      req.params.file = req.params.file.replace('.geojson', '');
      Github.find( req.params.user, req.params.repo, req.params.file, req.query, function( err, data){
        delete req.query.geometry;
        Controller._processFeatureServer( req, res, err, data, callback);
      });
    } else if ( req.params.user && req.params.repo && !req.params.file ) {
      Github.find( req.params.user, req.params.repo, null, req.query, function( err, data){
        delete req.query.geometry;
        Controller._processFeatureServer( req, res, err, data, callback);
      });
    } else {
      this.notFound(req, res);
    }

};

// Handle the preview route 
// renders views/demo/github 
Controller.preview = function(req, res){
   req.params.file = req.params.file.replace('.geojson', '');
   res.view('demo/github', { locals:{ user: req.params.user, repo: req.params.repo, file: req.params.file } });
};

// Handle the tile preview route
Controller.tile_preview = function(req, res){
   req.params.file = req.params.file.replace('.geojson', '');
   res.view('demo/github_tiles', { locals:{ user: req.params.user, repo: req.params.repo, file: req.params.file } });
};

Controller.topojson_preview = function(req, res){
    req.params.file = req.params.file.replace('.geojson', '');
    res.view('demo/github_topojson', { locals: { 
      user: req.params.user, 
      repo: req.params.repo, 
      file: req.params.file 
      } 
    });
};

Controller.tiles = function( req, res ){
    var callback = req.query.callback;
    delete req.query.callback;
    
    var key,
      layer = req.params.layer || 0;

    var _send = function( err, data ){
        req.params.key = key + ':' + layer;
        if (req.query.style){
          req.params.style = req.query.style;
        }
        Tiles.get( req.params, data[ layer ], function(err, tile){
          if ( req.params.format == 'png'){
            //res.contentType('image/png');
            res.sendfile( tile );
          } else {
            if ( callback ){
              res.send( callback + '(' + JSON.stringify( tile ) + ')' );
            } else {
              res.json( tile );
            }
          }
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
        fs.readFile(file, function(err, data){
          if ( callback ){
            res.send( callback + '(' + data + ')' );
          } else {
            res.json( JSON.parse( data ) );
          }
        })
      }
    };

    if ( req.params.user && req.params.repo && req.params.file ){
      req.params.file = req.params.file.replace('.geojson', '');
      key = ['github', req.params.user, req.params.repo, req.params.file].join(':');
      var file = sails.config.data_dir + 'tiles/';
        file += key + ':' + layer + '/' + req.params.format;
        file += '/' + req.params.z + '/' + req.params.x + '/' + req.params.y + '.' + req.params.format;
      
      if ( !fs.existsSync( file ) ) {
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
};


module.exports = Controller;

