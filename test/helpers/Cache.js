var DataCache = require('../../lib/Cache.js'),
  PostGIS = require('../../lib/PostGIS.js'),
  SQLite = require('../../lib/SQLite.js'),
  koop = require('../../lib/index');
  config = require('config');

config.logfile = __dirname + "/../test.log";

// init the koop log based on config params 
koop.log = new koop.Logger( config );

var Cache = new DataCache( koop ); 

if (config.db.postgis)
  Cache.db = PostGIS.connect(config.db.postgis.conn);
else if (config.db.sqlite)
  Cache.db = SQLite.connect(config.db.sqlite);

Cache.db.log = koop.log;

exports.config = config;
exports.cache = Cache;
