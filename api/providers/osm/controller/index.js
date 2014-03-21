var extend = require('node.extend'),
  base = require('../../base/controller.js');

// inherit from base controller
var Controller = extend({
  serviceName: 'osm',

  tables: {
    points:'planet_osm_point',
    polygons:'planet_osm_polygon'
  },
    
  base: 'http://'+sails.config.host+':'+sails.config.port+'/osm',

  listTypes: function(req, res){
    var links = {};
    for (var type in Controller.tables ){
      links[type] = Controller.base + '/' + type;
    }
    res.json( links );
  },

  getData: function(req, res){
    var _base = 'http://'+sails.config.host+':'+sails.config.port+'/osm';
    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else {
      OSM.getData( table, req.query, function(err, data){
        res.json( data );
      });
    } 
  },

  featureserver: function( req, res ){
    var callback = req.query.callback;
    delete req.query.callback;

    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else {
      OSM.getData( table, req.query, function(err, data){
        if (err) {
          res.send( err, 500);
        } else {
          req.query.geometry;
          req.query.where;
          Controller._processFeatureServer( req, res, err, [data], callback);
        }
      });
    }
  },

  _sendError: function(res, err){
    res.send(err,500);
  } 

}, base);

module.exports = Controller;
