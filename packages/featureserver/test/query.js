/* global describe, it */
const FeatureServer = require('../src/FeatureServer.js')
const should = require('should')
var data = require('./fixtures/snow.json')
var polyData = require('./fixtures/polygon.json')

describe('Query operatons', function () {
  describe('when getting featureserver features from geojson', function () {
    it('should return a valid features', (done) => {
      const response = FeatureServer.query(data, {})
      // console.log(response)
      response.should.be.an.instanceOf(Object)
      response.fields.should.be.an.instanceOf(Array)
      response.features.should.be.an.instanceOf(Array)
      response.features.forEach(function (feature) {
        feature.should.have.property('geometry')
        feature.should.have.property('attributes')
      })
      done()
    })
  })

  describe('when getting featureserver features by id queries', function () {
    it('should return a proper features', (done) => {
      const response = FeatureServer.query(data, { objectIds: '1,2,3' })
      response.should.be.an.instanceOf(Object)
      response.fields.should.be.an.instanceOf(Array)
      response.features.should.have.length(3)
      done()
    })

    it('should return only count of features', (done) => {
      const response = FeatureServer.query(data, { returnCountOnly: true, objectIds: '1,2,3' })
      response.should.be.an.instanceOf(Object)
      response.should.have.property('count')
      response.count.should.equal(3)
      done()
    })
  })

  describe('when getting features with returnIdsOnly', function () {
    it('should return only ids of features', (done) => {
      const response = FeatureServer.query(data, { returnIdsOnly: true, objectIds: '1,2,3' })
      response.should.be.an.instanceOf(Object)
      response.should.have.property('objectIds')
      response.objectIds.length.should.equal(3)
      done()
    })
  })

  describe('when filtering features with a geometry', function () {
    it('should return geometries that are contained', (done) => {
      const response = FeatureServer.query(data, {
        geometry: {xmin: -110, ymin: 30, xmax: -106, ymax: 50},
        geometryType: 'esriGeometryEnvelope'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(100)
      done()
    })
  })

  describe('when filtering features with a geometry and outSR', function () {
    it('should return geometries that are contained', (done) => {
      const response = FeatureServer.query(data, {
        geometry: {xmin: -110, ymin: 30, xmax: -106, ymax: 50, spatialReference: { wkid: 4326 }},
        geometryType: 'esriGeometryEnvelope'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(100)
      done()
    })
  })

  describe('when filtering features with a geometry and outSR', function () {
    it('should return geometries that are contained', (done) => {
      const response = FeatureServer.query(data, {
        geometry: {xmin: -110, ymin: 30, xmax: -106, ymax: 50, spatialReference: { wkid: 4326 }},
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelContains'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(100)
      done()
    })
  })

  describe('when filtering polygon features with a geometry', function () {
    it('should return geometries that are contained by given bounds', (done) => {
      const response = FeatureServer.query(polyData, {
        geometry: {xmin: -180, ymin: -90, xmax: 180, ymax: 90, spatialReference: { wkid: 4326 }},
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelContains'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(1)
      done()
    })
  })

  describe('when filtering features with where clauses', function () {
    it('should return filtered features with less than', (done) => {
      const response = FeatureServer.query(data, {
        where: 'latitude < 39.9137'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(261)
      done()
    })

    it('should return filtered features with greater than', (done) => {
      const response = FeatureServer.query(data, {
        where: 'latitude > 39.9137'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(144)
      done()
    })

    it('should return filtered features with equal', (done) => {
      const response = FeatureServer.query(data, {
        where: 'latitude = 39.9137'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(1)
      done()
    })
  })

  describe('when querying for statistics', function () {
    it('should return correct fields and features for one stat', (done) => {
      const response = FeatureServer.query(data, {
        outStatistics: '[{"statisticType": "MIN", "onStatisticField": "total precip","outStatisticFieldName":"min_precip"}]'
      })
      response.should.be.an.instanceOf(Object)
      response.fields.length.should.equal(1)
      response.features.length.should.equal(1)
      response.features[0]['attributes']['min_precip'].should.equal(0)
      done()
    })

    it('should return correct number of fields and features for 2 stats', (done) => {
      const response = FeatureServer.query(data, {
        outStatistics: '[{"statisticType": "min", "onStatisticField": "total precip","outStatisticFieldName":"min_precip"},{"statisticType": "max", "onStatisticField": "total precip","outStatisticFieldName":"max_precip"}]'
      })
      response.should.be.an.instanceOf(Object)
      response.fields.length.should.equal(2)
      response.features.length.should.equal(1)
      response.features[0]['attributes']['min_precip'].should.equal(0)
      response.features[0]['attributes']['max_precip'].should.equal(1.5)
      done()
    })

    it('should return correct statistics for a count operation', (done) => {
      const response = FeatureServer.query(data, {
        outStatistics: '[{"statisticType": "count", "onStatisticField": "total precip","outStatisticFieldName":"count_precip"}]'
      })
      response.should.be.an.instanceOf(Object)
      response.fields.length.should.equal(1)
      response.features.length.should.equal(1)
      response.features[0]['attributes']['count_precip'].should.not.equal(0)
      done()
    })

    it('should return correct number of fields and features for sum stats', (done) => {
      const response = FeatureServer.query(data, {
        outStatistics: '[{"statisticType": "sum", "onStatisticField": "total precip","outStatisticFieldName": "sum_precip"}]'
      })
      response.should.be.an.instanceOf(Object)
      response.fields.length.should.equal(1)
      response.features.length.should.equal(1)
      response.features[0]['attributes']['sum_precip'].should.equal(135.69000000000003)
      done()
    })

    it('should return correct number of fields and features for avg stats', (done) => {
      const response = FeatureServer.query(data, {
        outStatistics: '[{"statisticType": "avg", "onStatisticField": "total precip","outStatisticFieldName":"avg_precip"}]'
      })
      response.features[0]['attributes']['avg_precip'].should.equal(0.3253956834532375)
      done()
    })

    it('should return correct number of fields and features for var/stddev stats', (done) => {
      const response = FeatureServer.query(data, {
        outStatistics: '[{"statisticType":"var","onStatisticField":"total precip","outStatisticFieldName":"var_precip"},{"statisticType":"stddev","onStatisticField": "total precip","outStatisticFieldName":"stddev_precip"}]'
      })
      response.features[0]['attributes']['var_precip'].should.equal(0.07661480700055341)
      response.features[0]['attributes']['stddev_precip'].should.equal(0.27646171244241985)
      done()
    })
  })

  describe('when getting feature counts from a given count', (done) => {
    it('should return a correct count json', (done) => {
      const json = FeatureServer.query({count: 100}, {returnCountOnly: true})
      json.count.should.equal(100)
      done()
    })
  })
})
