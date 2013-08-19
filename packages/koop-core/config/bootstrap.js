// App bootstrap
// Code to run before launching the app
//
// Make sure you call cb() when you're finished.
module.exports.bootstrap = function (cb) {
  setTimeout(function(){ require('../api/providers/'); }, 1000);
  Cache.start();
	cb();
};
