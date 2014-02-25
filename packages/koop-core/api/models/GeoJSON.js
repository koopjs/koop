
var terraformer = require('Terraformer');
var terraformerParser = require('terraformer-arcgis-parser');

exports.fromEsri = function( json, callback ){
    // use terraformer to convert esri json to geojson
    var geojson = {type: 'FeatureCollection', features: []};
    var feature;
    json.features.forEach(function(f, i){
      try {
        if (f.geometry){
          feature = terraformerParser.parse( f );
          delete feature.bbox;
          delete feature.geometry.bbox;
          if (!feature.id){
            feature.id = i+1;
          }
          geojson.features.push( feature );
        }
      } catch (e){
        console.log('error parsing feature', e, f);
      }
    });
    callback(null, geojson);
  };
