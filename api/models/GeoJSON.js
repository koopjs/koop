
var terraformer = require('Terraformer');
var terraformerParser = require('terraformer-arcgis-parser');

module.exports = {

  // convert 
  fromEsri: function( json, callback ){
    // use terraformer to convert esri json to geojson
    var geojson = {type: 'FeatureCollection', features: []};
    var feature;
    json.features.forEach(function(f, i){
      try {
        feature = JSON.parse( terraformerParser.parse( f ).toJson() );
        delete feature.bbox;
        delete feature.geometry.bbox;
        geojson.features.push( feature );
      } catch (e){
        console.log('error parsing feature', e, f);
      }
    });
    callback(null, geojson);
  }

};
