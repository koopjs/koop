var mongo = require('mongoskin');
module.exports = {
  infoCollection: 'koop-info', 

  connect: function( conn ){
    this.client = mongo.db( conn );
    return this; 
  },

  // get data out of the db
  select: function(key, callback){
    var self = this;
    //var layer = 0;
    var error = false,
      totalLayers,
      allLayers = [];

    // closure to check each layer and send back when done
    var collect = function(err, data){
      if (err) error = err;
      allLayers.push(data);
      if (allLayers.length == totalLayers){
        callback(error, allLayers);
      }
    };

    this._collection( this.infoCollection ).findOne({id: key+':info'}, function(err, infoDoc){
      if ( !infoDoc ){
        callback('Not Found', []);
      } else {
        totalLayers = infoDoc.info.length;
        infoDoc.info.forEach(function(layer, i){
          
          self._collection( key+':'+i ).find( ).toArray(function (err, docs) {
            if ( docs.length ) {
              collect( null, {
                type: 'FeatureCollection', 
                features: docs, 
                name: layer.name, 
                sha: layer.sha, 
                updated_at: layer.updated_at 
              });
            } else {
              collect( 'Not Found', [] );
            }
          });
        });
      }
    });
  },

  // create a collection and insert features
  // create a 2d index 
  insert: function( key, geojson, callback ){
    console.log('INSERT', key);
    var self = this; 
    var info = [],
      count = 0;
      error = null;
    var check = function( err, success){
      if (err) error = err;
      count++;
      if (count == geojson.length){
        self._collection( 'koop-info' ).insert( { id: key + ':info', info: info }, function(){
          callback(error, true);
        });
      }
    };
    geojson.forEach(function( layer, i ){
      info[i] = { name: layer.name };
      info[i].updated_at = layer.updated_at;
      info[i].sha = layer.sha;

        self._collection( key+':'+i ).insert( layer.features, function(err, result){
          check(err, true);
        });
    });

    
  },

  remove: function( key, callback){
    var self = this;
    var totalLayers, processedLayers;
    var collect = function(){
      if (processedLayers++ == totalLayers){
        callback( null, true );
      }
    };
  
    this._collection( this.infoCollection ).findOne({id: key+':info'}, function(err, infoDoc){
      if ( !infoDoc || !infoDoc.info ){
        callback( null, true );
      } else {
        totalLayers = infoDoc.info.length;
        infoDoc.info.forEach(function(layer, i){
          self._collection( key+':'+i ).remove(function (err, docs) {
              collect();
          });
        });
      }
    });
  },


  //--------------
    // PRIVATE METHODS
  //-------------

  _collection: function(key){
    return this.client.collection( key );
  }

};
