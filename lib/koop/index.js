var fs = require('fs'),
  _ = require('lodash');

var path = __dirname;

// read each dir and load the files into the app 
fs.readdir( path, function(err, files){
  _.each(files, function( f ){
    if ( f != 'index.js'){
      var filepath = path +'/'+ f;
      var module = require(filepath);
      global[ f.replace(/\.js/g, "") ] = module;
    } 
  });
});
