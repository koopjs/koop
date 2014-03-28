// This file bootstraps the loading of all the providers in this dir
// the dir name is used to define the provider
// providers must define a route, model, controller via common js style module : 
  // provider-name
    // /routes/index.js 
    // /models/ModelName.js 
    // /controller/index.js 


var fs = require('fs'),
  path = './api/providers/';

//enable cors 
sails.express.app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// loads a model into koop 
// makes sure its globally accessible like other models
function loadModels( options ){
  var files = require('include-all')({
    dirname   : options.path,
    filter    : /(.+)\..+$/
  });

  _.each(files, function(module, filename) {
    var keyName = filename;
    module.identity = options.replaceExpr ? filename.replace(options.replaceExpr, "") : filename;
    module.globalId = module.identity;
    module.identity = module.identity.toLowerCase();
    keyName = module.identity;
    // save the model;
    sails.models[keyName] = module;
    // expose model as a global
    
    global[module.globalId] = module;
  });
}


// read each dir and load the files into the app 
fs.readdir( path, function(err, files){
  _.each(files, function( f ){
    var filepath = path + f;
    if ( fs.lstatSync( filepath ).isDirectory() && f != 'base') {

      var providerPath = __dirname + '/' + f;

      // load the model into koop as sails model and global
      loadModels({ path: providerPath + '/models' });

      // load the controller 
      var controller = require( providerPath + '/controller');
      sails.middleware.controllers[ controller.serviceName || f ] = controller;

      // bind the custom routes
      var routes = require( providerPath + '/routes');
      _.each(routes, function( handler, route ){
        var route = route.split(' ');
        // bind the route to the said controller
        sails.router.bind(route[1], sails.middleware.controllers[ handler.controller ][ handler.action ], route[0] ); 
      });
    }
  });
});
