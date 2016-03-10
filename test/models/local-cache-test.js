/* global describe, it, beforeEach, afterEach */

var should = require('should')
var LocalDB = require('../../src/lib/Local')
var repoData = require('../fixtures/repo.geojson')
var insertKey = 'test:repo:file'
var key = 'test:repo:file:0'

repoData[0].info = { name: 'somename' }

describe('Local Cache Tests', function () {
  describe('when requesting bogus data', function () {
    it('should error when missing key is sent', function (done) {
      LocalDB.select(key + '-fake', {}, function (err, data) {
        should.exist(err)
        done()
      })
    })
  })

  describe('when caching geojson', function () {
    beforeEach(function (done) {
      LocalDB.insert(insertKey, repoData[0], 0, function (err, success) {
        should.not.exist(err)
        done()
      })
    })

    afterEach(function (done) {
      LocalDB.remove(key, done)
    })

    it('should remove the data', function (done) {
      LocalDB.remove(key, function (err, d) {
        should.not.exist(err)
        LocalDB.select(key, {}, function (err, result) {
          should.exist(err)
          done()
        })
      })
    })

    it('should get the name', function (done) {
      LocalDB.select(key, {}, function (err, d) {
        should.not.exist(err)
        should.exist(d[0].name)
        d[0].name.should.equal('forks.geojson')
        done()
      })
    })

    it('should get count', function (done) {
      LocalDB.getCount(key, {}, function (err, count) {
        should.not.exist(err)
        should.exist(count)
        count.should.equal(417)
        done()
      })
    })

    it('should get info', function (done) {
      LocalDB.getInfo(key, function (err, info) {
        should.not.exist(err)
        should.exist(info)
        done()
      })
    })

    it('should update info', function (done) {
      LocalDB.updateInfo(key, {'name': 'newname'}, function (err, success) {
        should.not.exist(err)
        LocalDB.getInfo(key, function (err, info) {
          should.not.exist(err)
          should.exist(info)
          info.name.should.equal('newname')
          done()
        })
      })
    })
  })

  describe('when setting/getting timers', function () {
    var table = 'timer'
    var len = 10000

    it('should return false when no timer exists', function (done) {
      LocalDB.timerGet(table, function (err, timer) {
        should.not.exist(err)
        timer.should.equal(false)
        done()
      })
    })

    it('should return the timer when a timer is set', function (done) {
      LocalDB.timerSet(table, len, function (err, timer) {
        should.not.exist(err)
        should.exist(timer)
        LocalDB.timerGet(table, function (err, timer) {
          should.not.exist(err)
          should.exist(timer)
          done()
        })
      })
    })

    it('should return false when a timer expires', function (done) {
      LocalDB.timerSet(table, 100, function () {
        setTimeout(function () {
          LocalDB.timerGet(table, function (err, timer) {
            should.not.exist(err)
            timer.should.equal(false)
            done()
          })
        }, 150)
      })
    })
  })
})
