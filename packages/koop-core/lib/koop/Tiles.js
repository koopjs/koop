var nodetiles = require('nodetiles-core'),
  GeoJsonSource = nodetiles.datasources.GeoJson,
  Projector = nodetiles.projector,
  nfs = require('node-fs'),
  fs = require('fs'),
  terraformer = require('terraformer'),
  terraformerParser = require('terraformer-arcgis-parser');

var sm = require('sphericalmercator');
var merc = new sm({size:256});

module.exports = {

  //dir: sails.config.data_dir, 

  get: function(params, data, callback ){
    var x = parseInt( params.x ),
      y = parseInt( params.y ),
      z = parseInt( params.z ),
      key = params.key,
      format = params.format;

    var style = params.style;

    if (!params.x || !params.y || !params.z || !format || !key){
      callback('Missing parameters', null);
    } else {
      // check the cache 

      this._check( x, y, z, key, format, data, function( err, file ){
        if ( file ){
          if ( format == 'json' ){
            callback( err, require(file) );
          } else {
            callback( err, file );
          }
        } else {
          callback( 'Something went wrong with the tiles', null );
        }
      });
    }

  },

  _check: function( x, y, z, key, format, data, callback ){
    var self = this;
    var p = [sails.config.data_dir + 'tiles', key, format, z, x].join('/');
    var file = p + '/' + y + '.' + format;

    nfs.mkdir( p, '0777', true, function(){
      if ( !nfs.existsSync( file ) ) {
        //console.log( 'NEW TILE', file, data );
        self._stash( file, format, data, z, x, y, function( err, newfile ){
          callback( err, newfile );
        });
      } else {
        console.log( 'TILE Exists! ', file );
        callback( null, file );
      }
    });
  },

  _stash: function( file, format, geojson, z, x, y, callback ){
    var feature;

      if ( format == 'json' ){
        fs.writeFile( file, JSON.stringify( geojson ), function(){
          callback( null, file );
        });
      } else {

          function render(){

            var map = new nodetiles.Map({
                projection: "EPSG:900913" // set the projection of the map
            });

            if ( geojson && geojson.features && geojson.features.length ) {
              map.addData(new GeoJsonSource({
                name: geojson.features[0].geometry.type.toLowerCase(),
                path: file.replace(/png|utf/g, 'json'),
                projection: "EPSG:4326"
              }));
            }

            map.addStyle( sails.config.defaultStyle );

            var b = merc.bbox( x, y, z, false, '900913');

            if ( format == 'png' ){
              map.render({
                // Make sure your bounds are in the same projection as the map
                bounds: { minX: b[0], minY: b[1], maxX: b[2], maxY: b[3] },
                width: 256,   // number of pixels to output
                height: 256,
                callback: function(err, canvas) {
                  var f = fs.createWriteStream(file),
                      stream = canvas.createPNGStream();

                  stream.on('data', function(chunk){
                    f.write(chunk);
                  });

                  stream.on('end', function(){
                    //console.log('Saved ', file, stream.canvas.toDataURL());
                    setTimeout(function(){
                      callback( null, file );
                    },50);
                  });
                }
              });
            } else if ( format == 'utf') {
               map.renderGrid({
                // Make sure your bounds are in the same projection as the map
                bounds: { minX: b[0], minY: b[1], maxX: b[2], maxY: b[3] },
                width: 256,   // number of pixels to output
                height: 256,
                callback: function(err, grid) {
                  fs.writeFile( file, JSON.stringify( grid ), function(){
                    callback(null, grid);
                  });
                }
               });
            }
          };

          var jsonFile = file.replace(/png|utf/g, 'json');

          if ( !nfs.existsSync( jsonFile ) ) {

            var dir = jsonFile.split('/');
            var f = dir.pop();
            
            nfs.mkdir( dir.join('/'), '0777', true, function(){
              fs.writeFile( jsonFile, JSON.stringify( geojson ), function(){
                render();
              });
            });
          } else if ( format == 'utf' && nfs.existsSync( file )){
            fs.readFile(file, function(err, data){
              callback(null, JSON.parse(data));  
            });
          } else {
            render();
          }

      }
  } 

};
