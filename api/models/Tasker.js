
exports.finish = function( key, geojson ){

  var _update = function( info ){
    Cache.updateInfo(key, info, function(err, success){
      console.log('updated info for ', key);
    });
  };

  Cache.getInfo(key, function(err, info){
    delete info.status;
    if (info.format){
      Exporter.exportToFormat( info.format, key, geojson, function(err, result){
        delete info.format; 
        _update( info );
      }); 
    } else {
      _update( info );
    }
  });
};
