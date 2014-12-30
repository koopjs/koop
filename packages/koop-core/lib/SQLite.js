var _ = require('lodash'),
  sql = require('sql-parser'),
  sqlite = require('spatialite').verbose(),
  sm = require('sphericalmercator'),
  merc = new sm({size:256});

module.exports = {
  infoTable: 'koopinfo',
  timerTable: 'kooptimers',

  connect: function( opt ){
    var self = this;
    if (!opt.filename)
      opt.filename = ':memory:';

    this.db = new sqlite.Database(opt.filename, function(err){
      if (err) {
        process.exit();
      } else {
        self._createTable(self.infoTable, "( id varchar(255) PRIMARY KEY, info TEXT)");
        self._createTable(self.timerTable, "( id varchar(255) PRIMARY KEY, expires varchar(25))");
      }
    });

    return this;
  },

  // returns the info doc for a key
  getInfo: function( key, callback ){
    this._query('select info from "'+this.infoTable+'" where id=\''+key+":info\'", function(err, rows){
      if ( err || !rows || !rows.length ){
        callback('Key Not Found ' + key, null);
      } else {
        var info = rows[0].info;
        callback(null, info);
      }
    });
  },

  // updates the info doc for a key
  updateInfo: function( key, info, callback ){
    this._run("update " + this.infoTable + " set info = '" + JSON.stringify(info) + "' where id = '"+key+":info'", function(err){
      if ( err ){
        callback('Key Not Found ' + key, null);
      } else {
        callback(null, true);
      }
    });
  },


  oneFilter: function( clause ){
    return ' feature->\'properties\'->>\''+clause.left.value+'\' ' + ((clause.operation == 'like') ? 'ilike' : clause.operation) + ' \'' + clause.right.value + '\'';
  },

  orFilter: function( select, clause ){
      if ( clause.left.operation.toLowerCase() == 'like' || clause.left.operation.toLowerCase() == '='){
        select += this.oneFilter( clause.left );
      } else if (clause.left.operation.toLowerCase() == 'or'){
        select = this.orFilter( select, clause.left );
      }

      if ( clause.right.operation.toLowerCase() == 'like' || clause.right.operation.toLowerCase() == '='){
        select += ' OR ' + this.oneFilter( clause.right );
      }
    return select;
  },

  parseWhere: function(select, where){
    select += ' WHERE ';
    if ( where.conditions.operation.toLowerCase() == 'like' || where.conditions.operation.toLowerCase() == '='){
      select += this.oneFilter( where.conditions );
    } else if ( where.conditions.operation.toLowerCase() == 'or'){
      select = this.orFilter( select, where.conditions );
    }
    return select;
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

    this._query('select info from "'+this.infoTable+'" where id=\''+(key+':'+(options.layer || 0 )+":info")+'\'', function(err, rows){
      if ( err || !rows || !rows.length ){
        callback('Not Found', []);
      } else if (rows[0].info.status == 'processing' && !options.bypassProcessing ) {
        callback( null, [{ status: 'processing' }]);
      } else {
          var info = JSON.parse(rows[0].info);
          var select = 'select feature from "' + key+':'+(options.layer || 0)+'"';

          // parse the where clause
          if ( options.where && options.where != '1=1'){
            var where = sql.parse( 'select * from foo where '+ options.where).where;
            select = self.parseWhere( select, where);
          }

          // parse the geometry param from GeoServices REST
          if ( options.geometry ){

            if ( typeof(options.geometry) == 'string' ){
              try {
                options.geometry = JSON.parse( options.geometry );
              } catch(e){
                console.log('Error parsing options.geometry', options.geometry);
                try {
                  if ( options.geometry.split(',').length == 4 ){
                    var extent = options.geometry.split(',');
                    options.geometry = { spatialReference: {wkid: 4326} };
                    options.geometry.xmin = extent[0];
                    options.geometry.ymin = extent[1];
                    options.geometry.xmax = extent[2];
                    options.geometry.ymax = extent[3];
                  }
                } catch(ex){
                  console.log('Error building bbox from', options.geometry);
                }
              }
            }

            if (options.geometry.xmin && options.geometry.ymin ){
              var box = options.geometry;
              if (box.spatialReference.wkid != 4326){
                var mins = merc.inverse( [box.xmin, box.ymin] ),
                  maxs = merc.inverse( [box.xmax, box.ymax] );
                box.xmin = mins[0];
                box.ymin = mins[1];
                box.xmax = maxs[0];
                box.ymax = maxs[1];
              }

              select += (options.where ) ? ' AND ' : ' WHERE ';
              select += 'ST_Intersects(ST_GeomFromGeoJSON(feature->>\'geometry\'), ST_MakeEnvelope('+box.xmin+','+box.ymin+','+box.xmax+','+box.ymax+'))';
            }
          }

          if ( options.limit ) {
            select += ' LIMIT ' + options.limit;
          }

          //console.log(select);
          self._query( select, function (err, rows) {
            if ( rows && rows.length ) {
              callback( null, [{
                type: 'FeatureCollection',
                features: _.map(_.pluck(rows, 'feature'), function(jsonStr) { return JSON.parse(jsonStr); }),
                name: info.name,
                sha: info.sha,
                info: info.info,
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
      info.expires_at = geojson.expires_at;
      info.retrieved_at = geojson.retrieved_at;
      info.status = geojson.status;
      info.format = geojson.format;
      info.sha = geojson.sha;
      info.info = geojson.info;

      var table = key+':'+layerId;

      self._createTable( table, self._buildSchemaFromFeature(), function(err){

        // insert each feature
        if ( geojson.length ){
          geojson = geojson[0];
        }
        geojson.features.forEach(function(feature, i){
          self._run(self._insertFeature(table, feature, i), function(err){
          });
        });

        // TODO Why not use an update query here?
        self._run( 'delete from "'+self.infoTable+'" where id=\''+table+':info\'', function(err){
          self._run( 'insert into "'+self.infoTable+'" values (\''+table+':info\',\''+JSON.stringify(info).replace(/'/g,'')+'\')', function(err){
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
        self._run(self._insertFeature(table, feature, i));
    });
    callback(null, true);
  },

  // inserts geojson features into the feature column of the given table
  _insertFeature: function(table, feature, i){
    return 'insert into "'+table+'" (feature) VALUES (\''+JSON.stringify(feature).replace(/'/g, "").replace(/\(\)/g,'')+'\');';
  },


  remove: function( key, callback){
    var self = this;

    this._query('select info from "'+this.infoTable+'" where id=\''+(key+":info")+"'", function(err, rows){
      if ( !rows || !rows.length ){
        // nothing to remove
        callback( null, true );
      } else {
        var info = rows[0].info;
        self.dropTable(key, function(err, result){
            self._run("delete from \""+self.infoTable+"\" where id='"+(key+':info')+"'", function(err){
              if (callback) callback( err, true);
            });
        });
      }
    });
  },

  dropTable: function(table, callback){
    this._run('drop table "'+table+'"' , callback);
  },

  serviceRegister: function( type, info, callback){
    var self = this;
    this._createTable(type, '( id varchar(100), host varchar(100))', function(err){
      self._query('select * from "'+type+'" where id=\''+info.id+"\'", function(err, rows){
        if ( err || !rows || !rows.length ) {
          var sql = 'insert into "'+type+'" (id, host) VALUES (\''+info.id+'\', \''+info.host+'\')' ;
          self._run(sql, function(err){
            callback( err, true );
          });
        } else {
          callback( err, true );
        }
      });
    });
  },

  serviceCount: function( type, callback){
    var sql = 'select count(*) as count from "'+type+'"';
    this._query(sql, function(err, rows){
      if (err || !rows || !rows.length){
        callback( err, 0 );
      } else {
        callback( err, rows[0].count );
      }
    });
  },

  serviceRemove: function( type, id, callback){
    var sql = 'delete from "'+type+'" where id=\''+id+"'";
    this._run(sql, function(err){
      callback( err, true );
    });
  },

  serviceGet: function( type, id, callback){
    var sql;
    if (!id) {
      sql = 'select * from "'+type+'"';
      this._query(sql, function(err, rows){
        callback( err, rows);
      });
    } else {
      sql = 'select * from "'+type+'" where id=\''+id+"\'";
      this._query(sql, function(err, rows){
        if (err || !rows || !rows.length){
          err = 'No service found by that id';
          callback( err, null);
        } else {
          callback( err, rows[0]);
        }
      });
    }
  },

  timerSet: function(key, expires, callback){
      var self = this;
      var now = new Date();
      var expires_at = new Date( now.getTime() + expires );
      this._run('delete from "'+ this.timerTable +'" WHERE id=\''+key+"\'", function(err){
        self._run('insert into "'+ self.timerTable +'" (id, expires) VALUES (\''+key+'\', \''+expires_at.getTime()+'\')', function(err){
          callback( err, null );
        });
      });
  },

  timerGet: function(key, callback){
      this._query('select * from "'+ this.timerTable + '" where id=\''+key+"\'", function(err, rows){
        if (err || !rows || !rows.length){
          callback( err, null);
        } else {
          if ( new Date().getTime() < parseInt( rows[0].expires )){
            callback( err, rows[0]);
          } else {
            callback( err, null);
          }
        }
      });
  },


  //--------------
  // PRIVATE METHODS
  //-------------

  _run: function(sql, callback){
    this.db.exec(sql, callback);
  },

  _query: function(sql, callback){
    this.db.all(sql, callback);
  },

  // checks to see in the info table exists, create it if not
  _createTable: function(name, schema, callback){
    var self = this;
    this.db.serialize(function() {
      self.db.run("CREATE TABLE IF NOT EXISTS\"" + name + "\" " + schema, callback);
    });
  },

  _buildSchemaFromFeature: function(feature){
    var schema = '(';
    var props = ['id SERIAL PRIMARY KEY', 'feature JSON'];
    schema += props.join(',') + ')';
    return schema;
  }

};
