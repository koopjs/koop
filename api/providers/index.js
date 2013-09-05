// This file bootstraps the loading of all the providers in this dir
// the dir name is used to define the provider
// providers must define a route, model, controller via common js style module : 
  // provider-name
    // /routes/index.js 
    // /models/index.js 
    // /controller/index.js 

(function(){
  var fs = require('fs'),
    path = './api/providers/';
    console.log(sails.config.github_token);

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
  

  fs.readdir( path, function(err, files){
    _.each(files, function( f ){
      var filepath = path + f;
      if ( fs.lstatSync( filepath ).isDirectory() ) {

        var providerPath = __dirname + '/' + f;

        // load the model into koop as sails model and global
        loadModels({ path: providerPath + '/models' });

        // load the controller 
        sails.middleware.controllers[ f ] = require( providerPath + '/controller');

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
  
})();
