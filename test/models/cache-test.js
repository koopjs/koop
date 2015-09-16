/* globals describe, afterEach, it */

var should = require('should')
var repoData = require('../fixtures/repo.geojson')
var CacheHelper = require('../helpers/Cache')
var Cache = CacheHelper.cache
var key = 'test:repo:file'

describe('Cache Model Tests', function () {
  describe('when caching a github file', function () {
    afterEach(function (done) {
      Cache.remove('repo', key, {layer: 0}, done)
    })

    it('should error when missing key is sent', function (done) {
      Cache.get('repo', key + '-BS', {}, function (err, data) {
        should.exist(err)
        done()
      })
    })

    it('should insert and remove the data', function (done) {
      Cache.insert('repo', key, repoData[0], 0, function (error, success) {
        should.not.exist(error)
        success.should.equal(true)
        done()
      })
    })

    it('should insert and get the sha', function (done) {
      Cache.insert('repo', key, repoData[0], 0, function (error, success) {
        should.not.exist(error)
        success.should.equal(true)
        Cache.get('repo', key, { layer: 0 }, function (err, d) {
          should.not.exist(err)
          should.exist(d[0].name)
          d[0].name.should.equal('forks.geojson')
          done()
        })
      })
    })
  })

  describe('converting geoservices to sql parts', function () {
    it('should correctly parse orderByFields', function (done) {
      var query = {orderByFields: 'water DESC, trees ASC'}
      var test = Cache.decodeGeoservices(query)
      test.order_by.length.should.equal(2)
      Object.keys(test.order_by[0])[0].should.equal('water')
      Object.keys(test.order_by[1])[0].should.equal('trees')
      test.order_by[0].water.should.equal('DESC')
      console.log(test.order_by)
      test.order_by[1].trees.should.equal('ASC')
      done()
    })
  })
})
