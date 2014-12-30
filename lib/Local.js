module.exports = {
  store: {},

  // get data out of the store
  select: function(key, callback){
    if (!this.store[key]){
      callback('Not Found', []);
    } else {
      callback('Not Found', this.store[key]);
    }
  },

  insert: function( type, key, geojson, callback ){
    this.store[type+':'+key] = geojson;
    callback(null, geojson); 
  },

  register: function( type, key, info, callback ){
    this.store[type + ':' + key + ':' + info.id] = info;
    callback(null, geojson);
  },

  deregister: function( type, key, id, callback ){
    delete this.store[type+':'+key];
    callback(null, geojson);
  },

  remove: function( key, callback){
    delete this.store[key];
    callback(null, true);
  },

  timer: {
    get: function(key, callback){
      callback( null, this.store[key]);  
    },
    set: function(key, expires, callback){
      var self = this;
      this.store[key] = true;
      setInterval(function(){
        delete self.store[key];
      }, expires);
      callback(null, true);
    }
  }
};
