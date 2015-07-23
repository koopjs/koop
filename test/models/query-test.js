/* global describe, it */

var should = require('should')
var Query = require('../../lib').Query
var snowData1 = require('../fixtures/snow.geojson')
var snowData2 = require('../fixtures/snow2.geojson')
var snowData3 = require('../fixtures/snow3.geojson')

describe('Query Model', function () {
  describe('when returning count only', function () {
    it('should return the count', function (done) {
      Query.filter(snowData1, { returnCountOnly: true }, function (err, service) {
        should.not.exist(err)
        should.exist(service)
        service.should.be.an.instanceOf(Object)
        service.count.should.equal(snowData1.features.length)
        done()
      })
    })
  })

  describe('when returning ids only', function () {
    it('should return an array of object ids', function (done) {
      Query.filter(snowData1, { returnIdsOnly: true, idField: 'station' }, function (err, service) {
        should.not.exist(err)
        should.exist(service)
        service.should.be.an.instanceOf(Object)
        service.objectIds.should.be.an.instanceOf(Array)
        service.objectIdField.should.equal('station')
        service.objectIds.length.should.equal(snowData1.features.length)
        done()
      })
    })
  })

  describe('when not returning geometrys', function () {
    it('should return an array of features with no geometries', function (done) {
      Query.filter(snowData1, { returnGeometry: false }, function (err, service) {
        should.not.exist(err)
        should.exist(service)
        service.should.be.an.instanceOf(Object)
        service.features[0].should.not.have.property('geometry')
        done()
      })
    })
  })

  describe('when not returning geometrys', function () {
    it('should return an array of features with no geometries', function (done) {
      Query.filter(snowData1, { returnGeometry: false }, function (err, service) {
        should.not.exist(err)
        should.exist(service)
        service.should.be.an.instanceOf(Object)
        service.features[0].should.not.have.property('geometry')
        done()
      })
    })
  })

  describe('when filtering outFields', function () {
    it('should return features with only given outFields', function (done) {
      Query.filter(snowData1, { outFields: 'station' }, function (err, service) {
        should.not.exist(err)
        should.exist(service)
        service.should.be.an.instanceOf(Object)
        service.features[0].properties.should.have.property('station')
        service.features[0].properties.should.not.have.property('latitude')
        done()
      })
    })
  })

  describe('when filtering via where', function () {
    it('should return features that match where clause', function (done) {
      Query.filter(snowData1, { where: '1=1' }, function (err, service) {
        should.not.exist(err)
        should.exist(service)
        service.should.be.an.instanceOf(Object)
        service.features.length.should.equal(snowData1.features.length)
        done()
      })
    })

    it('should return features that match where clause', function (done) {
      Query.filter(snowData1, { where: 'latitude > 39.9', outFields: '*' }, function (err, service) {
        should.not.exist(err)
        should.exist(service)
        service.should.be.an.instanceOf(Object)
        service.features.length.should.equal(snowData1.features.length)
        done()
      })
    })
  })

  describe('when requesting data with outStatistics', function () {
    it('should return an error when outStatistics params fails', function (done) {
      Query.filter(snowData1, { outStatistics: 'xx11xx' }, function (err, service) {
        should.exist(err)
        err.should.not.equal(null)
        should.not.exist(service)
        done()
      })
    })

    it('should return json when outStatistics params is proper', function (done) {
      Query.outStatistics(snowData2[0], { outStatistics: '[{"statisticType":"min","onStatisticField":"total precip","outStatisticFieldName":"min_precip"}]' }, function (err, service) {
        should.not.exist(err)
        should.exist(service)
        service.fields.should.be.an.instanceOf(Array)
        service.features.should.be.an.instanceOf(Array)
        done()
      })
    })
  })

  describe('when grouping stats', function () {
    it('should return json when grouping stats by a field', function (done) {
      Query.outStatistics(snowData3[0], { groupByFieldsForStatistics: 'total precip', outStatistics: '[{"statisticType":"count","onStatisticField":"total precip","outStatisticFieldName":"total_precip_COUNT"}]' }, function (err, service) {
        should.not.exist(err)
        should.exist(service)
        service.fields.should.be.an.instanceOf(Array)
        service.features.should.be.an.instanceOf(Array)
        done()
      })
    })
  })

})
