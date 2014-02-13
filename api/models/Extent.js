// helper for calculating the extent of an array of features 

exports.bounds = function(features){
  var minx,
    miny,
    maxx,
    maxy;

  var first = false;
  features.forEach(function( f, i ){
    if (f.geometry && f.geometry.type == 'Point' ){
      if ( i == 0){
        minx = f.geometry.coordinates[0],
        miny = f.geometry.coordinates[1],
        maxx = f.geometry.coordinates[0],
        maxy = f.geometry.coordinates[1];
      }
      if (f.geometry.coordinates[0] < minx) minx = f.geometry.coordinates[0];
      if (f.geometry.coordinates[1] < miny) miny = f.geometry.coordinates[1];
      if (f.geometry.coordinates[0] > maxx) maxx = f.geometry.coordinates[0];
      if (f.geometry.coordinates[1] > maxy) maxy = f.geometry.coordinates[1];
    } else if ( f.geometry && ( f.geometry.type == 'Polygon' || f.geometry.type == 'MultiPolygon') && f.geometry.coordinates ) {
      var coords = (f.geometry.type == 'MultiPolygon') ? f.geometry.coordinates[0][0] : f.geometry.coordinates[0];
      coords.forEach(function( c, j ) {
        if ( i == 0){
          minx = c[0],
          miny = c[1],
          maxx = c[0],
          maxy = c[1];
        }
        if (c[0] < minx) minx = c[0];
        if (c[1] < miny) miny = c[1];
        if (c[0] > maxx) maxx = c[0];
        if (c[1] > maxy) maxy = c[1];
      });
    }
  });

  return {
      "xmin": minx,
      "ymin": miny,
      "xmax": maxx,
      "ymax": maxy,
      "spatialReference": {
        "wkid": 4326,
        "latestWkid": 4326
      }
  };
};
