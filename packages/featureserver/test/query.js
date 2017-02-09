const FeatureServer = require('../src')
const data = require('./fixtures/snow.json')
const should = require('should') // eslint-disable-line
const polyData = require('./fixtures/polygon.json')
const budgetTable = require('./fixtures/budgetTable.json')

describe('Query operatons', function () {
  describe('when getting featureserver features from geojson', function () {
    it('should return a valid features', () => {
      const response = FeatureServer.query(data, {})
      response.should.be.an.instanceOf(Object)
      response.fields.should.be.an.instanceOf(Array)
      response.features.should.be.an.instanceOf(Array)
      response.features.forEach(function (feature) {
        feature.should.have.property('geometry')
        feature.should.have.property('attributes')
      })
    })
  })

  describe('when getting featureserver features by id queries', function () {
    it('should return a proper features', () => {
      const response = FeatureServer.query(data, { objectIds: '1,2,3' })
      response.should.be.an.instanceOf(Object)
      response.fields.should.be.an.instanceOf(Array)
      response.features.should.have.length(3)
    })

    it('should return only count of features', () => {
      const response = FeatureServer.query(data, { returnCountOnly: true, objectIds: '1,2,3' })
      response.should.be.an.instanceOf(Object)
      response.should.have.property('count')
      response.count.should.equal(3)
    })
  })

  describe('when getting features with returnIdsOnly', function () {
    it('should return only ids of features', () => {
      const response = FeatureServer.query(data, { returnIdsOnly: true, objectIds: '1,2,3' })
      response.should.be.an.instanceOf(Object)
      response.should.have.property('objectIds')
      response.objectIds.length.should.equal(3)
    })
  })

  describe('when filtering features with a geometry', function () {
    it('should return geometries that are contained', () => {
      const response = FeatureServer.query(data, {
        geometry: {xmin: -110, ymin: 30, xmax: -106, ymax: 50},
        geometryType: 'esriGeometryEnvelope'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(100)
    })
  })

  describe('when filtering features with a geometry and outSR', function () {
    it('should return geometries that are contained', () => {
      const response = FeatureServer.query(data, {
        geometry: {xmin: -110, ymin: 30, xmax: -106, ymax: 50, spatialReference: { wkid: 4326 }},
        geometryType: 'esriGeometryEnvelope'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(100)
    })
  })

  describe('when filtering features with a geometry and outSR', function () {
    it('should return geometries that are contained', () => {
      const response = FeatureServer.query(data, {
        geometry: {xmin: -110, ymin: 30, xmax: -106, ymax: 50, spatialReference: { wkid: 4326 }},
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelContains'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(100)
    })
  })

  describe('when filtering polygon features with a geometry', function () {
    it('should return geometries that are contained by given bounds', () => {
      const response = FeatureServer.query(polyData, {
        geometry: {xmin: -180, ymin: -90, xmax: 180, ymax: 90, spatialReference: { wkid: 4326 }},
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelContains'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(1)
    })
  })

  describe('when filtering features with where clauses', function () {
    it('should return filtered features with less than', () => {
      const response = FeatureServer.query(data, {
        where: 'latitude < 39.9137'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(261)
    })

    it('should return filtered features with greater than', () => {
      const response = FeatureServer.query(data, {
        where: 'latitude > 39.9137'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(144)
    })

    it('should return filtered features with equal', () => {
      const response = FeatureServer.query(data, {
        where: 'latitude = 39.9137'
      })
      response.should.be.an.instanceOf(Object)
      response.features.length.should.equal(1)
    })

    it('should return well formed features', () => {
      const options = {
        f: 'json',
        where: `Full/Part = 'P'`,
        returnGeometry: false,
        resultOffset: 0,
        resultRecordCount: 10,
        outFields: '*'
      }

      const response = FeatureServer.query(budgetTable, options)
      response.fields.length.should.equal(9)
      response.features.length.should.equal(10)
      Object.keys(response.features[0].attributes).length.should.equal(9)
    })
  })

  describe('querying for statistics', function () {
    describe('results are passed in', function () {
      it('should properly render a group-by response', function () {
        const input = require('./fixtures/stats-in.json')
        const response = FeatureServer.query({statistics: input})
        const expected = require('./fixtures/stats-out.json')
        JSON.stringify(response).should.equal(JSON.stringify(expected))
      })

      it('should properly render a regular response', function () {
        const response = FeatureServer.query({
          statistics: {
            TOTAL_STUD_SUM: 5421,
            ZIP_CODE_COUNT: 18
          }
        })
        const expected = require('./fixtures/stats-out-single.json')
        JSON.stringify(response).should.equal(JSON.stringify(expected))
      })
    })

    describe('calculating from geojson', function () {
      it('should return correct fields and features for one stat', () => {
        const response = FeatureServer.query(data, {
          outStatistics: [{'statisticType': 'MIN', 'onStatisticField': 'total precip', 'outStatisticFieldName': 'min_precip'}]
        })
        response.should.be.an.instanceOf(Object)
        response.fields.length.should.equal(1)
        response.features.length.should.equal(1)
        response.features[0]['attributes']['min_precip'].should.equal(0)
      })

      it('should return correct number of fields and features for 2 stats', () => {
        const response = FeatureServer.query(data, {
          outStatistics: [
            {
              'statisticType': 'min',
              'onStatisticField': 'total precip',
              'outStatisticFieldName': 'min_precip'
            },
            {
              'statisticType': 'max',
              'onStatisticField': 'total precip',
              'outStatisticFieldName': 'max_precip'
            }
          ]
        })
        response.should.be.an.instanceOf(Object)
        response.fields.length.should.equal(2)
        response.features.length.should.equal(1)
        response.features[0]['attributes']['min_precip'].should.equal(0)
        response.features[0]['attributes']['max_precip'].should.equal(1.5)
      })

      it('should return correct statistics for a count operation', () => {
        const response = FeatureServer.query(data, {
          outStatistics: [
            {
              'statisticType': 'count',
              'onStatisticField': 'total precip',
              'outStatisticFieldName': 'count_precip'
            }
          ]
        })
        response.should.be.an.instanceOf(Object)
        response.fields.length.should.equal(1)
        response.features.length.should.equal(1)
        response.features[0]['attributes']['count_precip'].should.not.equal(0)
      })

      it('should return correct number of fields and features for sum stats', () => {
        const response = FeatureServer.query(data, {
          outStatistics: [{'statisticType': 'sum', 'onStatisticField': 'total precip', 'outStatisticFieldName': 'sum_precip'}]
        })
        response.should.be.an.instanceOf(Object)
        response.fields.length.should.equal(1)
        response.features.length.should.equal(1)
        response.features[0]['attributes']['sum_precip'].should.equal(135.69000000000003)
      })

      it('should return correct number of fields and features for avg stats', () => {
        const response = FeatureServer.query(data, {
          outStatistics: [{'statisticType': 'avg', 'onStatisticField': 'total precip', 'outStatisticFieldName': 'avg_precip'}]
        })
        response.features[0]['attributes']['avg_precip'].should.equal(0.3253956834532375)
      })

      it('should return correct number of fields and features for var/stddev stats', () => {
        const response = FeatureServer.query(data, {
          outStatistics: [{'statisticType': 'var', 'onStatisticField': 'total precip', 'outStatisticFieldName': 'var_precip'}, {'statisticType': 'stddev', 'onStatisticField': 'total precip', 'outStatisticFieldName': 'stddev_precip'}]
        })
        response.features[0]['attributes']['var_precip'].should.equal(0.07661480700055341)
        response.features[0]['attributes']['stddev_precip'].should.equal(0.27646171244241985)
      })

      it('should return a correct response when there are multiple stats returned', () => {
        const options = {
          where: '1=1',
          returnGeometry: false,
          returnDistinctValues: false,
          returnIdsOnly: false,
          returnCountOnly: false,
          outFields: '*',
          sqlFormat: 'standard',
          f: 'json',
          groupByFieldsForStatistics: 'Full/Part',
          outStatistics:
          [ { statisticType: 'count', onStatisticField: 'Full/Part', outStatisticFieldName: 'Full/Part_COUNT' } ],
          orderByFields: 'Full/Part_COUNT DESC'
        }

        const response = FeatureServer.query(budgetTable, options)
        response.features[0]['attributes']['Full/Part_COUNT'].should.equal(6644)
        response.fields[0].name.should.equal('Full/Part_COUNT')
        response.fields[1].name.should.equal('Full/Part')
        response.displayFieldName.should.equal('Full/Part_COUNT')
      })
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
