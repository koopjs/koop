var fs = require('fs');
  nfs = require('node-fs'),
  nodetiles = require('nodetiles-core'),
  GeoJsonSource = nodetiles.datasources.GeoJson,
  Projector = nodetiles.projector,
  sm = require('sphericalmercator');


var Thumbnail = function(){

  this.generate = function( json, extent, options, callback ) {
    var self = this;

    options.uniq = (new Date()).getTime();
    options.dir = sails.config.data_dir + '/thumbs/';
    options.width = parseInt( options.width ) || 150;
    options.height = parseInt( options.height ) || 150;

    var dir = options.dir + options.uniq;

    // make sure dir exists 
    nfs.mkdir( options.dir, '0777', true, function(){
      fs.writeFile( dir + '.json', JSON.stringify( json ), function(){
        self.render(json, extent, options, callback);
      });
    });
  };

  // actually renders and returns the saved file 
  this.render = function( json, extent, options, callback ){

    //console.log(extent, json.features[0].geometry );

    var map = new nodetiles.Map({
      projection: "EPSG:900913"
    });

    if ( json && json.features && json.features.length ) {
      map.addData(new GeoJsonSource({
        name: json.features[0].geometry.type.toLowerCase(),
        path: options.dir + options.uniq + '.json',
        projection: "EPSG:4326"
      }));
    }

    map.addStyle( sails.config.defaultStyle );
    console.log('STYLE', fs.readFileSync('./api/templates/renderers/style.mss') );
    //map.addStyle( fs.readFileSync('./api/templates/renderers/style.mss','utf8') );

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

module.exports = new Thumbnail();
