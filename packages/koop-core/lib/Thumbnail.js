var fs = require('fs'),
  mapnik = require('mapnik'),
  mercator = new(require('sphericalmercator'))(),
  sm = require('sphericalmercator'),
  nfs = require('node-fs'),
  sm = require('sphericalmercator');

var Thumbnail = function( koop ){

  // Primary entry point for thumbnail generation 
  // should be relatively stupid about where to write file, but should check for cached images 
  // @param json GeoJSON for rendering to image 
  // @param extent bounding box for image  
  this.generate = function( json, key, options, callback ) {
    var self = this;
    var dir = koop.files.localDir + 'thumbs/' + key;
    // make sure dir exists 
    nfs.mkdir( dir, '0777', true, function(err){
      var jsonFile = koop.files.localDir + options.f_base + '.json';
      if (!fs.existsSync( jsonFile )){
        fs.writeFile( jsonFile, JSON.stringify( json ), function(err){
          self.render(json, jsonFile, options, callback);
        });
      } else {
        self.render(json, jsonFile, options, callback);
      }
    });

  };

  // actually renders and returns the saved file 
  this.render = function( json, jsonFile, options, callback ){

    var png = jsonFile.replace('json', 'png');

    var map = new mapnik.Map( options.width, options.height );
    map.loadSync(__dirname + '/../templates/renderers/style.xml');

    var layer = new mapnik.Layer('layer1');
    layer.srs = '+init=epsg:4326';
    layer.datasource = new mapnik.Datasource( { type: 'geojson', file: jsonFile } );

    // add styles 
    layer.styles = [json.features[0].geometry.type.toLowerCase()];

    map.add_layer(layer);

    var image = new mapnik.Image( options.width, options.height );

    // project extent
    //if (!options.extent){
    //  options.extent = Extent.bounds( json.features );
    //}
    //var buff = 0;
    //var merc = new sm( { size:options.width } ),
    //  mins = merc.forward( [options.extent.xmin-buff, options.extent.ymin-buff] ),
    //  maxs = merc.forward( [options.extent.xmax+buff, options.extent.ymax+buff] );
    //map.extent = [ mins[0], mins[1], maxs[0], maxs[1] ];

    // instead of setting extent we can have mapnik zoom to all features
    map.zoomAll();

    map.render( image, {}, function( err, im ) {
      if (err) {
        callback( err, null );
      } else {
        im.encode( 'png', function( err, buffer ) {
          fs.write( png, buffer, function( err ) {
            callback( null, png );
          });
        });
      }
    });
    
  };

  return this;
};

module.exports = Thumbnail;
