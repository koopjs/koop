// This file bootstraps the loading of all the providers in this dir


var fs = require('fs'),
  path = './api/helpers';

// loads a model into koop 
// makes sure its globally accessible like other models
/*function loadModels( options ){
  console.log(path);
  var files = require('include-all')({
    dirname   : options.path,
    filter    : /(.+)\..+$/
  });

  _.each(files, function(module, filename) {
    var keyName = filename;
    module.identity = options.replaceExpr ? filename.replace(options.replaceExpr, "") : filename;
    module.globalId = module.identity;
    module.identity = module.identity.toLowerCase();
    //keyName = module.identity;
    // save the model;
    //sails.models[keyName] = module;
    // expose model as a global
    
    global[module.globalId] = module;
  });
}*/


// load the model into koop as global
fs.readdir( path, function(err, files){
  _.each(files, function(file){
    console.log(file);
  });
  //loadModels({ path: path });
});

