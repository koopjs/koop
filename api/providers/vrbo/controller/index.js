var extend = require('node.extend'),
  base = require('../../base/controller.js');

// inherit from base controller
var Controller = extend( {}, base );

Controller.provider = true,
Controller.index = function(req, res){
  res.send('VRBO API Wrapper');
};

Controller.get = function(req, res){
  VRBO.getListings(req.params, req.query, function(err, listings){
    res.json(listings);
  });
};

Controller.featureservice = function(req, res){
    var callback = req.query.callback, self = this;
    delete req.query.callback;

    VRBO.getListings(req.params, req.query, function( err, data){
      Controller._processFeatureServer( req, res, err, data, callback);
    });
};

// Handle the preview route 
// renders views/demo/github 
Controller.preview = function(req, res){
  res.view('demo/vrbo', { locals: { 
    minx: req.params.minx, 
    miny: req.params.miny, 
    maxx: req.params.maxx, 
    maxy: req.params.maxy } 
  });
};

module.exports = Controller;
