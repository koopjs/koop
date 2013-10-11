var tilemath = require('tilemath'),
  nfs = require('node-fs'),
  terraformer = require('Terraformer'),
  terraformerParser = require('terraformer-arcgis-parser');

module.exports = {

  dir: '/usr/local/koop/tiles', 

  get: function(params, data, callback ){
    var x = parseInt( params.x ),
      y = parseInt( params.y ),
      z = parseInt( params.z ),
      key = params.key,
      format = params.format;

    if (!x || !y || !z || !format || !key){
      callback('Missing parameters', null);
    } else {
      // check the cache 
      this._check( x, y, z, key, format, data, function( err, file ){
        if ( file ){
          callback( err, require(file) );
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
      }
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
        var bounds = tilemath.tileBounds( z, x, y );
        console.log( 'NEW TILE', file, bounds, data.features.length );
        self._filter( bounds, data, function( err, subset ){
          self._stash( file, subset, function( err, newfile ){
            callback( err, newfile );
          });
        });
      } else {
        console.log( 'TILE Exists! ', file );
        callback( null, file );
      }
    });
  },

  _stash: function( file, data, callback ){
    nfs.writeFile( file, JSON.stringify( data ), function(){
      callback( null, file );
    });
  } 

};
