var AWS = require('aws-sdk')
var fs = require('fs')
var child = require('child_process')
var mkdirp = require('mkdirp')

var Files = function (options) {
  var log = options.log
  var config = options.config || {}

  this.localDir = config.data_dir || false
  this.s3Bucket = (config.s3) ? config.s3.bucket : false

  if (this.s3Bucket) this.s3 = new AWS.S3()

  // returns the path to the file locally or on s3
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

  // returns a boolean whether the file exists on s3 or local storage
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

  // reads a file to either s3 or local fs
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

  // writes a file to either s3 or local fs
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

  // removes a file to either s3 or local fs
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

  this.removeBucket = function (params, callback) {
    this.s3.deleteBucket(params, callback)
  }

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
