var spawnasync = require('spawn-async');
var worker = spawnasync.createWorker({'log': sails.config.log});

var nfs = require('node-fs'),
  fs = require('fs');

// A base controller that we can use to inherit from
// contains help methods to process complex query structures for request routing
  // tells koop that this is a provider and should be listed as such
exports.provider = true;

  // shared logic for handling Feature Service requests 
  // most providers will use this mehtod to figure out what request is being made 
exports._processFeatureServer = function(req, res, err, data, callback){
    if ( err ){
      res.json( err, 500 );
    } else if ( data ){
      if ( FeatureServices[ req.params.layer ]){
        // requests for specific layers - pass data and the query string  
        FeatureServices[ req.params.layer ]( data, req.query || {}, function( err, d ){
          // limit response to 1000 
          if (d.feature && d.features.length > 1000){
            d.features = d.features.splice(0,1000);
          }
          if ( callback ){
            res.send( callback + '(' + JSON.stringify( d ) + ')' );
          } else {
            res.json( d );
          }
        });
      } else {
        // have a layer
        if (req.params.layer && data[ req.params.layer ]){
          // pull out the layer data 
          data = data[ req.params.layer ];
        } else if ( data.length ) {
          //data = data[0];
        } else if ( req.params.layer && !data[req.params.layer]){
          res.send('Layer not found', 404);
        }
        if ( req.params.method && FeatureServices[ req.params.method ] ){
          // we have a method call like "/layers"
          FeatureServices[ req.params.method ]( data, req.query || {}, function( err, d ){
            // limit response to 1000 
            if (d.features && d.features.length > 1000){
              d.features = d.features.splice(0,1000);
            }
            if ( callback ){
              res.send( callback + '(' + JSON.stringify( d ) + ')' );
            } else {
              res.json( d );
            }
          });
        } else {
          // make a straight up feature service info request
          // we still pass the layer here to conform to info method, though its undefined  
          FeatureServices.info( data, req.params.layer, req.query || {}, function( err, d ){
            if ( callback ){
              res.send( callback + '(' + JSON.stringify( d ) + ')' );
            } else {
              res.json( d );
            }
          });
        }
      }

    } else {
      res.send('There a problem accessing this repo', 500);
    }
};


// Exports data as any supported format 
// take in a format, file key, geojson, and callback
//   
exports.exportToFormat = function( format, key, geojson, callback ){
    var _callOgr = function(inFile, outFile, callback){
      if (format == 'json'){
        callback(null, outFile);
      } else if (ogrFormats[format]) {
        var cmd = ['ogr2ogr', '-f', ogrFormats[format], ( format == 'zip' ) ? outFile.replace('zip','shp') : outFile, inFile].join(' ');
        sails.config.log.info(cmd);
        worker.aspawn(['ogr2ogr', '-f', ogrFormats[format], ( format == 'zip' ) ? outFile.replace('zip','shp') : outFile, inFile],
          function (err, stdout, stderr) {
            if (err) {
              callback(err.message, null);
            } else {
              if ( format == 'zip' ){
                var shp = outFile.replace('zip','shp');
                var dbf = outFile.replace('zip','dbf');
                var shx = outFile.replace('zip','shx');
                var prj = outFile.replace('zip','prj');
                worker.aspawn(['zip', '-j', outFile, shp, dbf, shx, prj], function(err, stdout, stderr){
                  callback(null, outFile);
                });
              } else {
                callback(null, outFile);
              }
            }
        });
      } else {
        callback('Unknown format', null);
      }
    };

    var ogrFormats = {
      kml: 'KML',
      zip: 'ESRI Shapefile',
      csv: 'CSV'
    };

    var path = [sails.config.data_dir + 'files', key].join('/');
    var base = path + '/' + key,
      jsonFile = base + '.json';
      newFile = base + '.' + format;

    nfs.mkdir( path, '0777', true, function(){
      if ( !nfs.existsSync( jsonFile ) ) {
        fs.writeFile( jsonFile, JSON.stringify( geojson ), function(){
          _callOgr( jsonFile, newFile, function(err, outFile){
            if (err){
              callback( err, null );
            } else {
              callback( null, outFile );
            }
          });
        });
      } else {
        _callOgr( jsonFile, newFile, function(err, success){
          if (err){
            callback( err, null );
          } else {
            callback( null, newFile );
          }
        });
      }
    });
    // check for geojson file on disk  
       // else create a geojson file on disk 
    // build the conversion string for org2ogr
    // execute command 
    // respond to request  

  /*  worker.aspawn(['ogr2ogr', '--formats'],
      function (err, stdout, stderr) {
          if (err) {
              callback(err.message, null);
          } else {
              callback(null, stdout);
          }
      });*/
};
