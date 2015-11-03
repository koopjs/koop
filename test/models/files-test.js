/* global describe, it, after */

var should = require('should')
var koop = require('../../lib')
var Files = require('../../lib/Files')
var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')
var sinon = require('sinon')
var config = { logfile: __dirname + '/../test.log' }

// init the koop log based on config params
koop.log = new koop.Logger(config)
koop.config = config

describe('Files', function () {
  after(function (done) {
    rimraf(path.join(__dirname, 'output'), function () {
      done()
    })
  })
  describe('when initializing files', function () {
    it('local and S3 storage should be false when nothing is configured', function (done) {
      // init with an empty dir
      var files = new Files(koop)
      files.localDir.should.equal(false)
      files.s3Bucket.should.equal(false)
      done()
    })
    it('local storage should be configured when passing a local dir', function (done) {
      // init with a local dir
      var dir = __dirname + '/output'
      var files = new Files({ log: koop.log, config: { data_dir: dir } })
      files.localDir.should.equal(dir)
      files.s3Bucket.should.equal(false)
      done()
    })
    it('local storage and s3 should be configured when passing a local dir and a bucket', function (done) {
      // init with a local dir
      var dir = __dirname + '/output'
      var bucket = 'test-bucket'
      var files = new Files({ log: koop.log, config: { data_dir: dir, s3: { bucket: bucket } } })
      files.localDir.should.equal(dir)
      files.s3Bucket.should.equal(bucket)
      done()
    })
  })

  // -------------- EXISTS ---------------

  describe('when checking if a file exists', function () {
    it('with local storage a non-existant', function (done) {
      var dir = __dirname + '/output'
      var files = new Files({ log: koop.log, config: { data_dir: dir } })
      files.exists(null, 'dummy.png', function (exists) {
        exists.should.equal(false)
        done()
      })
    })
    it('with local storage and existing', function (done) {
      var dir = __dirname + '/../fixtures'
      var files = new Files({ log: koop.log, config: { data_dir: dir } })
      files.exists(null, 'repo.geojson', function (exists) {
        exists.should.equal(true)
        done()
      })
    })
    it('with s3 storage a non-existant', function (done) {
      var files = new Files({ log: koop.log, config: { s3: { bucket: 'chelm-koop-shoot-local' } } })
      files.exists(null, 'dummy.png', function (exists) {
        exists.should.equal(false)
        done()
      })
    })
  })

  // -------------- PATHS ---------------

  describe('when getting the path to a file', function () {
    it('should error with local storage and a non-existant file', function (done) {
      var dir = __dirname + '/output'
      var files = new Files({ log: koop.log, config: { data_dir: dir } })
      files.path(null, 'dummy.png', function (err, path) {
        should.exist(err)
        done()
      })
    })
    it('should return the path with local storage and an existing file', function (done) {
      var dir = __dirname + '/../fixtures'
      var files = new Files({ log: koop.log, config: { data_dir: dir } })
      files.path(null, 'repo.geojson', function (err, path) {
        should.not.exist(err)
        should.exist(path)
        done()
      })
    })
    it('should error with s3 storage and a non-existant file', function (done) {
      var files = new Files({ log: koop.log, config: { s3: { bucket: 'chelm-koop-shoot-local' } } })
      files.path(null, 'dummy.png', function (err, path) {
        should.exist(err)
        should.not.exist(path)
        done()
      })
    })
  })

  // -------------- READS ---------------

  describe('when reading a file', function () {
    it('with local storage', function (done) {
      var dir = __dirname + '/../fixtures'
      var files = new Files({ log: koop.log, config: { data_dir: dir } })
      files.read(null, 'repo.geojson', function (err, data) {
        should.not.exist(err)
        should.exist(data)
        done()
      })
    })
  })

  // -------------- WRITES ---------------

  describe('when writing a file', function () {
    it('with local storage', function (done) {
      var dir = __dirname + '/output'
      var name = 'test.json'
      var files = new Files({ log: koop.log, config: { data_dir: dir } })
      files.write(null, name, JSON.stringify({'say': 'yes'}), function (err, success) {
        should.not.exist(err)
        files.exists(null, name, function (exists) {
          exists.should.equal(true)
          done()
        })
      })
    })

    it('with local storage and a subdir', function (done) {
      var dir = __dirname + '/output'
      var name = 'test.json'
      var subdir = 'testfiles'

      var files = new Files({ log: koop.log, config: { data_dir: dir } })
      files.write(subdir, name, JSON.stringify({'say': 'yes'}), function (err, success) {
        should.not.exist(err)
        files.exists(subdir, name, function (exists) {
          exists.should.equal(true)
          done()
        })
      })
    })
  })

  // -------------- COPIES ----------------

  describe('when copying a file', function () {
    describe('with local storage', function () {
      it('should copy the file correctly', function (done) {
        fs.writeFileSync(__dirname + '/output/testfiles/testCopy.json', '')
        var options = {
          from: 'testfiles',
          to: 'testfiles/copy',
          fileName: 'testCopy.json'
        }
        var files = new Files({ log: koop.log, config: { data_dir: __dirname + '/output' } })
        files.copy(options, function (err) {
          should.not.exist(err)
          console.log(__dirname, 'output', options.to, options.fileName)
          var copiedPath = path.join(__dirname, 'output', options.to, options.fileName)
          fs.stat(copiedPath, function (err) {
            should.not.exist(err)
            done()
          })
        })
      })
    })

    describe('with S3 stroage', function () {
      it('should copy the file correctly', function (done) {
        var files = new Files({ log: koop.log, config: { s3: { bucket: 'chelm-koop-shoot-local' } } })
        sinon.stub(files.s3, 'createBucket', function (options, callback) {
          callback(null)
        })

        sinon.stub(files.s3, 'copyObject', function (options, callback) {
          callback(null)
        })

        var options = {
          from: 'copyFrom',
          to: 'copyTo',
          fileName: 'fileName'
        }
        files.copy(options, function (err, params) {
          should.not.exist(err)
          params.Bucket.should.equal('chelm-koop-shoot-local/copyTo')
          params.Key.should.equal('fileName')
          params.ACL.should.equal('public-read')
          params.CopySource.should.equal('chelm-koop-shoot-local/copyFrom/fileName')
          files.s3.copyObject.restore()
          files.s3.createBucket.restore()
          done()
        })
      })
    })
  })
  // -------------- REMOVES ---------------
  describe('when removing a file', function () {
    it('with local storage', function (done) {
      var dir = __dirname + '/output'
      var name = 'test2.json'
      var files = new Files({ log: koop.log, config: { data_dir: dir } })
      files.write(null, name, JSON.stringify({'say': 'yes'}), function (err, success) {
        should.not.exist(err)
        files.remove(null, name, function (err, success) {
          should.not.exist(err)
          files.exists(null, name, function (exists) {
            exists.should.equal(false)
            done()
          })
        })
      })
    })
  })
})
