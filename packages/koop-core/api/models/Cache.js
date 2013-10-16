
// a rather retarded 
module.exports = {

  checkTime: (60*60*1000), // 60 mins

  insert: function( type, key, data, callback ){
    Cache.db.insert( type+':'+key, data, function(err, success){
      callback( err, success );
    });
  },

  process: function( type, key, data, callback ){
    var self = this;
    if ( !data.length ){
      callback( 'Not found', null);
    } else {
      // checks the timer 
      Cache.redis.get( type+':'+key+':timer', function( error, timer){
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
                Cache.redis.set( type+':'+key+':timer', key, function( error, timer){
                  Cache.redis.expire( type+':'+key+':timer', 360000);
                  callback( null, data );
                });
              } else {
                // we need to remove and save new data 
                console.log('Setting a timer', key);
                self.remove(type, key, function(){
                  self.insert(type, key, success, function(err, res){
                    Cache.redis.set( type+':'+key+':timer', key, function( error, timer){
                      Cache.redis.expire( type+':'+key+':timer', 360000);
                      callback( err, success );
                    });
                  });
                });
              } 
            });
          } else {
            console.log('Provider has no checkCache method, sending cached data');
            callback( null, data ); 
          }
        }
      });
    }
  },

  remove: function(type, key, callback){
    Cache.db.remove( type+':'+key, function(err, result){
      callback(null, true);
    });
  },

  get: function(type, key, options, callback ){
    var self = this;
    Cache.db.select( type+':'+key, options, function(err, result){
      self.process( type, key, result, callback );     
    });
  },

  resetTimer: function( type, key ){
    var self = this;
    var id = type+':'+key+':timer';
    Cache.redis.set( id, key, function( error, timer){
      Cache.redis.expires( id, 3600);
    });
  }

};
