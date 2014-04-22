#!/usr/bin/env node
"use strict";

// increase the libuv threadpool size to 1.5x the number of logical CPUs.
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || Math.ceil(Math.max(4, require('os').cpus().length * 1.5));

var cors = require("cors"),
    express = require("express"),
    Peechee = require('peechee'),
    spawnasync = require('spawn-async'),
    bunyan = require('bunyan'),
    config = require("config"),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    responseTime = require("response-time"),
    koop = require('koop-server')(config);

global['config'] = config;

// Scan package for koop plugins and require them 
var files = fs.readdirSync('node_modules');
files.forEach(function(f){
  if ( f.match(/koop-*.+/) ){
    try { koop.register(require(f)); } catch (e) {}
  }
});

var app = express();

app.disable("x-powered-by");
app.use(responseTime());
app.use(cors());

app.set('view engine', 'ejs');
app.set('view options', {layout: 'layout.ejs'});

if (process.env.NODE_ENV === "development") {
  app.use(express.logger());
}

// handle POST requests 
app.use(bodyParser());

// add koop middleware
app.use(koop);

app.listen(process.env.PORT || config.server.port,  function() {
  console.log("Listening at http://%s:%d/", this.address().address, this.address().port);

  // Start the Cache DB with the conn string from config
  if ( config.db.postgis ){
    Cache.db = PostGIS.connect( config.db.postgis.conn );
  } else {
    Cache.db = Local;
  }

  //config.defaultStyle = fs.readFileSync( __dirname + '/templates/renderers/style.mss', 'utf8' );

  // A bunyan log is required for the async workers 
  config.log = new bunyan({
    'name': 'koop-log',
    streams: [{
      type: 'rotating-file',
      path: config.logfile,
      period: '1d',
      count: 3
    }]
  });

  // allow us to kick off system commands w/o blocking
  config.worker = spawnasync.createWorker({'log': config.log});

  // set up an instance of peechee for saving files (downloads) 
  if ( config.peechee && config.peechee.type == 's3' ){
    global['peechee'] = new Peechee( config.peechee );
  }

});

