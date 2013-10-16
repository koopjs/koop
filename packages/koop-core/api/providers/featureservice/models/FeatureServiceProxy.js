var request = require('request'),
  qs = require('qs'),
  fs = require('fs');
  nodetiles = require('nodetiles-core'),
  GeoJsonSource = nodetiles.datasources.GeoJson,
  Projector = nodetiles.projector,

  terraformer = require('Terraformer'),
  terraformerParser = require('terraformer-arcgis-parser');

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
    var feature;
    json.features.forEach(function(f, i){
      feature = JSON.parse( terraformerParser.parse( f ).toJson() );
      delete feature.bbox;
      delete feature.geometry.bbox;
      geojson.features.push( feature );
    });
    callback(null, geojson);
  },

  thumbnail: function( url, options, callback ){
    var self = this;
    //http://localhost:1337/github/chelm/geodata/ski_areas/FeatureServer/0
    this.proxy(url.replace('/query', ''), {}, function(err, layerInfo ){
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
        
        options.geojson = true;

        self.proxy(url, options, function(err, json ){
          if ( err ) {
            callback(err, null);
          } else if ( !json.features ) {
            callback('No features returned by FeatureService request to '+ url, null);
          } else {
            // generate a thumbnail
            self.generateThumb(json, layerInfo.extent, options, callback);
          }
        });
      }
    });
  },

  generateThumb: function( json, extent, options, callback ) {
    console.log('GENERATE THUMB', extent, options);
    fs.writeFile( '/usr/local/koop/tiles/tmp.json', JSON.stringify( json ), function(){
  
      var map = new nodetiles.Map({
          projection: "EPSG:4326" // set the projection of the map
      });

      if ( json.features && json.features.length ) {
        map.addData(new GeoJsonSource({
          name: "world",
          path: '/usr/local/koop/tiles/tmp.json',
          projection: "EPSG:4326"
        }));
      }

      map.addStyle(fs.readFileSync('./style.mss','utf8'));

      map.render({
        // Make sure your bounds are in the same projection as the map
        bounds: { minX: extent.xmin-5, minY: extent.ymin-5, maxX: extent.xmax+5, maxY: extent.ymax+5 },
        width: 100,   // number of pixels to output
        height: 100,
        callback: function(err, canvas) {
          var f = fs.createWriteStream('/usr/local/koop/tiles/tmp.png'),
              stream = canvas.createPNGStream();

          stream.on('data', function(chunk){
            f.write(chunk);
          });

          stream.on('end', function(){
            //console.log('Saved ', stream.canvas.toDataURL());
            setTimeout(function(){
              callback( null, '/usr/local/koop/tiles/tmp.png' );
            },50);
          });
        }
      });
    }); 
  }
  
};
