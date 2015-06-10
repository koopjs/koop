// Exports data as any supported format 
// take in a format, file key, geojson, and callback
var fs = require('fs'),
  mkdirp = require('mkdirp'),
  async = require('async'),
  crypto = require('crypto'),
  projCodes = require('esri-proj-codes'),
  mv = require('mv');

var exec = require('child_process').exec;

var ogrFormats = {
  kml: 'KML',
  zip: '\"ESRI Shapefile\"',
  csv: 'CSV',
  json: 'GeoJSON',
  geojson: 'GeoJSON',
  gpkg: 'GPKG'
};


// exports large data via multi part file strategy
exports.exportLarge = function( koop, format, id, key, type, options, finish, done ){

  // exports large data via multi part file strategy
  if (!format){
    return done('No format provided', null);
  } else if (!ogrFormats[format]){
    return done('Unknown format', null);
  }

  // limit for file chunks
  options.limit = 5000;

  var pages,
    fileCount = 0; 
  
  var dir = id +'_'+ (options.layer || 0),
    dbkey = type +':'+ id,
    table = dbkey +':'+ (options.layer || 0);


  var _update = function( info, cb ){
    koop.Cache.updateInfo(table, info, function(err, success){
      cb();
    });
  };

  // call ogr in a separate process
  var _callOgr = function(inFile, outFile, callback){
      var params = {
        inFile: inFile,
        outFile: outFile,
        paths: paths,
        format: format
      };
      callOgr(params, null, options, callback);
  };

  var vrt = '<OGRVRTDataSource>';

  // creates a json chunk of the data and if we have all
  // then we write the VRT file and return
  var collect = function(file, json, callback){
    fileCount++;

    if ( json ){
      delete json.info;
    }
    var exists = fs.existsSync( file );
    if ( exists ){
      fs.unlinkSync( file );
    }
    fs.writeFile(file, JSON.stringify(json), function(){
      vrt += '<OGRVRTLayer name="OGRGeoJSON"><SrcDataSource>'+file+'</SrcDataSource></OGRVRTLayer>';
      if (fileCount === pages){
        
        vrt += '</OGRVRTDataSource>';
        fs.writeFile(paths.rootVrtFile, vrt, function(){
          // CALL OGR
          _callOgr(paths.rootVrtFile, paths.rootNewFileTmp, function(err, formatFile){
            koop.Cache.getInfo(table, function(err, info){
              delete info.status;
              delete info.generating;
              // FINISH the UPLOAD
              finish(format, key, options, {paths: paths, file: formatFile}, function(){
                _update( info, function(err, res){});
              });
            });
          });
        });
      }
      callback();
    });
  };

  var q = async.queue(function (task, cb) {
    // instead of passing a limit and offset 
    // we use a WHERE clause 
    var idFilter = ' id >= '+ options.offset + ' AND id < ' + (parseInt(options.offset) + parseInt(options.limit));
    var opts = {
      idFilter: idFilter,
      layer: options.layer,
      where: options.where,
      geometry: options.geometry,
      bypassProcessing: true
    };
    koop.Cache.db.select(dbkey, opts, function(err, data){
      collect(task.file, data[0], cb);
    });
  }, 1);


  // create the files for out output
  // we always create a json file, then use it to convert to a file
  var paths = createPaths( dir, key, format, options);

  if ( koop.config.export_workers ) {

    koop.Cache.getInfo(table, function(err, info){
      var locked = false;
      if ( !info.export_lock ){
        info.export_lock = true;
      } else {
        locked = true;
      }

      info.status = 'processing';
      info.generating = {
        progress: 0+'%'
      };
      _update(info, function(err, res){

        // return immediately with state: processing
        done(null, info);

        options.key = key;
        options.dir = dir;

        // do all the work inside the worker
        var task = {
          options: options,
          dbkey: dbkey,
          table: table,
          format: format,
          finish: finish,
          ogrFormat: ogrFormats[format],
          files: paths,
          pages: []
        };
        
        if ( !locked ){
          var job = koop.Exporter.export_q.create( 'exports', task ).save( function( err ){
            koop.log.debug( 'added job to export queue ' + job.id);
          });

          job.on('progress', function(progress){
            
            // the question is do we need to get the info from the db here? 
            // TODO explore this in qa and its impact of DB load
            koop.Cache.getInfo( table, function( err, info ){
              info.status = 'processing';
              if (info.generating) {
                info.generating.progress = progress + '%';
              }
              _update( info, function(err, res){
                koop.log.debug( 'job progress' + job.id + ' ' + progress + '%' );
              });
            });
          });
        }
      });
    });
  } else {
    // proceed with logic here
    if (fs.existsSync(paths.rootVrtFile) && !options.ignore_cache) {
      // if we already have the vrtfile and we want a diff format 
      koop.Cache.getInfo(table, function(err, info){
        info.status = 'processing';
        info.generating = {
          progress: 0+'%'
        };
        _update( info, function(err, res){ 
          // return response 
          done(null, info);
          // create large file from vrt 
          _callOgr(paths.rootVrtFile, paths.rootNewFileTmp, function(err, formatFile){
            delete info.status;
            delete info.generating;
            finish( format, key, options, { paths: paths, file: formatFile }, function(){
              _update( info, function(e, res){});
            });
          });
        });
      });
    } else {
      // we have nothing; generate new data
      koop.Cache.getInfo(table, function(err, info){
        info.status = 'processing';
        info.generating = {
          progress: 0+'%'
        };
        _update( info, function(){
          // return info and move on as async
          done(null, info);

          mkdirp( paths.base, function(){ 
            koop.Cache.getCount(table, options, function(err, count){
              if (err) {
                console.log('error getting count')
              }
              pages = Math.ceil(count / options.limit);
              var noop = function(){};
              var tasks = [];
              for (var i=0; i < pages; i++){ 
                var offset = (i * (options.limit)) + 1;
                var op = { file: paths.base+'/part.' + i + '.json', offset: offset };
                q.push( op, noop );
              }
            });
          });

        });
      });
    }
  };
}

 
exports.exportToFormat = function( format, dir, key, geojson, options, callback ){


    if (!format){
      return callback('No format provided', null);
    } 
    else if (!ogrFormats[format]) {
      return callback('Unknown format', null);
    }

    // create the files for out output
    // we always create a json file, then use it to convert to a file
    var paths = createPaths( dir, key, format, options);

    // executes OGR
    var _callOgr = function(inFile, outFile, callback){
      var params = {
        inFile: inFile,
        outFile: outFile,
        paths: paths,
        format: format
      };
      callOgr(params, geojson, options, callback);
    };

    // create a json file on disk 
    // if we want json just send it back
    // else use the json file to convert to other formats 
    mkdirp( paths.root + '/' + paths.path, function(){
      if ( !fs.existsSync( paths.rootJsonFile ) ) {
        delete geojson.info;
        var json = JSON.stringify(geojson).replace(/esri/g,'');
        fs.writeFile( paths.rootJsonFile, json, function(err){
          _callOgr( paths.rootJsonFile, paths.rootNewFile, function(err, file){
            callback(err, {paths: paths, file: file});
          });
        });
      } else {
        if (format === 'json' || format === 'geojson'){
          callback(null, paths.rootJsonFile);
        } else {
          _callOgr( paths.rootJsonFile, paths.rootNewFileTmp, function(err, file){
            callback(err, {paths: paths, file: file});
          });
        }
      }
    });

};


// executes OGR
function callOgr(params, geojson, options, callback){

  var format = params.format,
    paths = params.paths,
    inFile = params.inFile,
    outFile = params.outFile;

  if ( fs.existsSync( outFile ) ) {

    // we already have the file, just return it 
    callback(null, outFile);

  } else {
    var ogrParams = getOgrParams( format, inFile, outFile, geojson, options );
    exec( ogrParams, function (err) {
        if (err) {
          callback( err.message + ' ' + ogrParams, null );
        } else {
          if ( format === 'zip' ){
            // mkdir for base path (dir + key) to store shp
            mkdirp( paths.base, function(){
              if ( !options.name ){
                options.name = paths.tmpName;
              }
              // cp each file into dir with new name 
              var createZip = function(){
                var newZipTmp = paths.base + '/' + options.name + paths.tmpName + '.zip';
                var newZip =  paths.base + '/' + options.name + '.zip';
                exec(['zip', '-rj', '"'+newZipTmp+'"', paths.base+'/', '--exclude=*.json*'].join(' '), function(err){
                  moveFile(newZipTmp, newZip, callback);
                });
              };

              if (options.large) {
                moveLargeShapeFile(outFile, paths.base, paths.tmpName, options.name, createZip);
              } else {
                moveShapeFile(outFile, paths.base, options.name, createZip);
              }
            });
          } else {
            moveFile(outFile, paths.rootNewFile, callback);
          }
        }
    });
  }
};


function createPaths(dir, key, format, options){
  
  var paths = {};
  // we use temp names to write new files then move 
  // them into place once they are written  
  var current_date = (new Date()).valueOf().toString();
  var random       = Math.random().toString();
  paths.tmpName    = crypto.createHash('sha1').update(current_date + random).digest('hex');
  
  paths.root       = options.rootDir || './';
  paths.path       = ['files', dir].join('/');
  paths.latestPath = ['latest','files', dir].join('/');
  paths.base       = [paths.root, paths.path, key].join('/');

  paths.jsonFile    = (options.name || key) + paths.tmpName+ '.json';
  paths.jsonFileTmp = (options.name || key) + paths.tmpName + '.json';
  // the VRT file must use the key to support large filters
  // the file has to be unique to the filter
  paths.vrtFile     = key + '.vrt';
  paths.newFileTmp  = key + paths.tmpName + '.' + format;
  paths.newFile     = (options.name || key) + '.' + format;

  paths.rootJsonFile    = [paths.root, paths.path, paths.jsonFile].join( '/' );
  paths.rootVrtFile     = [paths.root, paths.path, paths.vrtFile].join( '/' ),
  paths.rootJsonFileTmp = [paths.root, paths.path, paths.jsonFileTmp].join( '/' );
  paths.rootNewFile     = [paths.root, paths.path, paths.newFile].join( '/' );
  paths.rootNewFileTmp  = [paths.root, paths.path, paths.newFileTmp].join( '/' );

  return paths;
}

function moveShapeFile( file, base, name, callback){
  var shp = file.replace('zip','shp');
  var dbf = file.replace('zip','dbf');
  var shx = file.replace('zip','shx');
  var prj = file.replace('zip','prj');
  var cpg = file.replace('zip','cpg');
  mv(shp, base+'/' + name + '.shp', function(err){
    mv(dbf, base+'/' + name + '.dbf', function(err){
      mv(shx, base+'/' + name + '.shx', function(err){
        mv(prj, base+'/' + name + '.prj', function(err){
          mv(cpg, base+'/' + name + '.cpg', function(err){
            callback(err);
          });
        });
      });
    });
  });
}

function moveLargeShapeFile( file, base, tmpName, name, callback){
  var shp = file.replace('zip','shp');
  var dbf = file.replace('zip','dbf');
  var shx = file.replace('zip','shx');
  var prj = file.replace('zip','prj');
  var cpg = file.replace('zip','cpg');

  var shpdir = base + tmpName + '.shp';
  mv(shpdir+'/OGRGeoJSON.shp', base+'/' + name + '.shp', function(err){
    mv(shpdir+'/OGRGeoJSON.dbf', base+'/' + name + '.dbf', function(err){
      mv(shpdir+'/OGRGeoJSON.shx', base+'/' + name + '.shx', function(err){
        mv(shpdir+'/OGRGeoJSON.prj', base+'/' + name + '.prj', function(err){
          mv(shpdir+'/OGRGeoJSON.cpg', base+'/' + name + '.cpg', function(err){
            callback(err);
          });
        });
      });
    });
  });
}

function moveFile(inFile, newFile, callback){
  mv(inFile, newFile, function(err){
    if (err){
      callback(err);
    } 
    else {
      callback(null, newFile);
    }
  });
}


function getOgrParams( format, inFile, outFile, geojson, options ){

  // escape quotes in file names
  inFile = inFile.replace(/"/g, '\"');  
  outFile = outFile.replace(/"/g, '\"');  

  var cmd = [
    'ogr2ogr',
    '--config',
    'SHAPE_ENCODING',
    'UTF-8',
    '-f',
    ogrFormats[format],
    ( format === 'zip' ) ? outFile.replace('zip','shp') : outFile,
    inFile
  ];

  if (format === 'csv') {
    if ( geojson && geojson.features && geojson.features.length && geojson.features[0].geometry && geojson.features[0].geometry.type == 'Point' && ((!geojson.features[0].properties['x'] && !geojson.features[0].properties['y']) || (!geojson.features[0].properties['X'] && !geojson.features[0].properties['Y']))){
      cmd.push('-lco');
      cmd.push('WRITE_BOM=YES');
      cmd.push('-lco');
      cmd.push('GEOMETRY=AS_XY');
    }
  } else if (format === 'zip' || format === 'shp'){
    // only project features for shp when wkid != 4326 or 3857 or 102100
    if ( options.wkid ){
      var proj = projCodes.lookup(options.wkid);
      if (proj && proj.wkt){
        // always replace Lambert_Conformal_Conic with Lambert_Conformal_Conic_1SP
        // open ogr2ogr bug: http://trac.osgeo.org/gdal/ticket/2072
        var wkt = proj.wkt;
       
        // if we are using LCC we need to apply the datum transformation 
        if (wkt.match(/Lambert_Conformal_Conic/)) {
          wkt = wkt.replace('Lambert_Conformal_Conic', 'Lambert_Conformal_Conic_2SP');
        } else if (wkt.match(/UTM/)) {
          wkt = wkt.replace("],PRIMEM", ",TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062]],PRIMEM");
        }
        // we have issue projecting this WKID w/o a datum xform
        // FYI there may be other proj codes needed here 
        if (options.wkid === 2927){
          wkt = wkt.replace("],PRIMEM", ",TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062]],PRIMEM")
        } else if (options.wkid === 3078){
          wkt = "+proj=omerc +lat_0=45.30916666666666 +lonc=-86 +alpha=337.25556 +k=0.9996 +x_0=2546731.496 +y_0=-4354009.816 +ellps=GRS80 +datum=NAD83 +units=m +no_defs";
        }

        cmd.push('-t_srs');
        cmd.push('\''+ wkt +'\'');
      } else {
        console.log('No proj info found for WKID', options.wkid, outFile);
      }
    } else if (options.wkt){
      cmd.push('-t_srs');
      cmd.push('\''+ options.wkt +'\'');
    }

    // make sure field names are not truncated multiple times
    cmd.push('-fieldmap');
    cmd.push('identity');

  }

  cmd.push('-update');
  cmd.push('-append');
  cmd.push('-skipfailures');
  cmd.push('-lco');
  cmd.push('ENCODING=UTF-8');
  console.log(cmd.join(' '))
  return cmd.join(' '); 
};

exports.createPaths = createPaths;
exports.callOgr = callOgr;
exports.moveFile = moveFile;
exports.moveShapeFile = moveShapeFile;
exports.getOgrParams = getOgrParams;

