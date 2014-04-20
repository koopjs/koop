var express = require("express");
  var Peechee = require('peechee'),
  spawnasync = require('spawn-async'),
  fs = require('fs');
  bunyan = require('bunyan');

module.exports = function(config) {
  var app = express();

  // serve the index 
  app.get("/", function(req, res, next) {
    res.render('/home/index');
  });

  // register providers into the app
  // sets up models, routes -> controllers/handlers 
  app.register = function(provider){
    //console.log(provider);
  
    for (var route in provider.routes){
      var path = route.split(' ');
      app[path[0]]( path[1], provider.controller[ 
        provider.routes[ route ].action 
      ]);
    }

    global[provider.name] = provider.model;
  };


  setTimeout(function(){ 
    // the default sstyles for points, lines, and polygons in thumbnails and png tiles
    config.defaultStyle = fs.readFileSync('./lib/templates/renderers/style.mss','utf8');

    config.log = new bunyan({
      'name': 'koop-log',
      streams: [{
              type: 'rotating-file',
              path: config.logfile,
              period: '1d',   // daily rotation
              count: 3        // keep 3 back copies
      }]
    });

    // allow us to kick off system commands w/o blocking
    config.worker = spawnasync.createWorker({'log': config.log});

    // TODO refactor the db configuration to support different types of db backends
    if ( config.db.postgis ){
      Cache.db = PostGIS.connect( config.db.postgis.conn );
    } else {
      Cache.db = Local;
    }

    // set up an instance of peechee for saving files (downloads) 
    if ( config.peechee && config.peechee.type == 's3' ){
      global['peechee'] = new Peechee( config.peechee );
    }
  }, 1000);

  return app;
};
