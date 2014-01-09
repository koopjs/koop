var request = require('request'),
  qs = require('qs'),
  fs = require('fs');
  nfs = require('node-fs'),
  nodetiles = require('nodetiles-core'),
  GeoJsonSource = nodetiles.datasources.GeoJson,
  Projector = nodetiles.projector,

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
        if (options.geojson && result.features && result.features.length ){
          self.geojson( result, function( err, geojson ){
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
  },

  thumbnail: function( url, options, callback ){
    var self = this;
    //http://localhost:1337/github/chelm/geodata/ski_areas/FeatureServer/0
    this.proxy(url.replace('/query', ''), {f:'json'}, function(err, layerInfo ){
      if ( err ){
        callback(err, null);
      } else {

        if ( !layerInfo.extent ) {
          layerInfo.extent = {
              xmin: -180,
              ymin: 85,
              xmax: 180,
              ymax: 85,
              spatialReference: {
                wkid: 4326,
                latestWkid: 4326
              }
          }
        }

        options.extent = layerInfo.extent;
        
        options.geojson = true;

        self.proxy(url, options, function(err, json ){
          if ( err ) {
            callback(err, null);
          } else if ( !json.features ) {
            callback('No features returned by FeatureService request to '+ url, null);
          } else {
            // generate a thumbnail
            //self.generateThumb(json, layerInfo.extent, options, callback);
            Thumbnail.generate(json, url, options, callback);
          }
        });
      }
    });
  }

  
};
