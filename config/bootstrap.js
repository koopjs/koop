// App bootstrap
// Code to run before launching the app
//
// Make sure you call cb() when you're finished.
var argv = require('optimist').argv,
  fs = require('fs'),
  pg = require('pg'); 

module.exports.bootstrap = function (cb) {
  setTimeout(function(){ require('../api/providers/'); }, 1000);

  sails.config.defaultStyle = fs.readFileSync('./api/templates/renderers/style.mss','utf8');

  // connect to the db right from the get go
  var userpw;  
  if ( sails.config.db_conn.user && sails.config.db_conn.host ){
    userpw = sails.config.db_conn.user + ':' + sails.config.db_conn.host;
  }
  var conString = "postgres://" + ((userpw) ? userpw : "") + sails.config.db_conn.host + "/" + sails.config.db_conn.name;

  Cache.db = new pg.Client(conString);
  Cache.db.connect(function(err) {
    console.log('Connected to postgres db for storage');
  });
 
  if ( argv.data_dir  ){
    sails.config.data_dir = argv.data_dir;
  }
  cb();
};
