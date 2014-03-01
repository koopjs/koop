var _ = require('lodash');

var sm = require('sphericalmercator'),
  merc = new sm({size:256});

var Climate = function(){

  // get service by id, no id == return all
  this.find = function( type, options, callback ){
     var select = 'select feature from gfs_' + type;

     if ( options.geometry ){

       if ( typeof(options.geometry) == 'string' ){
         options.geometry = JSON.parse( options.geometry );
       }

       if (options.geometry.xmin && options.geometry.ymin){
         var box = options.geometry;
         if (box.spatialReference.wkid != 4326){
           var mins = merc.inverse( [box.xmin, box.ymin] ),
             maxs = merc.inverse( [box.xmax, box.ymax] );
           box.xmin = mins[0],
           box.ymin = mins[1],
           box.xmax = maxs[0],
           box.ymax = maxs[1];
         }

         select += ' WHERE ST_Intersects(ST_GeomFromGeoJSON(feature->>\'geometry\'), ST_MakeEnvelope('+box.xmin+','+box.ymin+','+box.xmax+','+box.ymax+'))';
       }
     }
      console.log(select)
     Cache.db._query( select, function (err, result) {
       if ( result && result.rows && result.rows.length ) {
         callback( null, [{
           type: 'FeatureCollection',
           features: _.pluck(result.rows, 'feature'),
           name: 'gfs_'+type
         }]);
       } else {
         callback( 'Not Found', [{
           type: 'FeatureCollection',
           features: []
         }]);
       }
     });
  };

}
  

module.exports = new Climate();
  
