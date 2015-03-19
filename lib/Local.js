module.exports = {
  store: {
    services: {},
    timers: {}
  },

  // get data out of the store
  select: function(key, options, callback){

    if (options.layer || options.layer === 0) {
      key = key+':'+options.layer;
    }

    if ( !this.store[ key ] ){
      callback('Not Found', []);
    } else if (this.store[ key ] && this.store[ key ].info && this.store[ key ].info.status === 'processing' && !options.bypassProcessing ) {
      callback( null, [{ status: 'processing' }]);
    } else {
      callback(null, [this.store[key]]);
    }
  },

  getCount: function( key, options, callback ){
    callback(null, this.store[key].features.length); 
  },

  getInfo: function( key, callback ){
    callback(null, this.store[key].info);
  },

  updateInfo: function( key, info, callback ){
    if (this.store[key]){
      this.store[key].info = info;
      callback(null, true);
    } else {
      callback('info not found', false);
    }
  },

  insert: function( key, geojson, layerId, callback ){
    this.store[key+':'+layerId] = geojson;
    callback(null, true); 
  },

  insertPartial: function( key, geojson, layerId, callback ){
    var self = this;
    geojson.features.forEach(function(feature){
      self.store[key+':'+layerId].features.push(feature);
    });
    callback(null, true);
  },

  serviceRegister: function( type, key, info, callback ){
    this.store.services[type + ':' + key + ':' + info.id] = info;
    callback(null, true);
  },

  serviceCount:function(type, callback){
    callback(null, Object.keys(this.store.services).length);
  },

  serviceRemove: function( key, id, callback){
    this.store.services[ key+':'+id ] = null;
    callback(null, true);
  },

  serviceGet: function( type, id, callback){
    callback(null, this.store.services[type+':'+id] || {});
  },

  remove: function( key, callback){
    this.store[key] = null;
    callback(null, true);
  },

  timerGet: function(key, callback){
    callback( null, this.store[key]);  
  },

  timerSet: function(key, expires, callback){
      var self = this;
      this.store.timers[key] = true;
      setInterval(function(){
        self.store.timers[key] = null;
      }, expires);
      callback(null, true);
  },

  _query: function(sql, callback){
    callback('not implemented with local caches, use an sql based cache like postGIS instead.', false);  
  }

};
