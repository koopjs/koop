// App bootstrap
// Code to run before launching the app
//
// Make sure you call cb() when you're finished.
var argv = require('optimist').argv;

module.exports.bootstrap = function (cb) {
  setTimeout(function(){ require('../api/providers/'); }, 1000);
 
  // use redis for expiring cache requests  
  var redis = require("redis");
  Cache.redis = redis.createClient();

  // use mongo to store data 
  Cache.db = Mongo.connect(( argv.mongo || 'localhost:27017/koop' ) + '?auto_reconnect=true&poolSize=10');
  cb();
};
