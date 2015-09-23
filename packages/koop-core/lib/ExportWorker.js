var kue = require('kue')
var fs = require('node-fs')
var async = require('async')
var koopLib = require('./')
var pgcache = require('koop-pgcache')
var path = require('path')
var rimraf = require('rimraf')
var config

// get the config from a stdin given dir
try {
  config = require(path.join(__dirname, process.argv[2]))
} catch (e) {
  config = require('config')
}

if (!config.export_workers) {
  console.log('No worker configuration found, exiting.')
  process.exit()
}

// set up koop with the thing we need like logging and the cache
koopLib.config = config
koopLib.log = new koopLib.Logger(config)
koopLib.Cache = new koopLib.DataCache(koopLib)
koopLib.files = new koopLib.Files(koopLib)

// registers a DB modules
koopLib.Cache.db = pgcache.connect(config.db.conn, koopLib)

// create the job queue
var jobs = kue.createQueue({
  prefix: config.export_workers.redis.prefix,
  redis: {
    port: config.export_workers.redis.port,
    host: config.export_workers.redis.host
  }
})

// exports probably should not be done concurrently in the same process
// in practice it leads to memory allocation errors when handling multiple large datasets
var concurrency = config.export_workers.concurrency || 1
jobs.process('exports', concurrency, function (job, done) {
  console.log('starting export job', job.id)

  var domain = require('domain').create()

  domain.on('error', function (err) {
    done(err)
  })

  domain.run(function () {
    // Jobs for removing files from the local FS
    if (job.data.remove) {
      // remove
      // simply blow away the local dir for the given data set
      var dir = path.join(koopLib.files.localDir, 'files', (job.data.itemId + '_' + job.data.layerId))

      rimraf(dir, function (err) {
        if (err) done(err)
        return done()
      })

    // if we have VRT file we can use that to create a new export
    } else {
      koopLib.Cache.getCount(job.data.table, job.data.options, function (err, count) {
        if (err) done(err)

        // if we can handle the data in one page
        if (count <= job.data.options.limit) {
          job.data.options.bypassProcessing = true
          koopLib.Cache.db.select(job.data.dbkey, job.data.options, function (err, geojson) {
            if (err) done(err)

            delete geojson[0].info
            koopLib.Exporter.exportToFormat(
              job.data.options.format,
              job.data.options.dir,
              job.data.options.key,
              geojson[0],
              job.data.options,
              function (err, result) {
                if (err) return done(err)

                finishExport(
                  job.data.format,
                  job.data.options.key,
                  job.data.options,
                  result,
                  function (err, path) {
                    if (err) done(err)

                    koopLib.Cache.getInfo(job.data.table, function (err, info) {
                      if (err) done(err)

                      delete info.status
                      delete info.generating
                      delete info.export_lock

                      koopLib.Cache.updateInfo(job.data.table, info, function (err, res) {
                        if (err) return done(err)
                        return done()
                      })
                    })
                  }
                )
              })
          })
        } else if (fs.existsSync(job.data.files.rootVrtFile) && !job.data.options.ignore_cache) {
          // else if we already have a VRT
          // since we have a VRT file locally
          // we just want to create the export and complete the job
          koopLib.Cache.getInfo(job.data.table, function (err, info) {
            if (err) {
              console.log('vrt file exists, but no data in the db', job.data.files.rootVrtFile)
              return done('failed to generate export' + err)
            }

            info.status = 'processing'
            info.generating = {
              progress: 100 + '%'
            }

            koopLib.Cache.updateInfo(job.data.table, info, function (err, res) {
              if (err) return done(err)

              try {
                var params = {
                  inFile: job.data.files.rootVrtFile,
                  outFile: job.data.files.rootNewFile,
                  paths: job.data.files,
                  format: job.data.format
                }

                var options = job.data.options
                options.large = true
                options.db = koopLib.Cache.db
                options.logger = koopLib.log

                var geojson = JSON.parse(fs.readFileSync(path.dirname(params.inFile) + 'part1.json'))
                koopLib.Exporter.callOgr(params, geojson, job.data.options, function (err, formatFile) {
                  if (err) return done(err)

                  // remove the processing state and return the job
                  delete info.status
                  delete info.generating
                  delete info.export_lock
                  finishExport(
                    job.data.format,
                    job.data.options.key,
                    job.data.options,
                    { paths: job.data.files, file: formatFile },
                    function () {
                      koopLib.Cache.updateInfo(job.data.table, info, function (e, res) {
                        if (err) return done(err)
                        return done()
                      })
                    }
                  )
                })
              } catch (e) {
                console.log('error calling org', e)
                info.generating = { error: e }
                koopLib.Cache.updateInfo(job.data.table, info, function (err, res) {
                  if (err) return done(err)
                  done('failed to generate file ' + e)
                })
              }
            })
          })
        } else {
          fs.mkdir(job.data.files.base, '0777', true, function () {
            koopLib.Cache.getCount(job.data.table, job.data.options, function (err, count) {
              if (err) return done(err)

              var pages = Math.ceil(count / job.data.options.limit)

              for (var i = 0; i < pages; i++) {
                var offset = (i * (job.data.options.limit)) + 1
                var chunk = { file: job.data.files.base + '/part.' + i + '.json', offset: offset }
                job.data.pages.push(chunk)
              }

              createFiles(job, done)
            })
          })
        }
      })
    }
  })
})

function createFiles (job, done) {
  var vrt = '<OGRVRTDataSource>'
  var pageLen = job.data.pages.length
  var completed = 0

  // create a new VRT File
  fs.appendFileSync(job.data.files.rootVrtFile, vrt)

  var workerQ = async.queue(function (task, cb) {
    // make sure offset is in options for creating the idFilter below
    task.options.offset = task.offset

    var opts = {
      layer: task.options.layer,
      where: task.options.where,
      idFilter: koopLib.Exporter.createIdFilter(task.options),
      geometry: task.options.geometry,
      bypassProcessing: true
    }

    var filePart = task.file

    koopLib.Cache.db.select(task.dbkey, opts, function (err, json) {
      if (err) return done(err)

      koopLib.Cache.getInfo(task.table, function (err, info) {
        if (err) return done(err)

        if (json && json[0] && json[0].info) {
          delete json[0].info
          json = json[0]
        }

        var exists = fs.existsSync(filePart)

        if (exists) {
          fs.unlinkSync(filePart)
        }

        fs.writeFile(filePart, JSON.stringify(json), function () {
          // tick up the number of complete pages
          completed++
          job.progress(completed, pageLen)

          // TODO why build this here?
          // we could open a file handle and push each layer into the file via io
          var vrtPartial = '<OGRVRTLayer name="OGRGeoJSON"><SrcDataSource>'
          vrtPartial += filePart
          vrtPartial += '</SrcDataSource></OGRVRTLayer>'

          fs.appendFileSync(task.files.rootVrtFile, vrtPartial)

          if (completed === pageLen) {
            // close the VRT
            fs.appendFileSync(task.files.rootVrtFile, '</OGRVRTDataSource>')

            var params = {
              inFile: task.files.rootVrtFile,
              outFile: task.files.rootNewFile,
              paths: task.files,
              format: task.format
            }

            try {
              var geojson = JSON.parse(fs.readFileSync(path.dirname(params.inFile) + 'part1.json'))
              job.data.options.large = true
              koopLib.Exporter.callOgr(params, geojson, job.data.options, function (err, formatFile) {
                if (err) return done(err)

                delete info.status
                delete info.generating
                delete info.export_lock

                finishExport(
                  task.format,
                  task.options.key,
                  task.options,
                  { paths: task.files, file: formatFile },
                  function () {
                    koopLib.Cache.updateInfo(task.table, info, function (err, res) {
                      if (err) return done(err)
                      done()
                      cb()
                    })
                  }
                )
              })
            } catch (e) {
              console.log('error calling org', e)
              info.generating = { error: e }

              koopLib.Cache.updateInfo(task.table, info, function (err, res) {
                if (err) return done(err)
                done('failed to generate file ' + e)
                workerQ.kill()
                cb()
              })
            }
          } else {
            cb()
          }
        })
      })
    })
  }, 4)

  job.data.pages.forEach(function (page, i) {
    var task = {
      options: job.data.options,
      file: page.file,
      offset: page.offset,
      dbkey: job.data.dbkey,
      table: job.data.table,
      format: job.data.format,
      ogrFormat: job.data.ogrFormat,
      files: job.data.files
    }

    workerQ.push(task, function (err) { if (err) console.log(err) })
  })
}

// This method is duplicate method from whats in the BaseModel.
// since workers are removed from koop providers we dont have access to
// these methods in the workers.
// This function finishes the export by cleaning up after it self and uploading to s3
function finishExport (format, key, options, result, callback) {
  function _sendFile (err, result) {
    if (err) return callback(err)

    if (koopLib.files.s3) {
      try {
        // try to clean up local FS
        fs.unlinkSync(result.paths.rootJsonFile)
      } catch (e) {
        koopLib.log.debug('Trying to remove non-existant file: %s', result.paths.rootJsonFile)
      }
      koopLib.files.exists(result.paths.path + '/' + key, result.paths.newFile, function (exists, path) {
        if (!exists) return callback('File did not get created.', null)
        callback(null, path)
      })
    } else {
      if (err) return callback(err, null)
      callback(null, result.file)
    }
  }

  if (koopLib.files.s3) {
    try {
      var stream = fs.createReadStream(result.file)

      koopLib.files.write(result.paths.path + '/' + key, result.paths.newFile, stream, function (err) {
        if (err) return callback(err)

        if (!options.isFiltered) {
          koopLib.files.write(result.paths.latestPath, result.paths.newFile, fs.createReadStream(result.file), function (err) {
            if (err) return callback(err)

            try {
              fs.unlinkSync(result.paths.rootNewFile)
            } catch (e) {
              koopLib.log.debug('Trying to remove non-existant file: ' + result.paths.rootNewFile)
            }
          })
        }

        _sendFile(null, result)
      })
    } catch (e) {
      console.log('Error while saving to s3', e, result.file)
      _sendFile(null, result)
    }
  } else {
    _sendFile(null, result)
  }
}
