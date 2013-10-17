var request = require('request'),
  qs = require('qs'),
  fs = require('fs');
  nfs = require('node-fs');
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

  // generate the image, set up options, and save json file 
  generateThumb: function( json, extent, options, callback ) {
    var self = this;

    options.uniq = (new Date()).getTime();
    options.dir = sails.config.data_dir + 'thumbs/';
    options.width = options.width || 150;
    options.height = options.height || 150;
  
    var dir = options.dir + options.uniq; 

    // make sure dir exists 
    nfs.mkdir( options.dir, '0777', true, function(){
      fs.writeFile( dir + '.json', JSON.stringify( json ), function(){
        self.render(json, extent, options, callback);
      }); 
    });
  },


  // actually renders and returns the saved file 
  render: function( json, extent, options, callback){
    
    var map = new nodetiles.Map({
      projection: "EPSG:900913" 
    });

    if ( json.features && json.features.length ) {
      map.addData(new GeoJsonSource({
        name: "world",
        path: options.dir + options.uniq + '.json',
        projection: "EPSG:4326"
      }));
    }

    map.addStyle( fs.readFileSync('./api/templates/renderers/style.mss','utf8') );

    // project extent
    
    var merc = new sm( { size:options.width } ),
      mins = merc.forward( [extent.xmin-5, extent.ymin-5] ),
      maxs = merc.forward( [extent.xmax+5, extent.ymax+5] );

    var png = options.dir + options.uniq + '.png';
    
    map.render({
      bounds: { 
        minX: mins[0], 
        minY: mins[1], 
        maxX: maxs[0], 
        maxY: maxs[1] 
      },

      width: options.width, 
      height: options.height,

      callback: function(err, canvas) {
        var f = fs.createWriteStream( png ),
          stream = canvas.createPNGStream();

        stream.on('data', function(chunk){
          f.write(chunk);
        });

        stream.on('end', function(){
          setTimeout(function(){
            callback( null, png );
          },50);
        });
      }
    });
  }
  
};
