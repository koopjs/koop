var fs = require('fs'),
  child = require('child_process'),
  path = require('path');

var Cache = function( koop ){

  this.insert = function( type, key, data, layerId, callback ){
    var self = this;
    this.db.insert( type+':'+key, data, layerId, function(err, success){
      self.db.timerSet( type+':'+key+':timer', 3600000, function( error, timer){
        callback( err, success );
      });
    });
  };
  
  this.insertPartial = function( type, key, data, layerId, callback ){
    this.db.insertPartial( type+':'+key, data, layerId, function(err, success){
      callback( err, success );
    });
  };
  
  
  // handles the response from the select
  // if a cache timer has expired we ask if the data in the 3rd party API has changed 
  // if it has changed then each Model's checkthis function will return the NEW data 
  // if it hasnt changed then checkthis will return false and the old data will be sent back   
  this.process = function( type, key, data, options, callback ){
    var self = this;
    // timing at which we'll check the validity of the cache 
    var checkTime = (60*60*1000); // 60 mins 
  
    if ( !data.length ){
      callback( 'Not found', null);
    } else {
      // checks the timer 
      var timerKey = [type, key, (options.layer || 0), 'timer'].join(':');
      this.db.timerGet( timerKey, function( error, timer){
        if ( timer ){
          // got a timer, therefore we are good and just return
          callback( null, data );
        } else {
          // expired, hit the API to check the latest sha
          if ( global[type] && global[type].checkthis ) {
            global[type].checkthis( key, data, options, function(err, success){
              if ( !success ){
                // false is good -> reset timer and return data
                // cache returned true, return current data
                self.db.timerSet( timerKey, checkTime, function( error, timer){
                  callback( null, data );
                });
              } else {
                // we need to remove and save new data 
                self.remove(type, key, options, function(){
                  self.insert(type, key, data, (options.layer || 0), function(err, res){
                    self.db.timerSet( timerKey, checkTime, function( error, timer){
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
  
  
  this.remove = function(type, key, options, callback){
    var self = this;
    this.db.remove( type+':'+key+':'+(options.layer || 0), function(err, result){
      if ( callback ) {
        callback(null, true);
      }
    });
  };
  
  this.rmDir = function(directories, callback){
      if(typeof directories === 'string') {
        directories = [directories];
      }
      var args = directories;
      args.unshift('-rf');
      child.execFile('rm', args, {env:process.env}, function(err, stdout, stderr) {
        callback.apply(this, arguments);
      });
  };
  
  this.get = function(type, key, options, callback ){
    var self = this;
    this.db.select( type+':'+key, options, function(err, result){
      self.process( type, key, result, options, callback );     
    });
  };
  
  this.getInfo = function( key, callback ){
    this.db.getInfo( key, callback );
  };
  
  this.updateInfo = function( key, info, callback ){
    this.db.updateInfo( key, info, callback );
  };
  
  this.getCount = function( key, options, callback ){
    this.db.getCount( key, options, callback );
  };

  return this;

};

module.exports = Cache;
