exports.checkTime = (60*60*1000); // 60 mins

exports.insert = function( type, key, data, callback ){
  Cache.db.insert( type+':'+key, data, function(err, success){
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
          console.log('No cache timer, checking service for updates') 
          global[type].checkCache( key, data, function(err, success){
            if ( !success ){
              // false is good -> reset timer and return data
              // cache returned true, return current data
              Cache.db.timer.set( type+':'+key+':timer', 360000, function( error, timer){
                callback( null, data );
              });
            } else {
              // we need to remove and save new data 
              console.log('Setting a timer', key);
              self.remove(type, key, function(){
                self.insert(type, key, success, function(err, res){
                  Cache.db.timer.set( type+':'+key+':timer', 360000, function( error, timer){
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

exports.remove = function(type, key, callback){
  Cache.db.remove( type+':'+key, function(err, result){
    callback(null, true);
  });
};

exports.get = function(type, key, options, callback ){
  var self = this;
  Cache.db.select( type+':'+key, options, function(err, result){
    self.process( type, key, result, callback );     
  });
};
