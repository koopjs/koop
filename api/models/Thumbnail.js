var fs = require('fs');
  nfs = require('node-fs'),
  nodetiles = require('nodetiles-core'),
  GeoJsonSource = nodetiles.datasources.GeoJson,
  Projector = nodetiles.projector,
  sm = require('sphericalmercator');


var Thumbnail = function(){

  // Primary entry point for thumbnail generation 
  // should be relatively stupid about where to write file, but should check for cached images 
  // @param json GeoJSON for rendering to image 
  // @param extent bounding box for image  
  this.generate = function( json, key, options, callback ) {
    var self = this;

    //options.uniq = (new Date()).getTime();
    options.dir = sails.config.data_dir + '/thumbs/';
    options.width = parseInt( options.width ) || 150;
    options.height = parseInt( options.height ) || 150;

    var dir = options.dir + key;

    options.f_base = dir + '/' + options.width + '::' + options.height;

    var png = options.f_base+'.png';

    // if the png exists send it back
    fs.exists( png, function(exists){
      if (exists && options.cache ){
        console.log('Using thumbnail cache', png);
        callback(null, png);
      } else {
        // make sure dir exists 
        nfs.mkdir( dir, '0777', true, function(){
          fs.writeFile( options.f_base + '.json', JSON.stringify( json ), function(){
            self.render(json, options, callback);
          });
        });
      }
    });

  };

  // actually renders and returns the saved file 
  this.render = function( json, options, callback ){

    var extent = {
          xmin: -180,
          ymin: 85,
          xmax: 180,
          ymax: 85,
          spatialReference: {
            wkid: 4326,
            latestWkid: 4326
          }
        };

    //console.log(extent, json.features[0].geometry );
    var map = new nodetiles.Map({
      projection: "EPSG:4326"
    });

    if ( json && json.features && json.features.length ) {
      map.addData(new GeoJsonSource({
        name: json.features[0].geometry.type.toLowerCase(),
        path: options.f_base + '.json',
        projection: "EPSG:4326"
      }));
    }

    map.addStyle( sails.config.defaultStyle );


    // project extent
    var merc = new sm( { size:options.width } ),
      mins = merc.forward( [extent.xmin-5, extent.ymin-5] ),
      maxs = merc.forward( [extent.xmax+5, extent.ymax+5] );
      //mins = [extent.xmin-5, extent.ymin-5]; //merc.forward( [extent.xmin-5, extent.ymin-5] ),
      //maxs = [extent.xmax-5, extent.ymax-5]; //merc.forward( [extent.xmax+5, extent.ymax+5] );
    
    console.log(' dude wheres my car', mins, maxs);

    var png = options.f_base + '.png';
    
    console.log('OPTIONS', options)

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
          console.log('writing...')
          f.write(chunk);
        });

        stream.on('end', function(){
          console.log('done...', png)
          setTimeout(function(){
            callback( null, png );
          },100);
        });
      }
    });

  }

};

module.exports = new Thumbnail();
