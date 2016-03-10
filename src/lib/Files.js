'use strict'
const AWS = require('aws-sdk')
const fs = require('fs-extra')
const child = require('child_process')
const mkdirp = require('mkdirp')
const path = require('path')
const request = require('request')
const _ = require('highland')
const zlib = require('zlib')
const gunzip = require('gunzip-maybe')

/**
 * constructor for interacting with s3 or local disk storage
 *
 * @param {object} options - log (koop.Logger instance), config (koop config)
 */
const Files = function (options) {
  // catch omission of `new` keyword
  if (!(this instanceof Files)) {
    return new Files(options)
  }

  /** @type {koop.Logger} logger instance */
  var log = options.log

  /** @type {object} koop configuration */
  var config = options.config || {}

  /** @type {string} local data directory */
  this.localDir = config.data_dir || false

  /** @type {string} s3 bucket name */
  this.s3Bucket = (config.s3) ? config.s3.bucket : false

  /** @type {AWS.S3} s3 connection instance */
  this.s3 = this.s3Bucket ? new AWS.S3() : false

  /**
   * returns the path to the file locally or on s3
   *
   * @param  {string}   subdir - s3 bucket or local fs subdirectory
   * @param  {string}   name - s3 file key or local file name
   * @param  {function} callback - error, path string
   */
  this.path = function (subdir, name, callback) {
    var self = this
    if (this.s3) {
      var params = {
        Bucket: [this.s3Bucket, subdir].join('/'),
        Key: name
      }
      this.s3.getObjectAcl(params, function (err) {
        if (err) {
          callback(err.message, null)
        } else {
          self.s3.getSignedUrl('getObject', params, function (err, url) {
            callback(err, url.split('?')[0])
          })
        }
      })
    } else if (this.localDir) {
      var dir = [this.localDir, subdir, name].join('/')
      fs.exists(dir, function (exists) {
        if (exists) {
          callback(null, dir)
        } else {
          callback('File not found on local filesystem', null)
        }
      })
    } else {
      callback('No filesystem configured', null)
    }
  }

  /**
   * returns a boolean if the file exists on s3 or local storage
   * TODO: dedup identical logic from Files.path
   * TODO: callback signature is very wrong on this one
   *
   * @param  {string}   subdir - s3 bucket or local fs subdirectory
   * @param  {string}   name - s3 file key or local file name
   * @param  {function} callback - A BOOLEAN?, path string
   */
  this.exists = function (subdir, name, callback) {
    var self = this
    if (this.s3) {
      var params = {
        Bucket: [this.s3Bucket, subdir].join('/'),
        Key: name
      }
      this.s3.getObjectAcl(params, function (err) {
        if (err) {
          log.info('File does not exist on S3 %s %s', self.s3Bucket, subdir, name)
          callback(false)
        } else {
          self.s3.headObject(params, function (err, info) {
            if (err) return callback(err)
            self.s3.getSignedUrl('getObject', params, function (err, url, data) {
              if (err) return callback(err)
              log.info('File exists on S3 %s %s', self.s3Bucket, name)
              callback(true, url.split('?')[0], info)
            })
          })
        }
      })
    } else if (this.localDir) {
      var path = [this.localDir, subdir, name].join('/')
      fs.exists(path, function (exists) {
        if (exists) {
          callback(true, path)
        } else {
          callback(false)
        }
      })
    } else {
      callback(false, 'No filesystem configured')
    }
  }

  /**
   * reads a file to either s3 or local fs
   * TODO: clean up callback signature
   *
   * @param  {string}   subdir - s3 bucket or local fs subdirectory
   * @param  {string}   name - s3 file key or local file name
   * @param  {function} callback - error, data (string)
   */
  this.read = function (subdir, name, callback) {
    if (this.s3) {
      var params = {
        Bucket: [this.s3Bucket, subdir].join('/'),
        Key: name
      }
      this.s3.getObject(params, callback)
    } else if (this.localDir) {
      fs.readFile([this.localDir, subdir, name].join('/'), function (err, data) {
        if (err) return callback(err)
        callback(null, data.toString())
      })
    } else {
      callback('No filesystem configured', null)
    }
  }

	/**
	 * Creates a readable stream from local disk or S3
	 *
	 * @param {string} file - the file to read
	 * @return {object} a readable stream
	 */
  this.createReadStream = function (file) {
    if (this.s3) return this._createS3ReadStream(file)
    return fs.createReadStream(path.join(this.localDir, file))
  }

	/**
	 * Creates a readable stream from a file stored on S3
	 *
	 * @param {string} file - the file to read off S3
	 * @return {object} a readable stream
	 * @private
	 */
  this._createS3ReadStream = function (file) {
    var dir = path.dirname(file)
    var fileName = path.basename(file)
    var params = {
      Bucket: path.join(this.s3Bucket, dir),
      Key: fileName
    }
    var url = this.s3.getSignedUrl('getObject', params)
    var output = _()
    request(url)
    .on('error', function (e) { output.emit('error', e) })
    .pipe(gunzip())
    .on('error', function (e) { output.emit('error', e) })
    .pipe(output)
    return output
  }

	/**
	 * Creates a writeable stream that is saved locally or on S3
	 *
	 * @param {string} name - the name of the file to write to
	 * @return {object} a writeable stream
	 */
  this.createWriteStream = function (name) {
    if (this.s3) return this._createS3WriteStream(name)
    var filePath = path.join(this.localDir, name)
    mkdirp.sync(path.dirname(filePath))
    const input = _()
    input.abort = () => fs.unlink(filePath)
    input.pipe(fs.createWriteStream(filePath))
    return input
  }

	/**
	 * Creates a writeable stream that goes to S3
	 *
	 * @param {string} name - the name of file to write to
	 * @return {object} a writeable stream
	 * @private
	 */
  this._createS3WriteStream = function (name) {
    const input = _()
    const params = s3Params(this.s3Bucket, name)
    let upload
    params.Body = input.pipe(zlib.createGzip())
    this.s3.createBucket({Bucket: params.Bucket}, err => {
      if (err) return input.emit('error', err)
      upload = this.s3.upload(params, (err, data) => {
        if (err) return input.emit('error', err)
        input.emit('finish')
        input.destroy()
      })
    })
    input.abort = upload.abort
    return input
  }

	/**
	 * Create paramters to upload to S3
	 *
	 * @param {string} bucket - the S3 bucket
	 * @param {string} name the filename to write to
	 * @private
	 */
  function s3Params (bucket, name) {
    var dir = path.dirname(name)
    var fileName = path.basename(name)
    return {
      Bucket: path.join(bucket, dir),
      Key: fileName,
      ACL: 'public-read'
    }
  }

  /**
   * writes a file to either s3 or local fs
   *
   * @param  {string}   subdir - s3 bucket or local fs subdirectory
   * @param  {string}   name - s3 file key or local file name
   * @param  {string}   data - file data
   * @param  {function} callback - error
   */
  this.write = function (subdir, fileName, data, callback) {
    var self = this
    if (!self.s3 && !self.localDir) return callback(new Error('No filesytem configured'))
    if (self.s3) {
      var bucket = [self.s3Bucket, subdir].join('/')
      self.s3.createBucket({ Bucket: bucket }, function () {
        var params = {
          Bucket: bucket,
          Key: fileName,
          ACL: 'public-read'
        }
        var s3Obj = self._createS3Obj(params)
        s3Obj.upload({Body: data}, function (err, data) {
          if (err) return callback(err)
          log.info('Uploaded file to s3 %s %s', bucket, fileName)
          callback(null, params)
        })
      })
    } else {
      var dir = [self.localDir, subdir].join('/')
      mkdirp(dir, function () {
        fs.writeFile([dir, fileName].join('/'), data, callback)
      })
    }
  }

  /**
   * Wraps the creation of a new S3 Object
   *
   * @param {object} params - options for creating the object
   * @return {object} a new S3 object
   */
  this._createS3Obj = function (params) {
    return new AWS.S3({params: params})
  }

  /**
   * Copies a file from one directory to another on S3 or the local filesystem
   *
   * @param {object} options - Contains filename, from directory, to directory and other configurations
   * @param {function} callback - calls back with an error or nothing
   */
  this.copy = function (options, callback) {
    var self = this
    if (!self.s3 && !self.localDir) return callback(new Error('No filesytem configured'))
    if (self.s3) {
      var bucket = [self.s3Bucket, options.to].join('/')
      self.s3.createBucket({Bucket: bucket}, function () {
        var params = {
          Bucket: bucket,
          Key: options.fileName,
          ACL: 'public-read',
          CopySource: [self.s3Bucket, options.from, options.fileName].join('/')
        }
        self.s3.copyObject(params, function (err) {
          if (err) return callback(err)
          log.info('Copied file to s3 %s %s', bucket, options.fileName)
          callback(null, params)
        })
      })
    } else {
      var dir = [self.localDir, options.to].join('/')
      mkdirp(dir, function () {
        var fromFile = path.join(self.localDir, options.from, options.fileName)
        var toFile = path.join(self.localDir, options.to, options.fileName)
        fs.copy(fromFile, toFile, {replace: options.replace || false}, function (err) {
          callback(err)
        })
      })
    }
  }

  /**
   * removes a file from either s3 or local fs
   *
   * @param  {string}   subdir - s3 bucket or local fs subdirectory
   * @param  {string}   name - s3 file key or local file name
   * @param  {function} callback - error
   */
  this.remove = function (subdir, name, callback) {
    var self = this
    if (this.s3) {
      var params = {
        Bucket: [this.s3Bucket, subdir].join('/'),
        Key: name
      }
      this.s3.deleteObject(params, function (err) {
        log.info('Removed file from s3 %s %s', self.s3Bucket, name)
        callback(err)
      })
    } else if (this.localDir) {
      fs.unlink([this.localDir, subdir, name].join('/'), callback)
    } else {
      callback('No filesystem configured', null)
    }
  }

  /**
   * remove a directory from s3 or local fs
   *
   * @param  {string}   dir - any directory path
   * @param  {Function} callback - error
   */
  this.removeDir = function (dir, callback) {
    var self = this
    if (this.s3) {
      var params = {
        Bucket: [this.s3Bucket, dir].join('/')
      }
      // get the length dirs to match
      var len = dir.split('/').length

      this.s3.listObjects({Bucket: this.s3Bucket, Marker: dir}, function (err, data) {
        if (err) return callback(err)
        if (data && data.Contents) {
          data.Contents.forEach(function (obj) {
            var objKey = obj.Key.split('/')
            if (objKey.splice(0, len).join('/') === dir) {
              self.s3.deleteObject({Bucket: self.s3Bucket, Key: obj.Key}, function () {
                log.debug('Delete %s %s', dir, obj.Key)
              })
            }
          })
        }
        self.removeBucket(params, function (err) {
          log.info('Removed Bucket from s3 %s %s', dir)
          if (self.localDir) {
            self.removeLocalDir(dir, callback)
          } else {
            callback(err)
          }
        })
      })
    } else {
      this.removeLocalDir(dir, callback)
    }
  }

  /**
   * remove a bucket from s3
   *
   * @param  {object}   params - options for s3.deleteBucket method
   * @param  {Function} callback - error
   */
  this.removeBucket = function (params, callback) {
    this.s3.deleteBucket(params, callback)
  }

  /**
   * remove a local directory
   *
   * @param  {string}   dir - any directory path
   * @param  {Function} callback - error
   */
  this.removeLocalDir = function (dir, callback) {
    var rootDir = [[this.localDir, dir].join('/')]
    var args = rootDir
    args.unshift('-rf')
    child.execFile('rm', args, { env: process.env }, function () {
      callback.apply(this, arguments)
    })
  }

  return this
}

module.exports = Files
