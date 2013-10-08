
// a rather retarded 
module.exports = {

  checkTime: (60*60*1000), // 60 mins

  insert: function( type, key, data, callback ){
    Cache.db.insert( type+':'+key, data, function(err, success){
      callback(err, success);
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
          callback( null, data );
        } else {

          // expired, hit the API to check the latest sha
          if ( global[type] && global[type].checkCache ) {
            global[type].checkCache( key, data, function(err, success){
              if ( !success ){
                // false is good -> reset timer and return data
                // cache returned true, return current data
                Cache.redis.set( type+':'+key+':timer', key, function( error, timer){
                  Cache.redis.expire( type+':'+key+':timer', 3600);
                  callback( null, data );
                });
              } else {
                // we need to remove and save new data 
                self.remove(type, key, function(){
                  self.insert(type, key, success, function(err, res){
                    Cache.redis.set( type+':'+key+':timer', key, function( error, timer){
                      Cache.redis.expire( type+':'+key+':timer', 3600);
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
  },

  remove: function(type, key, callback){
    Cache.db.remove( type+':'+key, function(err, result){
      callback(null, true);
    });
  },

  get: function(type, key, callback ){
    var self = this;

      //if ( Cache.db ){

        // if redis has a key, then we select and return
        //Cache.redis.get( type+':' + key + ':info', function( error, check){
          //if ( check ) {
            Cache.db.select( type+':'+key, function(err, result){
              self.process( type, key, result, callback );     
            });
          //} else {
          //  Cache.redis.set( type+':'+key + ':info', key, function( error, check){
          //    Cache.redis.expires(type+':'+key + ':info', 60*60);
             
          //  });
          //}  
        //}); 
 
      /*} else { 
        if ( this[ type ] ){
          self.process( type, key, this[ type ][ key ], callback );
        } else {
          callback( 'Not found', null);
        }
      }*/

  },

  resetTimer: function( type, key ){
    var self = this;
    var id = type+':'+key+':timer';
    Cache.redis.set( id, key, function( error, timer){
      Cache.redis.expires( id, 3600);
    });
  }

};
