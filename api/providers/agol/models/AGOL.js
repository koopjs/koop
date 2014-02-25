var request = require('request'),
  async = require('async');

var AGOL = function(){

  // adds a service to the Cache.db
  // needs a host, generates an id 
  this.register = function( id, host, callback ){
    var type = 'agol:services';
    //var id = (new Date()).getTime();
    Cache.db.services.count( type, function(error, count){
      id = id || count++;
      Cache.db.services.register( type, {'id': id, 'host': host},  function( err, success ){
        callback( err, id );
      });
    });
  };

  this.remove = function( id, callback ){
    Cache.db.services.remove( 'agol:services', parseInt(id) || id,  callback);
  }; 

  // get service by id, no id == return all
  this.find = function( id, callback ){
    Cache.db.services.get( 'agol:services', parseInt(id) || id, callback);
  };

  this.agol_path = '/sharing/rest/content/items/';

  // got the service and get the item
  this.getItem = function( host, itemId, options, callback ){
    var url = host + this.agol_path + itemId+'?f=json';
    request.get(url, function(err, data ){
      if (err) {
        callback(err, null);
      } else {
        var json = JSON.parse( data.body );
        if (json.error){
          callback( json.error.message, null );  
        } else{
          callback( null, json );
        }
      }
    });
  };

  // got the service and get the item
  this.getItemData = function( host, itemId, options, callback ){
    var self = this;
    this.getItem(host, itemId, options, function( err, itemJson ){
      if ( err ){
        callback(err, null);
      } else {
        if (itemJson.type == 'Feature Collection'){
          self[ itemJson.type.replace(' ', '') ]( host + self.agol_path, itemId, itemJson, options, callback );
        } else if ( itemJson.type == 'Feature Service' || itemJson.type == 'Map Service' ) {
          self[ 'Service' ]( host + self.agol_path, itemId, itemJson, options, callback );
        } else {
          callback('Requested Item must be a Feature Collection', null);
        }
      }
    });
  };

  this.FeatureCollection = function(base_url, id, itemJson, options, callback){
    Cache.get( 'agol', id, options, function(err, entry ){
      if ( err ){
        var url = base_url + '/' + id + '/data?f=json'; 
        request.get(url, function(err, data ){
          if (err) {
            callback(err, null);
          } else {
            var json = JSON.parse( data.body ).featureCollection.layers[0].featureSet;
            GeoJSON.fromEsri( json, function(err, geojson){
              Cache.insert( 'agol', id, geojson, (options.layer || 0), function( err, success){
                if ( success ) {
                  itemJson.data = [geojson];
                  callback( null, itemJson );
                } else {
                  callback( err, null );
                }
              });
            });
          }
        });
      } else {
        itemJson.data = entry;
        callback( null, itemJson );
      }
    });
  };

  this.Service = function(base_url, id, itemJson, options, callback){
    var self = this;
    if ( !itemJson.url ){
      callback('Missing url parameter for Feature Service Item', null);
    } else {
      Cache.get( 'agol', id, options, function(err, entry ){
        if ( err ){
          sails.config.log.info('AGOL request not found in cache, retrieving...');
          // get the ids only
          var idUrl = itemJson.url + '/' + (options.layer || 0) + '/query?where=1=1&returnIdsOnly=true&returnCountOnly=true&f=json';

          if (options.geometry){
            idUrl += '&spatialRel=esriSpatialRelIntersects&geometry=' + JSON.stringify(options.geometry);
          }

          //console.log(options, idUrl);
          request.get(idUrl, function(err, serviceIds ){
            // determine if its greater then 1000 
            try {
              var idJson = JSON.parse(serviceIds.body);
              if (idJson.error){
                callback( idJson.error.message + ': ' + idUrl, null );
              } else {
                sails.config.log.info('COUNT', idJson.count, id);
                if (idJson.count == 0){
                  itemJson.data = [{type: 'FeatureCollection', features: []}];
                  callback( null, itemJson );
                } else if (idJson.count < 1000){
                  var url = itemJson.url + '/' + (options.layer || 0) + '/query?outSR=4326&where=1=1&f=json'; 
                  if (options.geometry){
                    url += '&spatialRel=esriSpatialRelIntersects&geometry=' + JSON.stringify(options.geometry);
                  }
                  request.get(url, function(err, data ){
                    if (err) {
                      callback(err, null);
                    } else {
                      try {
                        var json = {features: JSON.parse( data.body ).features};
                        GeoJSON.fromEsri( json, function(err, geojson){
                          geojson.updated_at = itemJson.modified; 
                          Cache.insert( 'agol', id, geojson, (options.layer || 0), function( err, success){
                            if ( success ) {
                              itemJson.data = [geojson];
                              callback( null, itemJson );
                            } else {
                              callback( err, null );
                            }
                          });
                        });
                      } catch (e){
                        callback( 'Unable to parse Feature Service response', null );
                      }
                    }
                  });
                } else {
                  // TODO TEMP COUNT REMOVE ME
                  idJson.count = 3000;
                  // ---------
                  var i, where, pageMax, url, pages, max;
                  max = 1000;
                  pages = Math.ceil(idJson.count / max);
                  pageRequests = [];
                  for (i=1; i < pages+1; i++){
                    pageMax = i*max;
                    where = 'objectId<'+pageMax+' AND '+ 'objectId>='+((pageMax-max)+1);
                    url = itemJson.url + '/' + (options.layer || 0) + '/query?outSR=4326&where='+where+'&f=json';
                    if ( options.geometry ){
                      url += '&spatialRel=esriSpatialRelIntersects&geometry=' + JSON.stringify(options.geometry);
                    }
                    pageRequests.push({req: url});
                  }
                  self.requestQueue(idJson.count, pageRequests, id, itemJson, (options.layer || 0), callback);
                }
              }
            } catch (e) {
              callback( 'Unknown layer, make the layer you requested exists', null );
            }
          });
        } else {
          itemJson.data = entry;
          callback( null, itemJson );
        }
      });
    }
  };

  // make requests for feature pages 
  // execute done when we have all features 
  this.requestQueue = function(max, reqs, id, itemJson, layerId, done){
    var finalJson = { features: [] };
    var reqCount = 0;
  
    // aggregate responses into one json and call done we have all of them 
    var _collect = function(json){
      reqCount++;

      if ( reqCount == 1 ){
        finalJson.features = json.features;
        finalJson.fields = json.fields;
        finalJson.displayFieldName = json.displayFieldName;
        finalJson.fieldAliases = json.fieldAliases;
        finalJson.geometryType = json.geometryType;
        finalJson.spatialReference = json.spatialReference;

        GeoJSON.fromEsri( finalJson, function(err, geojson){
          itemJson.data = [geojson];
          geojson.updated_at = itemJson.modified; 
          Cache.insert( 'agol', id, geojson, layerId, function( err, success){
            if ( success ) {
              done(null, itemJson);
            } else {
              done(err, null);
            }
          });
        });
      } else {
        // insert a partial
        GeoJSON.fromEsri( json, function(err, geojson){
          Cache.insertPartial( 'agol', id, geojson, layerId, function( err, success){
            // wipe any files so that next time we get em
            var exec = require('child_process').exec;
            var path = sails.config.data_dir + "files/arcgis:"+id+":"+layerId;
            child = exec("rm "+path+"/*", function (error, stdout, stderr) {
              console.log('cleared out files'); //, path, error, stdout, stderr);
            });
          });
        }); 
      }

    };

    var q = async.queue(function (task, callback) {
      // make request
      request.get(task.req, function(err, data){
        var json = JSON.parse(data.body);
        _collect(json);
        callback();
      });
    }, 2);

    q.push(reqs, function(err){ if (err) console.log(err); });

  };

};
  

module.exports = new AGOL();
  
