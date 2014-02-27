
var terraformer = require('Terraformer');
var terraformerParser = require('terraformer-arcgis-parser');

exports.fromEsri = function( json, callback ){
    // use terraformer to convert esri json to geojson
    var geojson = {type: 'FeatureCollection', features: []};
    var feature, newFeature;
    json.features.forEach(function(f, i){
      try {
        if (f.geometry){
          feature = terraformerParser.parse( f );

          // build a new feature
          // 'feature' has bboxes we dont want and 'delete' is slow
          newFeature = {
            id: feature.id, 
            properties: feature.properties, 
            type: 'Feature', 
            geometry: { 
              coordinates: feature.geometry.coordinates,
              type: feature.geometry.type
            }
          };

          if (!newFeature.id) {
            newFeature.id = i+1;
          }
          geojson.features.push( newFeature );
        }
      } catch (e){
        /*newFeature = {
            id: i,
            properties: f.attributes,
            type: 'Feature',
            geometry: null
        };
        geojson.features.push( newFeature );*/
        sails.config.log.info('error parsing feature', e, f);
      }
    });
    callback(null, geojson);
  };
