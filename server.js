#!/usr/bin/env node
"use strict";

// increase the libuv threadpool size to 1.5x the number of logical CPUs.
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || Math.ceil(Math.max(4, require('os').cpus().length * 1.5));

var cors = require("cors"),
    express = require("express"),
    config = require("config"),
    bodyParser = require('body-parser'),
    responseTime = require("response-time"),
    koop = require('./lib/koop');

var server = require("./lib/app")(config);

global['config'] = config;

// Scan package for koop plugins and require them . 
try { server.register(require("koop-github")); } catch (e) {}
try { server.register(require("koop-gist")); } catch (e) {}
try { server.register(require("koop-socrata")); } catch (e) {}
try { server.register(require("koop-agol")); } catch (e) {}

var app = express();

app.disable("x-powered-by");
app.use(responseTime());
app.use(cors());

app.set('view engine', 'ejs');
app.set('view options', {layout: 'layout.ejs'});

if (process.env.NODE_ENV === "development") {
  app.use(express.logger());
}

app.use(bodyParser());

app.use(express.static(__dirname + "/public"));
app.use(server);

app.listen(process.env.PORT || config.port || 8080, function() {
  console.log("Listening at http://%s:%d/", this.address().address, this.address().port);
});
