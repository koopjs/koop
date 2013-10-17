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

  if ( argv.mongo ){
    // use mongo to store data 
    console.log('Using Mongo DB storage');
    Cache.db = Mongo.connect(( argv.mongo || 'localhost:27017/koop' ) + '?auto_reconnect=true&poolSize=10');
  } else {
    Cache.db = Local;
  }

  if ( argv.data_dir  ){
    sails.config.data_dir = argv.data_dir;
  }
  cb();
};
