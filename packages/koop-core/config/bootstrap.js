// App bootstrap
// Code to run before launching the app
//
// Make sure you call cb() when you're finished.
var argv = require('optimist').argv;

module.exports.bootstrap = function (cb) {
  setTimeout(function(){ require('../api/providers/'); }, 1000);
  if (argv.redis){
    var redis = require("redis");
    Cache.redis = redis.createClient();
    
  }
	cb();
};
