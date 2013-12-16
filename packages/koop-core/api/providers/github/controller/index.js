var sm = require('sphericalmercator'),
  extend = require('node.extend'),
  base = require('../../base/controller.js'),
  merc = new sm({size:256}),
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

// 
Controller.getRepo = function(req, res){

    // method to respond to model finds
    var _send = function( err, data ){
      var len = data.length;
      var allTopojson = [];
      var processTopojson = function( topology ){
        allTopojson.push(topology);
        if ( allTopojson.length == len ) {
          res.json( allTopojson );
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
    } else if ( req.params.user && req.params.repo, req.query ) {
      Github.find(req.params.user, req.params.repo, null, req.query, _send );
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
        Controller._processFeatureServer( req, res, err, data, callback);
      });
    } else if ( req.params.user && req.params.repo && !req.params.file ) {
      Github.find( req.params.user, req.params.repo, null, req.query, function( err, data){
        Controller._processFeatureServer( req, res, err, data, callback);
      });
    } else {
      this.notFound(req, res);
    }

};

Controller.preview = function(req, res){
   req.params.file = req.params.file.replace('.geojson', '');
   res.view('demo/github', { locals:{ user: req.params.user, repo: req.params.repo, file: req.params.file } });
};

module.exports = Controller;
