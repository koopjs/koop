// App bootstrap
// Code to run before launching the app
//
// Make sure you call cb() when you're finished.
var argv = require('optimist').argv;

module.exports.bootstrap = function (cb) {
  setTimeout(function(){ require('../api/providers/'); }, 1000);
  /*if (argv.redis){
    console.log('Storage: Using Redis Storage...');
    var redis = require("redis");
    Cache.redis = redis.createClient();
  } else*/ 
  if ( argv.mongo ){
    console.log('Storage: Using Mongo Storage...');
    var mongoskin = require("mongoskin");
    Cache.db = mongoskin.db('localhost:27017/koop?auto_reconnect=true&poolSize=10');
  }
	cb();
};
