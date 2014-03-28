var extend = require('node.extend'),
  base = require('../../base/controller.js');

// inherit from base controller
var Controller = extend({
  serviceName: 'osm',

  tables: {
    points:'planet_osm_point',
    polygons:'planet_osm_polygon',
    lines: 'planet_osm_line_koop',
    roads: 'planet_osm_roads_koop'
  },

  // a mapping of types to views 
  views:{
    points:'planet_osm_point_koop',
    polygons:'planet_osm_polygon_koop',
    lines: 'planet_osm_line_koop',
    roads: 'planet_osm_roads_koop'
  }, 

  // renders an empty map with a text input 
  explore: function(req, res){
    res.view('osm/index', { locals:{ where: req.query.where } });
  },
    
  base_url: 'http://'+sails.config.host+':'+sails.config.port+'/osm',

  listTypes: function(req, res){
    var links = {};
    for (var type in Controller.tables ){
      links[type] = Controller.base_url + '/' + type;
    }
    res.json( links );
  },

  getData: function(req, res){
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
  },

  getCounts: function(req, res){
    console.log(req.params.boundaryType, view);
    var view = Controller.views[req.params.type];
    if ( !view ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else {
      OSM.count( req.params.boundaryType, view, req.query, function(err, data){
        res.json( data );
      });
    }
  },

  getDistinct: function(req, res){
    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else {
      OSM.distinct( req.params.field, table, req.query, function(err, data){
        res.json( data );
      });
    }
  }


}, base);

module.exports = Controller;
