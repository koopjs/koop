var pg = require('pg'),
  WKT = require('terraformer-wkt-parser'),
  sm = require('sphericalmercator'),
  merc = new sm( { size:256 } );

var OSM = function(){

  var conString = "postgres://localhost/"+sails.config.osmdb;

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

  this._count = function(table, callback){
    this.client.query('SELECT count(*) as count from '+table, function(err, result) {
      if(err) {
        callback(err, null);
      } else {
        callback(null, result.rows[0].count);
      }
    });
  };

  this._buildQueryString = function(table, options){
    var limit = options.limit || 1000;
    console.log(options); 
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
  
