var async = require('async');

// concurrent queue for feature pages 
exports.taskQueue = async.queue(function (task, callback) {
  // get the geojson for the task key
  Cache.db.select( task.key, task.options, function( err, result ){
    finish(task.key, result[0], callback);
  }); 
}, 2);

function finish( key, geojson, callback ){

  var _update = function( info ){
    Cache.updateInfo(key, info, function(err, success){
      callback();
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
