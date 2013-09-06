
// a rather retarded 
module.exports = {

  checkTime: (60*60*1000), // 60 mins

  insert: function( type, key, data, callback ){
    var json = {
      data: data,
      timer: new Date().getTime() + this.checkTime
    };

    //console.log('REDIS set', Cache.redis);
    if ( Cache.redis ){
      Cache.redis.hset( type, key, JSON.stringify( json ) );
    } else {
      if ( !this[ type ] ){
        this[ type ] = {};
      }
      this[ type ][ key ] = json;
    }
    callback(null, true);
  },

  process: function( type, key, entry, callback ){
    var self = this;
    var now = new Date();
    if ( !entry ){
      callback( 'Not found', null);
    } else {
      // checks the timer 
      if ( now > entry.timer ){

        var _internalCB = function(err, success){
            if ( !success ){
              // cache returned true, return current data
              self.resetTimer( type, key );
              callback( null, entry.data );
            } else {
              self.insert(type, key, success.data, function(err, res){
                callback( err, success.data );
              });
            }
        };

        // expired, hit the API to check the latest sha
        if ( global[type].checkCache ) {
          global[type].checkCache( key, entry.data, _internalCB);
        } else {
          callback( null, entry.data ); }
      } else {
        // return the data 
        callback( null, entry.data );
      }
    }
  },

  get: function(type, key, callback ){
    var self = this;

      if ( Cache.redis ){
        Cache.redis.hget(type, key, function(err, result){
          self.process( type, key, JSON.parse( result ), callback );     
        });
      } else { 
        if ( this[ type ] ){
          self.process( type, key, this[ type ][ key ], callback );
        } else {
          callback( 'Not found', null);
        }
      }

  },

  remove: function(type, key, callback){
    delete this[ type ][ key ];
    callback(null, true);
  },

  resetTimer: function( type, key ){
    var self = this,
      expires = new Date().getTime() + this.checkTime;

    if ( Cache.redis ){
      Cache.redis.hget(type, key, function(err, result){
        var json = JSON.parse( result );
          json.timer = expires;
        Cache.redis.hset( type, key, JSON.stringify(json) );
      });
    } else {
      this[ type ][ key ].timer = expires;
    }
  }

};
