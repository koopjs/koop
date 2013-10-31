var topojson = require('topojson');

module.exports = { 

  convert: function( geojson, callback ){
    var topology = topojson.topology({collection: geojson});
    callback(null, topology);
  }

}
