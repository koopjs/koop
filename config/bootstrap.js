// App bootstrap
// Code to run before launching the app
//
// Make sure you call cb() when you're finished.
var argv = require('optimist').argv,
  fs = require('fs');

var bunyan = require('bunyan');


module.exports.bootstrap = function (cb) {
  setTimeout(function(){ require('../api/providers/'); }, 1000);

  sails.config.defaultStyle = fs.readFileSync('./api/templates/renderers/style.mss','utf8');

  sails.config.log = new bunyan({
    'name': sails.config.logfile || './koop.log',
    'level': process.env['LOG_LEVEL'] || 'debug'
  });

  Cache.db = PostGIS.connect( sails.config.db_conn );

  if ( argv.data_dir  ){
    sails.config.data_dir = argv.data_dir;
  }
  cb();
};
