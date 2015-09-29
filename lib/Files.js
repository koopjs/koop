var AWS = require('aws-sdk')
var fs = require('fs')
var child = require('child_process')
var mkdirp = require('mkdirp')

/**
 * constructor for interacting with s3 or local disk storage
 *
 * @param {object} options - log (koop.Logger instance), config (koop config)
 */
var Files = function (options) {
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
   * writes a file to either s3 or local fs
   *
   * @param  {string}   subdir - s3 bucket or local fs subdirectory
   * @param  {string}   name - s3 file key or local file name
   * @param  {string}   data - file data
   * @param  {function} callback - error
   */
  this.write = function (subdir, name, data, callback) {
    var self = this
    if (this.s3) {
      var bucket = [this.s3Bucket, subdir].join('/')
      this.s3.createBucket({ Bucket: bucket }, function () {
        self.s3.putObject({Bucket: bucket, Key: name, Body: data, ACL: 'public-read'}, function (err) {
          log.info('Uploaded file to s3 %s %s', bucket, name)
          callback(err)
        })
      })
    } else if (this.localDir) {
      var dir = [this.localDir, subdir].join('/')
      mkdirp(dir, function () {
        fs.writeFile([dir, name].join('/'), data, callback)
      })
    } else {
      callback('No filesystem configured', null)
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
        data.Contents.forEach(function (obj) {
          var objKey = obj.Key.split('/')
          if (objKey.splice(0, len).join('/') === dir) {
            self.s3.deleteObject({Bucket: self.s3Bucket, Key: obj.Key}, function () {
              log.debug('Delete %s %s', dir, obj.Key)
            })
          }
        })
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
