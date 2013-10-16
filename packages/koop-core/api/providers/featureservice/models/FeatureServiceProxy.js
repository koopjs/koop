var request = require('request'),
  qs = require('qs');

var terraformer = require('Terraformer');
var terraformerParser = require('terraformer-arcgis-parser');

module.exports = {
  proxy: function( url, options, callback ){
    var self = this;
    url += '?' + qs.stringify(options);
    request.get( url, function( err, data ){
      if (err){ 
        callback(err, null);
      } else {
        var result = JSON.parse( data.body );
        if (options.geojson && result.features && result.features.length ){
          self.geojson( result, function( err, geojson ){
            callback( null, geojson );
          });
        } else {
          callback( null, result );
        }
      }
    });
  },

  // convert 
  geojson: function( json, callback ){
    // use terraformer to convert esri json to geojson
    var geojson = {type: 'FeatureCollection', features: []};
    json.features.forEach(function(f, i){
      geojson.features.push(terraformerParser.parse( f ).toJson() );
    });
    callback(null, geojson);
  },

  thumbnail: function( url, options, callback ){
    this.proxy(url, options, function(err, json ){
      if ( err ) {
        callback(err, null);
      } else if ( !json.features ) {
        callback('No features returned by FeatureService request to '+ url, null);
      } else {
        // generate a thumbnail
        callback(null, json);
      }
    });
  }
  
};
