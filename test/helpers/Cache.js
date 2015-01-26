var DataCache = require('../../lib/Cache.js'),
  koop = require('../../lib/index');
  config = require('config');

config.logfile = __dirname + "/../test.log";

// init the koop log based on config params 
koop.log = new koop.Logger( config );

var Cache = new DataCache( koop ); 
Cache.db = koop.LocalDB;
Cache.db.log = koop.log;
exports.config = config;
exports.cache = Cache;
