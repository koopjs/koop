var log = function(val){
  if (typeof(sails) !== 'undefined'){
    sails.config.log.info(val);
  }
};

//exports.checkTime = (60*60*1000*24); // 24 hours
exports.checkTime = (60*1*1000); // 1 mins

exports.insert = function( type, key, data, layerId, callback ){
  Cache.db.insert( type+':'+key, data, layerId, function(err, success){
    Cache.db.timer.set( type+':'+key+':timer', 3600000, function( error, timer){
      callback( err, success );
    });
  });
};

exports.insertPartial = function( type, key, data, layerId, callback ){
  Cache.db.insertPartial( type+':'+key, data, layerId, function(err, success){
    callback( err, success );
  });
};

exports.process = function( type, key, data, callback ){
  var self = this;
  if ( !data.length ){
    callback( 'Not found', null);
  } else {
    // checks the timer 
    Cache.db.timer.get( type+':'+key+':timer', function( error, timer){
      if ( timer ){
        // got a timer, therefore we are good and just return
        console.log('Cache timer exists, not checking for updates', key);
        callback( null, data );
      } else {
        // expired, hit the API to check the latest sha
        if ( global[type] && global[type].checkCache ) {
          //console.log('No cache timer, checking service for updates') 
          global[type].checkCache( key, data, function(err, success){
            if ( !success ){
              // false is good -> reset timer and return data
              // cache returned true, return current data
              //console.log('Setting a timer', key);
              Cache.db.timer.set( type+':'+key+':timer', 3600000, function( error, timer){
                callback( null, data );
              });
            } else {
              // we need to remove and save new data 
              self.remove(type, key, {}, function(){
                self.insert(type, key, data, 0, function(err, res){
                  Cache.db.timer.set( type+':'+key+':timer', 3600000, function( error, timer){
                    callback( err, success );
                  });
                });
              });
            } 
          });
        } else {
          callback( null, data ); 
        }
      }
    });
  }
};

exports.remove = function(type, key, options, callback){
  Cache.db.remove( type+':'+key+':'+(options.layer || 0), function(err, result){
    if ( callback ) { 
      callback(null, true);
    }
  });
};

exports.get = function(type, key, options, callback ){
  var self = this;
  Cache.db.select( type+':'+key, options, function(err, result){
    self.process( type, key, result, callback );     
  });
};

exports.getInfo = function( key, callback ){
  Cache.db.getInfo( key, callback );
};

exports.updateInfo = function( key, info, callback ){
  Cache.db.updateInfo( key, info, callback );
};

