var pg = require('pg'),
  _ = require('lodash'),
  WKT = require('terraformer-wkt-parser'),
  sm = require('sphericalmercator'),
  merc = new sm( { size:256 } );

var config = require('./config');

var OSM = function(){

  var conString = "postgres://localhost/" + config.osmdb;

  this.client = new pg.Client(conString);
  this.client.connect(function(err) {
    if(err) {
      console.error('could not connect to postgres', err);
    }
  });

  this.getData = function( table, options, callback ){
    var query = this._buildQueryString(table, options);
    this.client.query(query, function(err, result) {
      if(err) {
        callback( err, null);
      } else {
        var json = {type: 'FeatureCollection', features: []};
        var feature, geom;
        result.rows.forEach(function(row){
          geom = JSON.parse(row.geometry);
          if (geom.type == 'Point'){
            geom.coordinates = merc.inverse( geom.coordinates );
          } else if (geom.type == 'Polygon'){
            var coords = [];
            geom.coordinates[0].forEach(function(c){
              coords.push(merc.inverse( c ));
            });
            geom.coordinates[0] = coords;
          }
          feature = {properties: row, geometry: geom, type: 'Feature'};
          delete feature.properties.way;
          delete feature.properties.geometry;

          json.features.push(feature);
        });
        callback(null, json);
      }
    });
  };

  this.distinct = function(field, table, options, callback){
    var tfield = table+'.'+field;
    var select = 'SELECT DISTINCT ' + tfield + ' FROM ' + table + ' WHERE ' + tfield + ' is not null';
    console.log(select);
    this.client.query(select, function(err, result) {
      if(err) {
        callback(err, null);
      } else {
        callback(null, _.pluck(result.rows, field));
      }
    });
  };

  this.count = function(field, table, options, callback){
    var tfield = table+'.'+field;
    var select = 'SELECT count(osm_id)::int, '+tfield+' FROM '+table;
    if ( options.where ){
      select += ' WHERE ' + options.where;
    }
    select += ' GROUP BY '+tfield;
    console.log(select)
    this.client.query(select, function(err, result) {
      if(err) {
        callback(err, null);
      } else {
        callback(null, result.rows);
      }
    });
  };

  this._buildQueryString = function(table, options){
    var limit = options.limit || 1000;
    //console.log(options); 
    var query = 'SELECT *, ST_AsGeoJson(way) as geometry from ';
    query +=  table;
    if ( options.where ) { 
      query += ' WHERE ' + options.where;
      if ( options.geometry ) { 
        var geom = JSON.parse(options.geometry);
        //query += " AND geometry && '"+WKT.convert+"'::geometry";
        query += ' AND ST_Intersects(way, ST_MakeEnvelope('+geom.xmin+','+geom.ymin+','+geom.xmax+','+geom.ymax+', 900913))';
      }
    } else if ( options.geometry ) {
      var geom = JSON.parse(options.geometry);
      query += ' WHERE ST_Intersects(way, ST_MakeEnvelope('+geom.xmin+','+geom.ymin+','+geom.xmax+', '+geom.ymax+', 900913))'; 
    }
    query += ' LIMIT ' + limit;
    if ( options.offset ) query += ' OFFSET ' + options.offset;
    console.log(query);
    return query;
  };

}
  

module.exports = new OSM();
  
