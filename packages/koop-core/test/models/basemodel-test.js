/* globals describe, it */

var should = require('should')
var koop = require('../../lib/')

// var esri_json = require('../fixtures/ski.geojson')
var model = require('../../lib/BaseModel.js')(koop)

describe('Base Model', function () {
  describe('when parsing a spatial reference', function () {
    it('should return the correct wkid from json', function (done) {
      var sr = model.parseSpatialReference({wkid: 4326})
      should.exist(sr)
      sr.wkid.should.equal(4326)
      done()
    })

    it('should return the correct wkid from json string', function (done) {
      var sr = model.parseSpatialReference('{"wkid": 4326}')
      sr.wkid.should.equal(4326)
      done()
    })

    it('should return the wkid from a numerica value', function (done) {
      var sr = model.parseSpatialReference(4326)
      sr.wkid.should.equal(4326)
      done()
    })
  })

})
