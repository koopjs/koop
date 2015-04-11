var kue = require('kue'),
  fs = require('node-fs'),
  mv = require('mv'),
  async = require('async'),
  koop = require('./'),
  pgcache = require('koop-pgcache'),
  cluster = require('cluster'),
  path = require('path'),
  rimraf = require('rimraf'),
  exec = require('child_process').exec;

// get the config from a stdin given dir
try {
  config = require(path.join(__dirname, process.argv[2]));
} catch(e){
  config = require('config');
}

if (!config.export_workers){
  console.log('No worker configutation found, exiting.');
  process.exit();
}

// set up koop with the thing we need like logging and the cache
koop.config = config;
koop.log = new koop.Logger( config );
koop.Cache = new koop.DataCache( koop );
koop.files = new koop.Files( koop );

// registers a DB modules  
koop.Cache.db = pgcache.connect( config.db.conn, koop );

// create the job queue
jobs = kue.createQueue({
  prefix: config.export_workers.redis.prefix,
  redis: {
    port: config.export_workers.redis.port,
    host: config.export_workers.redis.host
  }
});


// process 2 jobs at a time
// TODO think about scaling this and how to do we start many workers 
//  - ie can this be distributed across more machines?
//  - does it need to on the same server always? 
jobs.process('exports', 2, function(job, done){
  console.log('starting export job', job.id);

  var domain = require('domain').create();
  domain.on('error', function(err){
    done(err);
  });

  domain.run(function(){

    // Jobs for removing files from the local FS
    if (job.data.remove){
      // remove
      // simply blow away the local dir for the given data set
      var dir = path.join(koop.files.localDir, 'files', (job.data.itemId+'_'+job.data.layerId));
      rimraf(dir, function(err){
        return done();
      });

    // if we have VRT file we can use that to create a new export 
    } else { 
      koop.Cache.getCount(job.data.table, job.data.options, function(err, count){
        
        // if we can handle the data in one page 
        if (count < job.data.options.limit) {
              job.data.options.bypassProcessing = true;
              koop.Cache.db.select(job.data.dbkey, job.data.options, function(err, geojson){
                delete geojson[0].info;
                koop.Exporter.exportToFormat( 
                  job.data.options.format, 
                  job.data.options.dir, 
                  job.data.options.key, 
                  geojson[0], 
                  job.data.options, 
                  function(err, result ){
                    if (err){
                      return done( err );
                    }
                    finishExport( 
                      job.data.format, 
                      job.data.options.key, 
                      job.data.options, 
                      result, 
                      done
                    );            
                });
              });
        }
        // else if we already have a VRT 
        else if (fs.existsSync(job.data.files.rootVrtFile) && !job.data.options.ignore_cache){
          // since we have a VRT file locally
          // we just want to create the export and complete the job
          koop.Cache.getInfo(job.data.table, function(err, info){
            if (err){
              console.log('vrt file exists, but no data in the db', job.data.files.rootVrtFile)
              return done('failed to generate export' + err);
            }
            info.status = 'processing';
            info.generating = {
              progress: 100+'%'
            };
            koop.Cache.updateInfo(job.data.table, info, function(err, res){
              // create large file from vrt
              var cmd = ['ogr2ogr', '-f', job.data.ogrFormat, '-update', '-append', ( job.data.format == 'zip' ) ? job.data.files.rootNewFileTmp.replace('.zip','') : job.data.files.rootNewFileTmp, job.data.files.rootVrtFile]; 
    
              try { 
    
                var params = {
                  inFile: job.data.files.rootVrtFile,
                  outFile: job.data.files.rootNewFileTmp,
                  paths: job.data.files,
                  format: job.data.format
                };
                job.data.options.large = true; 
                koop.Exporter.callOgr(params, null, job.data.options, function(err, formatFile){
                  if (err){
                    return done( err );
                  }
                  // remove the processing state and return the job
                  delete info.status;
                  delete info.generating;
                  delete info.export_lock;
                  finishExport( job.data.format, job.data.options.key, job.data.options, { paths: job.data.files, file: formatFile }, function(){
                    koop.Cache.updateInfo(job.data.table, info, function(e, res){
                      if (err) {
                        return done(err);
                      } else {
                        if (typeof gc === 'function') {
                          gc();
                        }
                        return done();
                      }
                    });
                  });
                });
              } catch (e){
                console.log('error calling org', e);
                info.generating = { error: e };
                koop.Cache.updateInfo( job.data.table, info, function(err, res){
                  done('failed to generate file ' + e);
                });
              }
            });
          });
        } else {
          fs.mkdir( job.data.files.base, '0777', true, function(){
            koop.Cache.getCount(job.data.table, job.data.options, function(err, count){
              var pages = Math.ceil(count / job.data.options.limit);
              for (var i=0; i < pages; i++){
                  var offset = i * (job.data.options.limit);
                  var chunk = { file: job.data.files.base+'/part.' + i + '.json', offset: offset };
                  job.data.pages.push( chunk );
              }
              createFiles( job, done );
            });
          });
        }
      });
    }

  });
});


function createFiles(job, done){
  // create a new VRT File
  var vrt = '<OGRVRTDataSource>';
  fs.appendFileSync( job.data.files.rootVrtFile, vrt );

  var pageLen = job.data.pages.length,
    completed = 0;

  var workerQ = async.queue(function(task, cb){
    var opts = {
      layer: task.options.layer,
      limit: task.options.limit,
      where: task.options.where,
      geometry: task.options.geometry,
      offset: task.offset,
      bypassProcessing: true
    };
  
    var filePart = task.file;
  
    koop.Cache.db.select(task.dbkey, opts, function(err, json){
      koop.Cache.getInfo(task.table, function(err, info){
        if ( json && json[0] && json[0].info ){
          delete json[0].info;
          json = json[0];
        }
        var exists = fs.existsSync( filePart );
        if ( exists ){
          fs.unlinkSync( filePart );
        }
        fs.writeFile(filePart, JSON.stringify(json), function(){
          // tick up the number of complete pages
          completed++;
          job.progress( completed, pageLen );
  
          // TODO why build this here? 
          // we could open a file handle and push each layer into the file via io
          var vrtPartial = '<OGRVRTLayer name="OGRGeoJSON"><SrcDataSource>';
          vrtPartial += filePart;
          vrtPartial += '</SrcDataSource></OGRVRTLayer>';
          fs.appendFileSync(task.files.rootVrtFile, vrtPartial);
  
          if (completed == pageLen){
            // close the VRT
            fs.appendFileSync( task.files.rootVrtFile, '</OGRVRTDataSource>' );
              var params = {
                inFile: task.files.rootVrtFile,
                outFile: task.files.rootNewFileTmp,
                paths: task.files,
                format: task.format
              };

              try {
               job.data.options.large = true; 
               koop.Exporter.callOgr(params, null, job.data.options, function(err, formatFile){
                  if (err){
                    return done( err );
                  }
                  delete info.status;
                  delete info.generating;
                  delete info.export_lock;
                  finishExport( task.format, task.options.key, task.options, { paths: task.files, file: formatFile }, function(){
                    koop.Cache.updateInfo( task.table, info, function(err, res){
                      if (typeof gc === 'function') {
                        gc();
                      }
                      done();
                      cb();
                    });
                  });
                });
              } catch (e){
                console.log('error calling org', e);
                info.generating = { error: e };
                koop.Cache.updateInfo( task.table, info, function(err, res){
                  done('failed to generate file ' + e);
                  workerQ.kill();
                  cb();
                });
              }
            //});
          } else {
            cb();
          }
        });
      });
    });
  
  },4);

  job.data.pages.forEach(function(page,i){
    var task = {
      options: job.data.options,
      file: page.file,
      offset: page.offset,
      dbkey: job.data.dbkey,
      table: job.data.table,
      format: job.data.format,
      ogrFormat: job.data.ogrFormat,
      files: job.data.files
    };
    workerQ.push(task, function(err){ if (err) console.log(err); });
  });

}


// This method is duplicate method from whats in the BaseModel.
// since workers are removed from koop providers we dont have access to 
// these methods in the workers.
// This function finishes the export by cleaning up after it self and uploading to s3 
function finishExport(format, key, options, result, callback){

  var sendFile = function(err, result){
    if (koop.files.s3) {
      try {
        // try to clean up local FS
        fs.unlinkSync(result.paths.rootJsonFile);
      } catch(e){
        koop.log.debug('Trying to remove non-existant file: %s', e);
      }
      koop.files.exists( result.paths.path+'/'+key, result.paths.newFile, function(exists, path){
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
        callback(null, result.file);
      }
    }
  };
  
  if ( koop.files.s3 ){
    try {
      var stream = fs.createReadStream( result.file );
      koop.files.write( result.paths.path+'/'+key, result.paths.newFile, stream, function( err ){
        if (!options.isFiltered){
          koop.files.write( result.paths.latestPath, result.paths.newFile, fs.createReadStream( result.file ), function( err ){
            try {
              fs.unlinkSync(result.paths.rootNewFile);
            } catch (e){
              koop.log.debug('Trying to remove non-existant file: ' + result.paths.rootNewFile );
            }
          });
        }
        sendFile(null, result);
      });
    } catch (e){
      console.log('Error while saving to s3', e, result.file);
      sendFile(null, result);
    } 
  } else {
    sendFile(null, result);
  }
}

