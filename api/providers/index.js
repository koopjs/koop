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
  //console.log(sails);

  fs.readdir( path, function(err, files){
    _.each(files, function( f ){
      var filepath = path + f;
      if ( fs.lstatSync( filepath ).isDirectory() ) {

        var providerPath = __dirname + '/' + f;

        var routes = require( providerPath + '/routes'),
          model = require( providerPath + '/models');

        // TODO do something with provider models - it might makes sense to move some controller logic into a gist model 

        sails.middleware.controllers[ f ] = require( providerPath + '/controller');

        _.each(routes, function( handler, route ){
          var route = route.split(' ');
          // bind the route to the said controller
          sails.router.bind(route[1], sails.middleware.controllers[ handler.controller ][ handler.action ], route[0] ); 
          //sails.express.app[ route[0] ]( 
          //  route[1], 
          //  sails.middleware.controllers[ handler.controller ][ handler.action ] 
          //);
        });
      }
    });
  });
  
})();
