// Exports data as any supported format 
// take in a format, file key, geojson, and callback
var fs = require('node-fs');
 
exports.exportToFormat = function( format, dir, key, geojson, callback ){

    // executes OGR
    var _callOgr = function(inFile, outFile, callback){
      if (format == 'json'){
        callback(null, outFile);
      } else if (ogrFormats[format]) {
        //console.log(['ogr2ogr', '-f', ogrFormats[format], ( format == 'zip' ) ? outFile.replace('zip','shp') : outFile, inFile].join(' '));
        sails.worker.aspawn(['ogr2ogr', '-f', ogrFormats[format], ( format == 'zip' ) ? outFile.replace('zip','shp') : outFile, inFile],
          function (err, stdout, stderr) {
            if (err) {
              console.log(err, stdout, stderr);
              callback(err.message, null);
            } else {
              if ( format == 'zip' ){
                var shp = outFile.replace('zip','shp');
                var dbf = outFile.replace('zip','dbf');
                var shx = outFile.replace('zip','shx');
                var prj = outFile.replace('zip','prj');
                sails.worker.aspawn(['zip', '-j', outFile, shp, dbf, shx, prj], function(err, stdout, stderr){
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

    // handles the response to callback
    var _send = function(err, file){
      if (err){
        callback( err, null );
      } else {
        // push the downloaded file up to s3
        if (sails.peechee && sails.peechee.type == 's3'){ 
          fs.readFile(file, function (err, data) {
            if ( format == 'zip' || format == 'gpkg' ){
              data = new Buffer(data, 'binary').toString('base64');
            }
            sails.peechee.write(data, key, key+'.'+format, function(err,res){
              callback( null, file );
            })
          });
        } else {
          callback(null, file);
        }
      }
    };

    var ogrFormats = {
      kml: 'KML',
      zip: 'ESRI Shapefile',
      csv: 'CSV',
      gpkg: 'GPKG'
    };

    // create the files for out output
    // we always create a json file, then use it to convert to a file
    var path = [sails.config.data_dir + 'files', dir].join('/');
    var base = path + '/' + key,
      jsonFile = base + '.json';
      newFile = base + '.' + format;


    fs.mkdir( path, '0777', true, function(){
      if ( !fs.existsSync( jsonFile ) ) {
        fs.writeFile( jsonFile, JSON.stringify( geojson ), function(){
          _callOgr( jsonFile, newFile, _send); 
        });
      } else {
        _callOgr( jsonFile, newFile, _send) ;
      }
    });

};
