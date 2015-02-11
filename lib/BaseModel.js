// Uses the module pattern for clean inheritance in models
// exposes shared functionality across providers, typically things that require central code in koop-server
'use strict';

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
  
  // exports data to the given format
  function exportToFormat( format, dir, key, data, options, callback){
    koop.exporter.exportToFormat( format, dir, key, data, options, callback);
  }

  function exportLarge( format, id, key, type, options, callback ){
    koop.exporter.exportLarge(format, id, key, type, options, callback);
  }

  // calls Thumbnail generate to create a thumbnail 
  function generateThumbnail( data, key, options, callback ){
    koop.thumbnail.generate( data, key, options, callback );
  }

  // gets/creates a tile from the url params and data
  function tileGet( params, data, callback ){
    koop.tiles.get( params, data, callback );
  }

  function getImageServiceTile( params, callback){
    koop.tiles.getImageServiceTile( params, callback );
  }

  function getServiceTile( params, info, callback){
    koop.tiles.getServiceTile( params, info, callback );
  }


  return {
    log: log,
    files: files,
    cacheDir: cacheDir,
    topojsonConvert: topojsonConvert,
    exportToFormat: exportToFormat,
    exportLarge: exportLarge,
    tileGet: tileGet,
    generateThumbnail: generateThumbnail,
    getImageServiceTile: getImageServiceTile,
    getServiceTile: getServiceTile
  };

};

module.exports = BaseModel;
