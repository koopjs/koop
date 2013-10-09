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

  insert: function( key, geojson, callback ){
    console.log('INSERT', key);
    this.store[key] = geojson;
    callback(null, geojson); 
  },

  remove: function( key, callback){
    delete this.store[key];
    callback(null, true);
  }
};
