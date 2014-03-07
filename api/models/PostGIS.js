var _ = require('lodash'),
  pg = require('pg');

var sm = require('sphericalmercator'),
  merc = new sm({size:256});

module.exports = {
  infoTable: 'koopinfo', 
  timerTable: 'kooptimers', 

  connect: function( conn ){
    var self = this;
    this.client = new pg.Client( conn );
    this.client.connect(function(err) {
      if ( err ){
        //sails.config.log.info('Cannot connect to the given database', conn);
        process.exit();
      } else {
        //sails.config.log.info('Connected to postgres db for storage', conn);
        // creates table only if they dont exist
        self._createTable(self.infoTable, "( id varchar(255) PRIMARY KEY, info JSON)");
        self._createTable(self.timerTable, "( id varchar(255) PRIMARY KEY, expires timestamp)");
      }
    });
    return this; 
  },


  // get data out of the db
  select: function(key, options, callback){
    var self = this;
    //var layer = 0;
    var error = false,
      totalLayers,
      queryOpts = {}, 
      allLayers = [];

    // closure to check each layer and send back when done
    var collect = function(err, data){
      if (err) error = err;
      allLayers.push(data);
      if (allLayers.length == totalLayers){
        callback(error, allLayers);
      }
    };

    this._query('select info from "'+this.infoTable+'" where id=\''+(key+':'+(options.layer || 0 )+":info")+'\'', function(err, result){
      if ( err || !result || !result.rows || !result.rows.length ){
        callback('Not Found', []);
      } else {
        var info = result.rows[0].info;
          var select = 'select feature from "' + key+':'+(options.layer || 0)+'"'; 

          if ( options.geometry ){

            if ( typeof(options.geometry) == 'string' ){
              try {
                options.geometry = JSON.parse( options.geometry );
              } catch(e){
                console.log('Error parsing options.geometry', options.geometry);
              }
            }

            if (options.geometry.xmin && options.geometry.ymin){
              var box = options.geometry;
              if (box.spatialReference.wkid != 4326){
                var mins = merc.inverse( [box.xmin, box.ymin] ),
                  maxs = merc.inverse( [box.xmax, box.ymax] );
                box.xmin = mins[0],
                box.ymin = mins[1],
                box.xmax = maxs[0],
                box.ymax = maxs[1];
              }

              select += ' WHERE ST_Intersects(ST_GeomFromGeoJSON(feature->>\'geometry\'), ST_MakeEnvelope('+box.xmin+','+box.ymin+','+box.xmax+','+box.ymax+'))';
            }
          }
          self._query( select, function (err, result) {
            if ( result && result.rows && result.rows.length ) {
              callback( null, [{
                type: 'FeatureCollection', 
                features: _.pluck(result.rows, 'feature'),
                name: info.name, 
                sha: info.sha, 
                updated_at: info.updated_at 
              }]);
            } else {
              callback( 'Not Found', [{
                type: 'FeatureCollection',
                features: []
              }]);
            }
          });
      }
    });
  },

  // create a collection and insert features
  // create a 2d index 
  insert: function( key, geojson, layerId, callback ){
    var self = this; 
    var info = {},
      count = 0;
      error = null;
      
      info.name = geojson.name ;
      info.updated_at = geojson.updated_at;
      info.sha = geojson.sha;
   
      var table = key+':'+layerId;

      self._createTable( table, self._buildSchemaFromFeature(), function(err, result){
        // insert each feature
        geojson.features.forEach(function(feature, i){
          self._insertFeature(table, feature, i);
        });

        // TODO Why not use an update query here? 
        self._query( 'delete from "'+self.infoTable+'" where id=\''+table+':info\'', function(err,res){
          self._query( 'insert into "'+self.infoTable+'" values (\''+table+':info\',\''+JSON.stringify(info)+'\')', function(err, result){
            callback(err, true);
          });
        });
      });     
    
  },

  insertPartial: function( key, geojson, layerId, callback ){
    var self = this;
    var info = {};

    var table = key+':'+layerId;
    geojson.features.forEach(function(feature, i){
        self._insertFeature(table, feature, i);
    });
    callback(null, true);
  },

  // inserts geojson features into the feature column of the given table
  _insertFeature: function(table, feature, i){
    var sql = 'insert into "'+table+'" (feature) VALUES (\''+JSON.stringify(feature).replace(/'/g, "")+'\')' ;
    this._query(sql);
  },


  remove: function( key, callback){
    var self = this;
  
    this._query('select info from "'+this.infoTable+'" where id=\''+(key+":info")+"'", function(err, result){
      if ( !result || !result.rows.length ){
        // nothing to remove
        callback( null, true );
      } else {
        var info = result.rows[0].info;
        self.dropTable(key, function(err, result){
            self._query("delete from \""+self.infoTable+"\" where id='"+(key+':info')+"'", function(err, result){
              if (callback) callback( err, true);
            });
        });
      }
    });
  },

  dropTable: function(table, callback){
    this._query('drop table "'+table+'"' , callback);
  },

  services: { 
    register: function( type, info, callback){
      PostGIS._createTable(type, '( id varchar(100), host varchar(100))', function(err, result){
        PostGIS._query('select * from "'+type+'" where id=\''+info.id+"\'", function(err, res){
          if ( err || !res || !res.rows || !res.rows.length ) {
            var sql = 'insert into "'+type+'" (id, host) VALUES (\''+info.id+'\', \''+info.host+'\')' ;
            PostGIS._query(sql, function(err, res){
              callback( err, true );
            });
          } else {
            callback( err, true );
          }
        });  
      });
    },

    count: function( type, callback){
      var sql = 'select count(*) as count from "'+type+'"';
      PostGIS._query(sql, function(err, res){
        if (err || !res || !res.rows || !res.rows.length){
          callback( err, 0 );
        } else {
          callback( err, res.rows[0].count );
        }
      });
    },

    remove: function( type, id, callback){
      var sql = 'delete from "'+type+'" where id=\''+id+"'";
      PostGIS._query(sql, function(err, res){
        callback( err, true );
      });
    },

    get: function( type, id, callback){
      PostGIS._createTable(type, '( id varchar(100), host varchar(100))', function(err, result){
        if (!id) {
          var sql = 'select * from "'+type+'"';
          PostGIS._query(sql, function(err, res){
            callback( err, res.rows);
          });
        } else {
          var sql = 'select * from "'+type+'" where id=\''+id+"\'";
          PostGIS._query(sql, function(err, res){
            if (err || !res || !res.rows || !res.rows.length){
              err = 'No service found by that id';
              callback( err, null);
            } else {
              callback( err, res.rows[0]);
            }
          });
        }
      });
    }
  },

  timer: {
    set: function(key, expires, callback){
      var now = new Date().getTime();
      var expires_at = new Date( now + expires );
      PostGIS._query('delete from "'+ PostGIS.timerTable +'" WHERE id=\''+key+"\'", function(err,res){
        PostGIS._query('insert into "'+ PostGIS.timerTable +'" (id, expires) VALUES (\''+key+'\', \''+expires_at.toUTCString()+'\')', function(err, res){
          callback( err, res);
        });
      });
    },
    get: function(key, callback){
      PostGIS._query('select * from "'+ PostGIS.timerTable + '" where id=\''+key+"\'", function(err, res){
        if (err || !res || !res.rows || !res.rows.length ){
          callback( err, null);
        } else {
          
          if ( new Date().getTime() < new Date(res.rows[0].expires).getTime()){
            callback( err, res.rows[0]);
          } else {
            callback( err, null);
          }
        }
      });
    }
  },


  //--------------
  // PRIVATE METHODS
  //-------------

  _query: function(sql, callback){
    this.client.query(sql, callback);
  },


  // checks to see in the info table exists, create it if not
  _createTable: function(name, schema, callback){
    var self = this;
    var sql = "select exists(select * from information_schema.tables where table_name='"+ name +"')";
    this.client.query(sql, function(err, result){
      if ( !result.rows[0].exists ){
        var create = "CREATE TABLE \"" + name + "\" " + schema;
        self.client.query(create, function(err, result){
          if (callback) {
            callback();
          }
        });
      } else if (callback){
        callback();
      }
    });
  },

  _buildSchemaFromFeature: function(feature){
    var schema = '(';
    var props = ['id SERIAL PRIMARY KEY', 'feature JSON'];
    schema += props.join(',') + ')';
    return schema;
  }

};
