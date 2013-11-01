var request = require('request'),
  qs = require('qs'),
  fs = require('fs');
  nfs = require('node-fs'),

  terraformer = require('Terraformer'),
  terraformerParser = require('terraformer-arcgis-parser');

  var sm = require('sphericalmercator');

module.exports = {
  proxy: function( url, options, callback ){
    var self = this;
    url += '?' + qs.stringify(options);
    request.get( url, function( err, data ){
      if (err){ 
        callback(err, null);
      } else {
        var result = JSON.parse( data.body );
        if (options.geojson && result.featureCollection.layers[0].featureSet) {
          self.geojson( result.featureCollection.layers[0].featureSet, function( err, geojson ){
            geojson.name = result.featureCollection.layers[0].layerDefinition.name;
            callback( null, geojson );
          });
        } else if ( options.topojson && result.features && result.features.length ) {
          self.topojson( result, function( err, topology ){
            callback( null, topology );
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
    var feature;
    json.features.forEach(function(f, i){
      feature = JSON.parse( terraformerParser.parse( f ).toJson() );
      delete feature.bbox;
      delete feature.geometry.bbox;
      geojson.features.push( feature );
    });
    callback(null, geojson);
  },

  // convert to topojson
  topojson: function( json, callback ){
    // use terraformer to convert esri json to geojson
    this.geojson(json, function(err, collection){
      Topojson.convert( collection, callback );
    });
  }

};
