
// a rather retarded 
module.exports = {

  checkTime: (60*60*1000), // 60 mins

  insert: function( type, key, data, callback ){
    if ( !this[ type ] ){
      this[ type ] = {};
    }

    this[ type ][ key ] = {
      data: data,
      timer: new Date().getTime() + this.checkTime
    };
    callback(null, true);
  },

  get: function(type, key, callback ){
    var self = this;

    if ( this[ type ] ){

      var entry = this[ type ][ key ],
        now = new Date();

      if ( !entry ){
        callback( 'Not found', null);
      } else { 
        // checks the timer 
        if ( now > entry.timer ){

          var _internalCB = function(err, success){
              if ( !success ){
                // cache returned true, return current data
                callback( null, entry.data );
              } else {
                self.insert(type, key, success.data, function(err, res){
                  callback( err, success.data );
                });
              }
              self.resetTimer( type, key ); 
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
    } else {
      callback( 'Not found', null);
    }

  },

  remove: function(type, key, callback){
    delete this[ type ][ key ];
    callback(null, true);
  },

  resetTimer: function( type, key ){
    this[ type ][ key ].timer = new Date().getTime() + this.checkTime;
  }

};
