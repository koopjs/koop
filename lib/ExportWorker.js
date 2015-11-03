var kue = require('kue')
var fs = require('node-fs')
var async = require('async')
var koop = require('./')
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
koop.config = config
koop.log = new koop.Logger(config)
var cache = new koop.DataCache(koop)
var files = new koop.Files(koop)
if (files.s3) {
  koop.log.info('S3 file system initialized in bucket: ' + files.s3Bucket)
} else {
  koop.log.warn('S3 file system is not configured')
}

// registers a DB modules
cache.db = pgcache.connect(config.db.conn, koop)

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
  koop.log.info('starting export job', job.id)

  var domain = require('domain').create()
  // All runtime errors will be funnelled through this function.
  // That's why we throw errors instead of calling the callback
  domain.on('error', function (err) {
    handleError(job.data.table, job.data.key, err)
    done(err)
  })

  domain.run(function () {
    // Jobs for removing files from the local FS
    if (job.data.remove) return remove(job, done)
    cache.getCount(job.data.table, job.data.options, function (err, count) {
      if (err) throw err
      // if we can handle the data in one page
      if (count <= job.data.options.limit) {
        singlePage(job, done)
      // if we already have a VRT on disk
      } else if (fs.existsSync(job.data.paths.rootVrtFile) && !job.data.options.ignore_cache) {
        createFromVRT(job, done)
      // we need to start from scratch
      } else {
        multiPage(job, count, done)
      }
    })
  })
})

/**
 * Handles errors thrown by any of the jobs or sub jobs
 *
 * @param {string} table - the db table name
 * @param {string} key - hash representing filters applied to the data
 * @param {object} error - the error thrown by the job
 */
function handleError (table, key, error) {
  cache.getInfo(table, function (err, info) {
    if (err) koop.log.error(err)
    info.generating[key].error = {message: error.message}
    cache.updateInfo(table, info, function (err) {
      if (err) koop.log.error(err)
    })
  })
}

/**
 * Sub-job to remove files from the local dir
 *
 * @param {object} job - contains information about how to complete the job
 * @param {function} done - a callback for when the job is completed
 * @private
 */
function remove (job, done) {
  // remove
  // simply blow away the local dir for the given data set
  var dir = path.join(files.localDir, 'files', (job.data.itemId + '_' + job.data.layerId))

  rimraf(dir, function (err) {
    if (err) throw err
    return done()
  })
}

/**
 * Sub-job to create from a single db page
 *
 * @param {object} job - contains information about how to complete the job
 * @param {function} done - a callback for when the job is completed
 * @private
 */
function singlePage (job, done) {
  var format = job.data.format
  var key = job.data.key
  var options = job.data.options

  cache.db.select(job.data.dbKey, options, function (err, geojson) {
    if (err) throw err
    koop.Exporter.exportToFormat(format, job.data.dir, key, geojson[0], options, function (err, result) {
      if (err) throw err
      done()
      // just send over the pageLength in the third parameter
      // this API is wonky so we just calc the progess on our own
      job.progress(null, null, 1)
      saveFile(job.data.table, format, key, options, result)
    })
  })
}

/**
 * Sub-job to create an exported file from multiple pages
 * First it will request pages of json and save them to disk while building a vrt layer
 * then it will call OGR2OGR using the VRT layer as input
 *
 * @param {object} job - contains information about how to complete the job
 * @param {integer} count - the number of pages
 * @param {function} done - a callback for when the job is completed
 * @private
 */
function multiPage (job, count, done) {
  fs.mkdir(job.data.paths.base, '0777', true, function () {
    var pages = Math.ceil(count / job.data.options.limit)

    for (var i = 0; i < pages; i++) {
      var offset = (i * (job.data.options.limit)) + 1
      var chunk = { file: job.data.paths.base + '/part.' + i + '.json', offset: offset }
      job.data.pages.push(chunk)
    }

    createFiles(job, done)
  })
}

/**
 * Sub-job to create an exported file from multiple pages
 * First it will request pages of json and save them to disk while building a vrt layer
 * then it will call OGR2OGR using the VRT layer as input
 *
 * @param {object} job - contains information about how to complete the job
 * @param {function} done - a callback for when the job is completed
 * @private
 */
function createFromVRT (job, done) {
  // else if we already have a VRT
  // since we have a VRT file locally
  // we just want to create the export and complete the job
  var params = {
    inFile: job.data.paths.rootVrtFile,
    outFile: job.data.paths.rootNewFile,
    paths: job.data.paths,
    format: job.data.format
  }

  var options = job.data.options
  options.large = true
  options.db = cache.db
  options.logger = koop.log
  var fileLoc = path.join(path.dirname(params.inFile), 'part.0.json')
  var geojson = JSON.parse(fs.readFileSync(fileLoc))

  try {
    koop.Exporter.callOgr(params, geojson, job.data.options, function (err, formatFile) {
      if (err) throw err
      var paths = { paths: job.data.paths, file: formatFile }
      done()
      saveFile(job.data.table, job.data.format, job.data.key, job.data.options, paths)
    })
  } catch (e) {
    koop.log.error('error calling OGR2OGR', e)
    throw e
  }
}

/**
 * Sub-job to page over the DB writing JSON to disk and building a VRT layer
 *
 * @param {object} job - contains information about how to complete the job
 * @param {function} done - a callback for when the job is completed
 * @private
 */
function createFiles (job, done) {
  var vrt = '<OGRVRTDataSource>'

  // create a new VRT File
  fs.appendFileSync(job.data.paths.rootVrtFile, vrt)

  job.data.pages.forEach(function (page, i) {
    var task = {
      options: job.data.options,
      file: page.file,
      offset: page.offset,
      dbKey: job.data.dbKey,
      table: job.data.table,
      format: job.data.format,
      ogrFormat: job.data.ogrFormat,
      files: job.data.paths,
      done: done,
      job: job
    }

    workerQ.push(task, function (err) {
      if (err) koop.log.error(err)
    })
  })
}

var workerQ = async.queue(function (task, cb) {
  var job = task.job
  var pageLen = job.data.pages.length
  var self = this
  workerQ.task = task
  self.completed = 0
  // make sure offset is in options for creating the idFilter below
  task.options.offset = task.offset

  var opts = {
    layer: task.options.layer,
    where: task.options.where,
    idFilter: koop.Exporter.createIdFilter(task.options),
    geometry: task.options.geometry,
    bypassProcessing: true
  }

  var filePart = task.file
  // TODO in koop-pgcache 2.0 this will be a geojson feature collection and not and array
  cache.db.select(task.dbKey, opts, function (err, entry) {
    if (err) throw err
    if (fs.existsSync(filePart)) fs.unlinkSync(filePart)

    fs.writeFile(filePart, JSON.stringify(entry[0]), function () {
      // TODO why build this here?
      // we could open a file handle and push each layer into the file via io
      var vrtPartial = '<OGRVRTLayer name="OGRGeoJSON"><SrcDataSource>'
      vrtPartial += filePart
      vrtPartial += '</SrcDataSource></OGRVRTLayer>'

      fs.appendFileSync(task.files.rootVrtFile, vrtPartial)
      // tick up the number of complete pages
      self.completed++
      job.progress(null, null, pageLen)
      cb()
    })
  })
}, 4)

workerQ.drain = function () {
  var task = this.task
  var done = task.done
  var job = task.job
  // close the VRT
  fs.appendFileSync(task.files.rootVrtFile, '</OGRVRTDataSource>')

  var params = {
    inFile: task.files.rootVrtFile,
    outFile: task.files.rootNewFile,
    paths: task.files,
    format: task.format
  }

  var fileLoc = path.join(path.dirname(params.inFile), 'part.0.json')
  var geojson = JSON.parse(fs.readFileSync(fileLoc))
  job.data.options.large = true

  try {
    koop.Exporter.callOgr(params, geojson, job.data.options, function (err, formatFile) {
      if (err) throw err
      var paths = {paths: task.files, file: formatFile}
      done()
      saveFile(task.table, task.format, job.data.key, task.options, paths)
    })
  } catch (e) {
    koop.log.error('error calling OGR2OGR', e)
    throw e
  }
}

/**
 * This function upload the export to s3
 *
 * @param {string} table - the table data was exported from
 * @param {string} format - the file format requested
 * @param {string} key - a hash representing all the options applied to the data
 * @param {object} options - options including filters applied to the data
 * @param {object} result - the file paths resulting from a successful export
 * @param {boolean} retried - whether or not this function is being retried
 * @private
 */
function saveFile (table, format, key, options, result, retried) {
  var stream = fs.createReadStream(result.file)
  var uploadPath = path.join(result.paths.path, key)
  var fileName = result.paths.newFile
  files.write(uploadPath, fileName, stream, function (err) {
    if (err) {
      // on the first failure retry tthis operation
      if (!retried) return saveFile(table, format, key, options, result, true)
      koop.log.error('Failed to write file to S3', err)
      handleError(table, key, new Error('Error while writing to S3'))
    }

    // only write the latest file if there has been no filters applied
    if (!options.filtered) {
      var copyOpts = {
        from: uploadPath,
        to: path.join(result.paths.latestPath),
        fileName: fileName
      }
      files.copy(copyOpts, function (err) {
        if (err) {
          koop.log.error('Error while writing Latest file to S3', err)
        }
      })
    }
  })
}
