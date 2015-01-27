module.exports = {
  store: {
    services: {}
  },

  // get data out of the store
  select: function(key, options, callback){
    if ( !this.store[ key ] ){
      callback('Not Found', []);
    } else if (this.store[ key ] && this.store[ key ].info && this.store[ key ].info.status == 'processing' && !options.bypassProcessing ) {
      callback( null, [{ status: 'processing' }]);
    } else {
      callback(null, this.store[key]);
    }
  },

  getCount: function( key, options, callback ){
    
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

  insert: function( type, key, geojson, callback ){
    this.store[type+':'+key] = geojson;
    callback(null, geojson); 
  },

  insertPartial: function( key, geojson, layerId, callback ){
    this.store
  },

  _insertFeature: function(table, feature, i){

  },

  serviceRegister: function( type, key, info, callback ){
    this.store.services[type + ':' + key + ':' + info.id] = info;
    callback(null, geojson);
  },

  serviceCount:function(type, callback){
    callback(null, Object.keys(this.store.services).length);
  },

  serviceRemove: function( key, id, callback){
    delete this.store.servicer[ key+':'+id ];
    callback(null, geojson);
  },

  serviceGet: function( type, id, callback){
    callback(null, this.store.services[type+':'+id]);
  },

  remove: function( key, callback){
    delete this.store[key];
    callback(null, true);
  },

  timerGet: function(key, callback){
    callback( null, this.store[key]);  
  },

  timerSet: function(key, expires, callback){
      var self = this;
      this.store.timers[key] = true;
      setInterval(function(){
        delete self.store.timers[key];
      }, expires);
      callback(null, true);
  },

  _query: function(sql, callback){
    callback('not implemented with local caches, use an sql based cache like postGIS instead.', false);  
  }


};
