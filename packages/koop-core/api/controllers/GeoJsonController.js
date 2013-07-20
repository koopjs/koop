/*---------------------
	:: GeoJson 
	-> controller
---------------------*/
var fs = require('fs'); 

var GeoJsonController = {

  index: function( req, res ){
    var files = []; 
    var path = __dirname + '/../geojson/';
    fs.readdirSync( path ).forEach(function( f ){
      files.push( { 
        name: f, 
        geojson: 'http://'+ req.headers.host + '/geojson/' + f.replace('.json',''),
        featureserver: 'http://'+ req.headers.host + '/geojson/' + f.replace('.json','') + '/FeatureServer'
      });
    });
    res.json( files );
  },

  find: function(req, res){
      var path = __dirname + '/../geojson/' + req.params.id;
      var exists = fs.existsSync( path + '.json' );
      if ( exists ) { 
        var geojson = require( path );
        res.json( geojson );
      } else {
        res.send(404);
      }
  }


};
module.exports = GeoJsonController;
