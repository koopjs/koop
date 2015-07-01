// Uses the module pattern for clean inheritance in models
// exposes shared functionality across providers, typically things that require central code in koop-server
var fs = require('fs');

var BaseModel = function( koop ){

  // log to central Koop log, configured at startup
  function log(level, message){
    koop.log[level](message);
  }

  // lookup files in the central Koop files object configured at startup
  var files = koop.files;

  // returns configured data dir for the cache
  function cacheDir(){
    return koop.Cache.data_dir;
  }
  
  // converts GeoJSON in TopoJSON
  function topojsonConvert( data, callback ){
    koop.Topojson.convert( data, callback);
  }

  // a wrapper method that reduces the number of params 
  // passed to exportFunctions
  // Helps keep backward compatability with the existing API 
  function exportFile (params, options, callback){
    if (options && options.large) {
      exportLarge(params.format, params.id, params.key, params.type, options, callback);
    } else {
      exportToFormat(params.format, params.dir, params.key, params.data, options, callback);
    }
  }
  
  // exports data to the given format
  function exportToFormat (format, dir, key, data, options, callback){
    options.rootDir = koop.files.localDir;
    koop.Exporter.exportToFormat( format, dir, key, data, options, function(err, result){
      if (err){
        return callback(err, null);
      }
      finishExport(format, key, options, result, callback);
    });
  }

  function exportLarge( format, id, key, type, options, callback ){
    options.rootDir = koop.files.localDir;
    koop.Exporter.exportLarge( koop, format, id, key, type, options, finishExport, callback);
  }

  // calls Thumbnail generate to create a thumbnail 
  function generateThumbnail( data, key, options, callback ){
    options.dir = options.dir || koop.files.localDir;
    if ( koop.thumbnail ){
      koop.thumbnail.generate( data, key, options, callback );
    } 
    else {
      callback({code:500, message: 'Thumbnail generation is not included in this instance of koop'}, null);
    }
  }

  // gets/creates a tile from the url params and data
  function tileGet( params, data, callback ){
    params.dir = params.dir || koop.files.localDir;
    if ( koop.tiles ){
      delete data.info;
      koop.tiles.getTile( params, data, callback );
    } 
    else {
      callback({code:500, message: 'Tile generation is not included in this instance of koop'}, null);
    }
  }

  function getImageServiceTile( params, callback){
    koop.tiles.getImageServiceTile( params, callback );
  }

  function getServiceTile( params, info, callback){
    koop.tiles.getServiceTile( params, info, callback );
  }


  function finishExport(format, key, options, result, callback){
    var sendFile = function(err, result){
      if (koop.files.s3) {
        try {
          // try to clean up local FS
          fs.unlinkSync(result.paths.rootNewFile);
          fs.unlinkSync(result.paths.rootJsonFile);
        } catch(e){
          koop.log.debug('Trying to remove non-existant file: %s', e);
        }
        koop.files.exists( result.paths.path+'/'+key, result.paths.newFile, function(exists, path){
          if (!exists){
            callback( 'File did not get created.', null );
          } else {
            callback(null, path);
          }
        });
      } else {
        if (err){
          callback( err, null );
        } else {
          callback(null, result.file);
        }
      }
    };
  
    if ( koop.files.s3 ){
      var stream = fs.createReadStream( result.file );
      koop.files.write( result.paths.path+'/'+key, result.paths.newFile, stream, function( err ){
        if (!options.isFiltered){
          koop.files.write( result.paths.latestPath, result.paths.newFile, fs.createReadStream( result.file ), function( err ){
            try {
              // try to clean up local FS
              fs.unlinkSync(result.paths.rootNewFile);
            } catch(e){
              koop.log.debug('Trying to remove non-existant file: %s', e);
            }
          });
        } 
        sendFile(null, result);
      });
    } else {
      sendFile(null, result);
    }
  }

  function getGeoHash (key, options, callback) {
    if (!koop.Cache.db.geoHashAgg){
      callback('The installed cache doesnt support geohash aggregation', null);
    } else {
      var limit = options.limit || 100000,
        precision = options.precision || 8;
      koop.Cache.db.geoHashAgg(key, limit, precision, options, callback);
    }
  }

  function saveFile (path, file, data, callback) {
    koop.files.write( path, file, data, function( err ){
      if (err){
        return callback(err);
      }
      return callback();
    });
  };

  function getCount (key, options, callback) {
    koop.Cache.getCount(key, options, callback)
  }

  function getExtent (key, options, callback) {
    koop.Cache.getExtent(key, options, callback)
  }


  return {
    log: log,
    files: files,
    cacheDir: cacheDir,
    topojsonConvert: topojsonConvert,
    exportToFormat: exportToFormat,
    exportLarge: exportLarge,
    exportFile: exportFile,
    finishExport: finishExport,
    tileGet: tileGet,
    generateThumbnail: generateThumbnail,
    getImageServiceTile: getImageServiceTile,
    getServiceTile: getServiceTile,
    getGeoHash: getGeoHash,
    saveFile: saveFile,
    getCount: getCount,
    getExtent: getExtent
  };

};

module.exports = BaseModel;
