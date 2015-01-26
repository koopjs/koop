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

  getCount: function( key, options, callback ){
    
  },

  getInfo: function( key, callback ){

  },

  updateInfo: function( key, info, callback ){

  },

  insert: function( type, key, geojson, callback ){
    this.store[type+':'+key] = geojson;
    callback(null, geojson); 
  },

  insertPartial: function( key, geojson, layerId, callback ){

  },

  _insertFeature: function(table, feature, i){

  },

  dropTable: function(){

  },

  serviceRegister: function( type, key, info, callback ){
    this.store[type + ':' + key + ':' + info.id] = info;
    callback(null, geojson);
  },

  serviceCount:function(){

  },

  serviceRemove: function( type, id, callback){
    delete this.store[type+':'+id];
    callback(null, geojson);
  },

  serviceGet: function( type, id, callback){
    delete this.store[type+':'+id];
    callback(null, geojson);
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
      this.store[key] = true;
      setInterval(function(){
        delete self.store[key];
      }, expires);
      callback(null, true);
  }

  _query: function(sql, callback){
    
  }


};
