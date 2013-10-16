var Tilenik = require('tilenik'),
  nodetiles = require('nodetiles-core'),
  GeoJsonSource = nodetiles.datasources.GeoJson,
  Projector = nodetiles.projector,
  Canvas = require('canvas'),
  nfs = require('node-fs'),
  fs = require('fs'),
  terraformer = require('Terraformer'),
  terraformerParser = require('terraformer-arcgis-parser');

var sm = require('sphericalmercator');
var merc = new sm({size:256});

module.exports = {

  dir: '/usr/local/koop/tiles', 

  get: function(params, data, callback ){
    var x = parseInt( params.x ),
      y = parseInt( params.y ),
      z = parseInt( params.z ),
      key = params.key,
      format = params.format;

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

  // TODO stop filtering here, we need to pass bbox selection down to the DB level 
  _filter: function( bounds, json, callback ){
    var params = {
      geometry: {
        xmin: bounds[1], 
        ymin: bounds[0],
        xmax: bounds[3], 
        ymax: bounds[2], 
        spatialReference: { wkid: 4326 }
      },
      geometryType: 'esriGeometryEnvelope'
    }
    
    json.features = terraformerParser.convert( json );
    Query.geometryFilter( json, params, function( err, filtered ){
      callback( null, filtered );
    }); 
  },

  _check: function( x, y, z, key, format, data, callback ){
    var self = this;
    var p = [this.dir, key, format, z, x].join('/');
    var file = p + '/' + y + '.' + format;

    nfs.mkdir( p, '0777', true, function(){
      if ( !nfs.existsSync( file ) ) {
        //console.log( 'NEW TILE', file, data.features.length );
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

    /*var geojson = {type:'FeatureCollection', features:[]};
    data.features.forEach(function(f){
      feature = terraformerParser.parse( f ).toJSON();
      delete feature.geometry.bbox;
      delete feature.bbox;
      geojson.features.push( feature );
    });*/

      nfs.writeFile( file.replace(/png/g, 'json'), JSON.stringify( geojson ), function(){
        if ( format == 'json' ){
          callback( null, file );
        } else {
          /*var canvas = new Canvas(256,256);

          var out = nfs.createWriteStream( file ), 
            stream = canvas.createPNGStream();

          stream.on('data', function(chunk){
            out.write(chunk);
          });*/


          var css = "#layer { line-width: 2; line-color: #08c; point-color: #088; }";

          /* Create your map context */
          var map = new nodetiles.Map({
              projection: "EPSG:900913" // set the projection of the map
          });
          
          /* Add some data */
          map.addData(new GeoJsonSource({ 
            name: "layer",
            path: file.replace(/png/g, 'json'), 
            projection: "EPSG:4326"
          }));
          
          /* Link your Carto stylesheet */
          map.addStyle(css);

          var b = merc.bbox( x, y, z );
          
          /* Render out the map to a file */
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
                console.log('Saved ', file, stream);
                callback( null, file );
              });
            }
          });

          /*Tilenik.render(canvas, geojson, css, z, x, y, function( png ){
            console.log('rendered', png);
            //nfs.writeFile( file, png, function(){
              //callback( null, file );
              setTimeout(function(){ callback( null, file );}, 50 );
            //});
          });*/
          }
      });
  } 

};
