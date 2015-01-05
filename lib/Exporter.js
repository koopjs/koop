// Exports data as any supported format 
// take in a format, file key, geojson, and callback
var fs = require('node-fs'),
  crypto = require('crypto'),
  mv = require('mv'),
  kue = require('kue'),
  async = require('async');

var exec = require('child_process').exec;

var Exporter = function( koop ){
  var self = this;

  this.ogrFormats = {
      kml: 'KML',
      zip: '\"ESRI Shapefile\"',
      csv: 'CSV',
      json: 'GeoJSON',
      geojson: 'GeoJSON',
      gpkg: 'GPKG'
  };

  // connect the worker queue for large exports
  if ( koop.config.export_workers ){
    this.export_q = kue.createQueue({
      prefix: koop.config.export_workers.redis.prefix,
      disableSearch: true,
      redis: {
        port: koop.config.export_workers.redis.port,
        host: koop.config.export_workers.redis.host
      }
    });

    // remove completed jobs from the queue 
    this.export_q.on('job complete', function(id) {
      kue.Job.get( id, function( err, job ) {
         if (err) return;
         job.remove(function( err ){
            if (err) {
              koop.log.debug('Export Workers: could not remove completed job #' + job.id);
            }
            koop.log.debug('Export Workers: removed completed job #' + job.id + ' - ' + id);
         });
      });
    });

    this.export_q.on('job failed', function(id, jobErr) {
      kue.Job.get( id, function( err, job ) {
         if (err) return;
         job.remove(function( err ){
           koop.log.debug( 'Export Workers: removed failed job #' + job.id + ' Error: ' + jobErr);
         });
      });
    });

    
  }

  // exports large data via multi part file strategy
  this.exportLarge = function( format, id, key, type, options, done ){
    if (!format){
      return done('No format provided', null);
    }
    var self = this;
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
    var callOGR = function( format, outFile, cmd, callback ){
      if ( format == 'csv' && options.geomType && options.geomType == 'esriGeometryPoint' ) {
        cmd.push('-lco');
        cmd.push('WRITE_BOM=YES');
        cmd.push('-lco');
        cmd.push('GEOMETRY=AS_XY');
      } else if (format == 'zip' || format == 'shp'){
        cmd.push('-lco');
        cmd.push('ENCODING=UTF-8');
        if ( options.geomType && options.geomType == 'esriGeometryPoint' ){
          // TODO This is really causing trouble here - must understand why
          //cmd.push('-where');
          //cmd.push("OGR_GEOMETRY='POINT'");
        } else if (options.geomType && options.geomType == 'esriGeometryPolygon') {
          cmd.push('-lco');
          cmd.push("SHPT=POLYGON");
        }
        cmd.push('-fieldmap');
        cmd.push('identity');
      }

      koop.log.info('calling ogr2ogr: %s', cmd.join(' '));
      exec(cmd.join(' '), function (err, stdout, stderr) {
        koop.log.info('ogr2ogr done', err, stdout, stderr);
        if ( format == 'zip' || format == 'shp'){
          // mkdir for base path (dir + key) to store shp
          fs.mkdir( base, '0777', true, function(){
            var shp = outFile.replace('zip','shp');
            var dbf = outFile.replace('zip','dbf');
            var shx = outFile.replace('zip','shx');
            var prj = outFile.replace('zip','prj');
            var cpg = outFile.replace('zip','cpg');
            if ( options.name ){
                // cp each file into dir with new name 
                var shpdir = base + tmpName + '.shp';
                mv(shpdir+'/OGRGeoJSON.shp', base+'/' + options.name + '.shp', function(err) {
                  mv(shpdir+'/OGRGeoJSON.dbf', base+'/' + options.name + '.dbf', function(err) {
                    mv(shpdir+'/OGRGeoJSON.shx', base+'/' + options.name + '.shx', function(err) {
                      mv(shpdir+'/OGRGeoJSON.prj', base+'/' + options.name + '.prj', function(err) {
                        mv(shpdir+'/OGRGeoJSON.cpg', base+'/' + options.name + '.cpg', function(err) {
                          // zip all and return the new zip
                          var newZipTmp = base + '/' + options.name + tmpName + '.zip';
                          var newZip = base + '/' + options.name + '.zip';
                          var zipCMD = ['zip', '-rj', '"'+newZipTmp+'"', base+'/', '--exclude=*.json*'].join(' ');
                          koop.log.debug('creating a new zip: %s', zipCMD);
                          try {
                            exec( zipCMD, function( err, stdout, stderr ){
                              mv(newZipTmp, newZip, function(err) {
                                if ( koop.files.s3 ) {
                                  var stream = fs.createReadStream(newZip);
                                  koop.files.write( path+'/'+key, options.name + '.zip', stream, function( err ){
                                    callback(null, newZip);
                                  });
                                } else {
                                  callback(null, newZip);
                                }  
                              });
                            });
                          } catch(e){
                            koop.log.error('Trapped ERROR %s, %s', e, key);
                            callback(e,null);
                          }  
                        });
                      });
                    });
                  });
                });  
            } else {
              child = exec(['zip', '-j', outFile, shp, dbf, shx, prj, cpg].join(' '), function (err, stdout, stderr) {
                mv(outFile, rootNewFile, function(err) {
                  if ( koop.files.s3 ) {
                    var stream = fs.createReadStream(rootNewFile);
                    koop.files.write( path+'/'+key, newFile, stream, function( err ){
                      callback(null, rootNewFile);
                    });
                  } else {
                    callback(null, rootNewFile);
                  }
                });    
              });
            }
          });
        } else {
          mv(outFile, rootNewFile, function(err) {
            console.log('ogr2ogr done');
            if ( koop.files.s3 ) {
              var stream = fs.createReadStream(rootNewFile);
              koop.files.write( path+'/'+key, newFile, stream, function( err ){
                callback(null, rootNewFile);
              });
            } else {
              callback(null, rootNewFile);
            }
          });
        }
      });
    };

    var vrt = '<OGRVRTDataSource>';

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
        if (fileCount == pages){
          
          vrt += '</OGRVRTDataSource>';
          fs.writeFile(rootVrtFile, vrt, function(){
            // CALL OGR
            cmd = ['ogr2ogr', '-f', self.ogrFormats[format], '-update', '-append', ( format == 'zip' ) ? rootNewFileTmp.replace('zip','shp') : rootNewFileTmp, rootVrtFile];
            callOGR(format, rootNewFileTmp, cmd, function(err, formatFile){
              koop.Cache.getInfo(table, function(err, info){
                delete info.status;
                delete info.generating;
                _update( info, function(err, res){
                });
              });
            });
          });
        }
        callback();
      });
    };

    var q = async.queue(function (task, cb) {
      var opts = {
        layer: options.layer,
        limit: options.limit,
        where: options.where,
        geometry: options.geometry,
        offset: task.offset,
        bypassProcessing: true
      };
      koop.Cache.db.select(dbkey, opts, function(err, data){
        collect(task.file, data[0], cb);
      });
    }, 1);

    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var tmpName = crypto.createHash('sha1').update(current_date + random).digest('hex');

    // the paths for export files is complex because we support local and s3 uploads 
    var root = koop.files.localDir;
    var path = ['files', dir].join('/');
    var base = [root, path, key].join('/');

    var jsonFile = key + '.json',
      vrtFile = key + '.vrt',
      newFileTmp = key + tmpName + '.' + format,
      newFile = ( options.name || key ) + '.' + format;

    var rootJsonFile = [root, path, jsonFile].join( '/' ),
      rootVrtFile = [root, path, vrtFile].join( '/' ),
      rootNewFile = [root, path, newFile].join( '/' ),
      rootNewFileTmp = [root, path, newFileTmp].join( '/' );

    
    if ( koop.config.export_workers ) {

      koop.Cache.getInfo(table, function(err, info){
        info.status = 'processing';
        info.generating = {
          progress: 0+'%'
        };
        _update(info, function(err, res){

          // return immediately with state: processing
          done(null, info);

          // do all the work inside the worker
          var task = {};
          task.options = options;
          task.options.key = key;
          task.dbkey = dbkey;
          task.table = table;
          task.format = format;
          task.ogrFormat = self.ogrFormats[format];
          task.files = {
            root: root,
            path: path,
            base: base,
            tmpName: tmpName,
            jsonFile: jsonFile,
            vrtFile: vrtFile,
            newFileTmp: newFileTmp,
            newFile: newFile,
            rootJsonFile: rootJsonFile,
            rootVrtFile: rootVrtFile,
            rootNewFile: rootNewFile,
            rootNewFileTmp: rootNewFileTmp
          };
          task.pages = [];
          
          var job = self.export_q.create( 'exports', task ).save( function( err ){
            koop.log.debug( 'added job to export queue ' + job.id);
          });

          job.on('progress', function(progress){
            koop.Cache.getInfo( table, function( err, info ){
              if (info.generating) {
                info.generating.progress = progress + '%';
              }
              _update( info, function(err, res){
                koop.log.debug( 'job progress' + job.id + ' ' + progress + '%' );
              });
            });
          });
        });
      });
    } else {
      // proceed with logic here
      if (fs.existsSync(rootVrtFile) && !options.ignore_cache) {
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
            callOGR(format, rootNewFileTmp, cmd, function(err, formatFile){
              delete info.status;
              delete info.generating;
              _update( info, function(e, res){});
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
          _update( info, function(err, res){
            // return info and move on as async
            done(null, info);

            fs.mkdir( base, '0777', true, function(){ 
              koop.Cache.getCount(table, options, function(err, count){
                pages = Math.ceil(count / options.limit);
                var noop = function(){};
                var tasks = [];
                for (var i=0; i < pages; i++){ 
                  var offset = i * (options.limit);
                  var op = { file: base+'/part.' + i + '.json', offset: offset };
                  q.push( op, noop );
                }
              });
            });

          });
        });
      }
    }
  };
 
  this.exportToFormat = function( format, dir, key, geojson, options, callback ){
    if (!format){
      return callback('No format provided', null);
    }
    var self = this;

    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var tmpName = crypto.createHash('sha1').update(current_date + random).digest('hex');

    // create the files for out output
    // we always create a json file, then use it to convert to a file
    var root = koop.files.localDir;
    var path = ['files', dir].join('/');
    var base = [root, path, key].join('/');
      
    var jsonFile = (options.name || key) +tmpName+ '.json',
      jsonFileTmp = (options.name || key) + tmpName + '.json',
      newFileTmp = key + tmpName + '.' + format,
      newFile = (options.name || key) + '.' + format;
    
    var rootJsonFile = [root, path, jsonFile].join( '/' ),
      rootJsonFileTmp = [root, path, jsonFileTmp].join( '/' ),
      rootNewFile = [root, path, newFile].join( '/' );
      rootNewFileTmp = [root, path, newFileTmp].join( '/' );

    // executes OGR
    var _callOgr = function(inFile, outFile, callback){
      //if (format == 'json' || format == 'geojson'){
      //  callback(null, outFile.replace('geojson', 'json'));
      if (self.ogrFormats[format]) {
        
        var cmd = [
          'ogr2ogr', 
          '--config',
          'SHAPE_ENCODING',
          'UTF-8', 
          '-f', 
          self.ogrFormats[format], 
          ( format == 'zip' ) ? outFile.replace('zip','shp') : outFile, 
          inFile
        ];

        if (format == 'csv') {
          if ( geojson && geojson.features && geojson.features.length && geojson.features[0].geometry && geojson.features[0].geometry.type == 'Point'){
            cmd.push('-lco');
            cmd.push('WRITE_BOM=YES');
            cmd.push('-lco');
            cmd.push('GEOMETRY=AS_XY');
          }
        } else if (format == 'zip' || format == 'shp'){
          if ( geojson && geojson.features && geojson.features.length && (!geojson.features[0].geometry || geojson.features[0].geometry.type == 'Point')){
            //cmd.push('-where');
            //cmd.push("OGR_GEOMETRY='POINT'");
          }
        }
        // encode everything as utf8
        cmd.push('-skipfailures');
        cmd.push('-lco');
        cmd.push('ENCODING=UTF-8');
        if ( fs.existsSync( outFile ) ) {
          callback(null, outFile);
        } else {
          koop.log.debug('calling ogr2ogr: %s', cmd.join(' '));
          child = exec(cmd.join(' '), function (err, stdout, stderr) {
              if (err) {
                koop.log.error('ERROR calling ogr2ogr: %s, %s', cmd.join(' '), err.message);
                callback(err.message, null);
              } else {
                if ( format == 'zip' ){
                  // mkdir for base path (dir + key) to store shp
                  fs.mkdir( base, '0777', true, function(){
                    var shp = outFile.replace('zip','shp');
                    var dbf = outFile.replace('zip','dbf');
                    var shx = outFile.replace('zip','shx');
                    var prj = outFile.replace('zip','prj');
                    var cpg = outFile.replace('zip','cpg');
                    if ( options.name ){
                      // cp each file into dir with new name 
                      mv(shp, base+'/' + options.name + '.shp', function(err){
                        mv(dbf, base+'/' + options.name + '.dbf', function(err){
                          mv(shx, base+'/' + options.name + '.shx', function(err){
                            mv(prj, base+'/' + options.name + '.prj', function(err){
                              mv(cpg, base+'/' + options.name + '.cpg', function(err){
                                var newZipTmp = base + '/' + options.name + tmpName + '.zip';
                                var newZip =  base + '/' + options.name + '.zip';
                                exec(['zip', '-rj', '"'+newZipTmp+'"', base+'/'].join(' '), function(err, stdout, stderr){
                                  mv(newZipTmp, newZip, function(err) {
                                    if ( koop.files.s3 ) {
                                      var stream = fs.createReadStream(newZip);
                                      koop.files.write( path+'/'+key, options.name + '.zip', stream, function( err ){
                                        callback(null, newZip);
                                      });
                                    } else {
                                      callback(null, newZip);
                                    }
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    } else {
                      exec(['zip', '-j', outFile, shp, dbf, shx, prj].join(' '), function(err, stdout, stderr){
                        if ( koop.files.s3 ) { 
                          var stream = fs.createReadStream(outFile);
                          koop.files.write( path+'/'+key, newFile, stream, function( err ){
                            callback(null, outFile);
                          });
                        } else {
                          callback(null, outFile);
                        }
                      });
                    }
                  });
                } else {
                  mv(outFile, rootNewFile, function(err) {
                    if ( koop.files.s3 ){ 
                      var stream = fs.createReadStream(rootNewFile);
                      koop.files.write( path+'/'+key, newFile, stream, function( err ){
                        callback(null, rootNewFile);
                      });
                    } else {
                      callback(null, rootNewFile);
                    }
                  });
                }
              }
          });
        }
      } else {
        callback('Unknown format', null);
      }
    };

    // handles the response to callback
    var _send = function(err, file){
      // remove the local files;
      if (koop.files.s3) {
        try {
          fs.unlinkSync(rootNewFile);
          fs.unlinkSync(rootJsonFile);
        } catch(e){
          koop.log.debug('Trying to remove non-existant file: %s', e); 
        }
        koop.files.exists( path+'/'+key, newFile, function(exists, path){
          if (!exists){
            callback( 'File did not get created.', null );
          } else {
            callback(null, path);
          }
        });
      } else {
        if (err){
          callback( err, null );
        } else {
          callback(null, file);
        }
      }
    };


    fs.mkdir( root+'/'+path, '0777', true, function(){
      if ( !fs.existsSync( rootJsonFile ) ) {
        delete geojson.info;
        var json = JSON.stringify(geojson).replace(/esri/g,'');
        fs.writeFile( rootJsonFile, json, function(err){
          /*if ( koop.files.s3 ){
            var stream = fs.createReadStream( rootJsonFile );
            koop.files.write( path+'/'+key, jsonFile, stream, function( err ){
              _callOgr( rootJsonFile, rootNewFile, _send );
            });
          } else {
            _callOgr( rootJsonFile, rootNewFile, _send);
          }*/
          _callOgr( rootJsonFile, rootNewFile, _send);
        });
      } else {
        if (format == 'json' || format == 'geojson'){
          callback(null, rootJsonFile);
        } else {
          _callOgr( rootJsonFile, rootNewFileTmp, _send) ;
        }
      }
    });
  };

  // concurrent queue for feature pages
  this.taskQueue = async.queue(function (task, callback) {
    // tell the cache to ignore data in a processing state
    task.options.bypassProcessing = true;
    self._finish(task, callback);
  }, 2);


  this._finish = function( params, callback ){
    var self = this;
    var limit = 10000;

    var layer = (params.options.layer || 0);

    var key = [params.type, params.id, layer].join(":");
      dir = params.id + '_' + layer;

    var _update = function( info, cb ){
      koop.Cache.updateInfo(key, info, function(err, success){
        cb();
      });
    };

    koop.Cache.getInfo(key, function(err, info){
      if (info) {
        delete info.status;

        if (info.format){
          var format = info.format;
          delete info.format;

          koop.Cache.getCount(key, params.options, function(err, count){
            if ( count > limit ){
              //self.exportLarge( format, params.id, params.hash, params.type, params.options, function(err, result){
                _update( info, function(){
                  callback(err, true);
                });
              //});

            } else {
              // export as normal
              koop.log.debug('Tasker is creating file %s', params.id);
              koop.Cache.get( params.type, params.id, params.options, function(err, entry ){
                if (!err){
                  self.exportToFormat( format, dir, params.hash, entry[0], params.options, function(err, result){
                    _update( info, function(){
                      callback(err, result);
                    });
                  });
                }
              });
            }
          });
        } else {
          _update( info, function(err, result) {
            callback(err, '');
          });
        }
      } else {
        callback(err, '');
      }
    });
  };


  return this;

};

module.exports = Exporter;
