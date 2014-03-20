// App bootstrap
// Code to run before launching the app
//
// Make sure you call cb() when you're finished.
var argv = require('optimist').argv,
  Peechee = require('peechee'),
  spawnasync = require('spawn-async'),
  fs = require('fs');

var bunyan = require('bunyan');


module.exports.bootstrap = function (cb) {
  setTimeout(function(){ 
    require('../api/providers/'); 
  
    // the default sstyles for points, lines, and polygons in thumbnails and png tiles
    sails.config.defaultStyle = fs.readFileSync('./api/templates/renderers/style.mss','utf8');

    sails.config.log = new bunyan({
      'name': 'koop-log',
      streams: [{
              type: 'rotating-file',
              path: '/var/log/koop.log',
              period: '1d',   // daily rotation
              count: 3        // keep 3 back copies
      }]
    });
    // this worker allows us to kick off system commands w/o blocking
    sails.worker = spawnasync.createWorker({'log': sails.config.log});

    // TODO refactor the db configuration to support different types of db backends 
    if ( sails.config.db.postgis ){
      Cache.db = PostGIS.connect( sails.config.db.postgis.conn );
    } else {
      Cache.db = Local;
    }

    // set up an instance of peechee for saving files (downloads) 
    sails.peechee = new Peechee( sails.config.peechee );

    cb();
  }, 1000);
};
