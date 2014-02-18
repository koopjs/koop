var request = require('request');

exports.getListings = function(bbox, options, callback){

  var key = [ bbox.minx, bbox.miny, bbox.maxx, bbox.maxy ].join('/'),
    type = 'VRBO';

  Cache.get( type, key, options, function(err, entry ){
    if ( err ){
      console.log('Data not found in cache, requesting', key);
      request.get('http://www.vrbo.com/map-search-data/MapSearchData?minLat=34.225&minLong=-116.997&maxLat=34.265&maxLong=-116.785', function(err, data){
        var json = JSON.parse(data.body);
        if ( !json ){
          callback( 'No listings found', null );
        } else {
          var geojson = {type:'FeatureCollection', features: []};
          var feature;
          json.Listings.forEach(function(listing, i){
            feature = {type: 'feature', geometry:{coordinates: [listing.Longitude, listing.Latitude], type:'Point'}};
            feature.properties = listing; 
            geojson.features.push(feature);
          });
    
          Cache.insert( type, key, [geojson], function( err, success){
            if ( success ) { 
              callback( null, geojson );
            }
          });
        }
      });
    } else {
      console.log('Data found!, using cache', key);
      callback( null, entry );
    }
  });

};
