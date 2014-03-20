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
          //sails.config.log.info('AGOL request not found in cache, retrieving...');
          // get the ids only
          var idUrl = itemJson.url + '/' + (options.layer || 0) + '/query?where=1=1&returnIdsOnly=true&returnCountOnly=true&f=json';

          if (options.geometry){
            idUrl += '&spatialRel=esriSpatialRelIntersects&geometry=' + JSON.stringify(options.geometry);
          }

          // get the id count of the service 
          request.get(idUrl, function(err, serviceIds ){
            // determine if its greater then 1000 
            try {
              var idJson = JSON.parse(serviceIds.body);
              if (idJson.error){
                callback( idJson.error.message + ': ' + idUrl, null );
              } else {
                console.log('COUNT', idJson.count, id);
                if (idJson.count == 0){

                  // return empty geojson
                  itemJson.data = [{type: 'FeatureCollection', features: []}];
                  callback( null, itemJson );

                } else if (idJson.count < 1000){

                  // we can the data in one shot
                  var url = itemJson.url + '/' + (options.layer || 0) + '/query?outSR=4326&where=1=1&f=json&outFields=*'; 
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
                  // creates the empty table
                  Cache.remove('agol', id, {layer: (options.layer || 0)}, function(){

                    var info = {
                      status: 'processing', 
                      updated_at: itemJson.modified, 
                      name: itemJson.name, 
                      features:[]
                    };

                    if ( options.format ){
                      info.format = options.format;
                    }

                    Cache.insert( 'agol', id, info, ( options.layer || 0 ), function( err, success ){

                      // return, but continue on
                      itemJson.data = [{features:[]}];
                      itemJson.koop_status = 'processing';
                      callback(null, itemJson);
                  
                      // logic for paging through the feature service
                      var i, where, pageMax, url, pages, max;
                      max = 1000;
                      pages = Math.ceil(idJson.count / max);
                      pageRequests = [];

                      for (i=1; i < pages+1; i++){
                        pageMax = i*max;
                        where = 'objectId<'+pageMax+' AND '+ 'objectId>='+((pageMax-max)+1);
                        url = itemJson.url + '/' + (options.layer || 0) + '/query?outSR=4326&where='+where+'&outFields=*&f=json';
                        if ( options.geometry ){
                          url += '&spatialRel=esriSpatialRelIntersects&geometry=' + JSON.stringify(options.geometry);
                        }
                        pageRequests.push({req: url});
                      }

                      self.requestQueue(idJson.count, pageRequests, id, itemJson, (options.layer || 0), function(err,data){
                        Tasker.finish( ['agol',id, options.layer || 0].join(':'), { type: 'FeatureCollection', features: data.data[0].features} );
                      });
                    });
                  });
                }
              }
            } catch (e) {
              callback( 'Unknown layer, make the layer you requested exists', null );
            }
          });
        } else if ( entry[0].status == 'processing' ){
          itemJson.data = [{features:[]}];
          itemJson.koop_status = 'processing';
          callback(null, itemJson);
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
    var reqCount = 0;
    // setup the place to collect all the features
    itemJson.data = [ {features: []} ];
  
    // aggregate responses into one json and call done we have all of them 
    var _collect = function(json, cb){
      if ( json.error ){
        done( json.error.details[0], null);
      } else {

        reqCount++;

        // insert a partial
        GeoJSON.fromEsri( json, function(err, geojson){
          // concat the features so we return the full json
          itemJson.data[0].features = itemJson.data[0].features.concat( geojson.features );
          Cache.insertPartial( 'agol', id, geojson, layerId, function( err, success){
            cb();
            if (reqCount == reqs.length){
              // pass back the full array of features
              done(null, itemJson);
            }
          });
        });

      }
    };

    // concurrent queue for feature pages 
    var q = async.queue(function (task, callback) {
      // make a request for a page 
      request.get(task.req, function(err, data){
        var json = JSON.parse(data.body);
        _collect(json, callback);
      });
    }, 4);

    // add all the page urls to the queue 
    q.push(reqs, function(err){ if (err) console.log(err); });

  };

};
  

module.exports = new AGOL();
  
