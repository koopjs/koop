/* global describe, it, beforeEach */
const FeatureServer = require('../..')
const request = require('supertest')
const express = require('express')
const should = require('should')
const _ = require('lodash')
const snow = require('./fixtures/snow.json')
const noGeom = require('./fixtures/no-geometry.json')
const ProviderStatsClassBreaks = require('./fixtures/generateRenderer/provider-statistics-with-classBreaks.json')
const relatedData = require('./fixtures/relatedData.json')
const app = express()

let data

const serverHander = (req, res) => {
  FeatureServer.route(req, res, {
    description: 'test',
    layers: [data, data]
  })
}
const handler = (req, res) => FeatureServer.route(req, res, data)

app.get('/FeatureServer', serverHander)
app.get('/FeatureServer/info', serverHander)
app.get('/FeatureServer/layers', handler)
app.get('/FeatureServer/:layer', handler)
app.get('/FeatureServer/:layer/:method', handler)

describe('Routing feature server requests', () => {
  beforeEach(() => {
    data = _.cloneDeep(snow)
    data.name = 'Snow'
  })

  describe('Server Info', () => {
    it('should properly route and handle a server info request to /FeatureServer`', done => {
      request(app)
        .get('/FeatureServer?f=json')
        .expect(res => {
          res.body.serviceDescription.should.equal('test')
          res.body.layers.length.should.equal(2)
          Array.isArray(res.body.tables).should.equal(true)
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('should properly route and handle a server info request to /FeatureServer/`', done => {
      request(app)
        .get('/FeatureServer/?f=json')
        .expect(res => {
          res.body.serviceDescription.should.equal('test')
          res.body.layers.length.should.equal(2)
          Array.isArray(res.body.tables).should.equal(true)
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('should properly route and handle a server info request to /FeatureServer/info`', done => {
      request(app)
        .get('/FeatureServer/info?f=json')
        .expect(res => {
          res.body.serviceDescription.should.equal('test')
          res.body.layers.length.should.equal(2)
          Array.isArray(res.body.tables).should.equal(true)
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })
  })

  describe('Layers', () => {
    it('should properly route and handle a layers request`', done => {
      request(app)
        .get('/FeatureServer/layers?f=json')
        .expect(res => {
          res.body.layers.length.should.equal(1)
          res.body.tables.length.should.equal(0)
          res.body.layers[0].name.should.equal('Snow')
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })
  })

  describe('Layer Info', () => {
    it('should properly route and handle a layer info request of form /FeatureServer/:layerId`', done => {
      request(app)
        .get('/FeatureServer/3?f=json')
        .expect(res => {
          res.body.type.should.equal('Feature Layer')
          res.body.name.should.equal('Snow')
          res.body.id.should.equal(3)
          res.body.fields
            .filter(f => {
              return f.name === 'OBJECTID'
            })
            .length.should.equal(1)
          should.exist(res.body.extent)
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('should properly route and handle a layer info request of form /FeatureServer/:layerId/`', done => {
      request(app)
        .get('/FeatureServer/3/?f=json')
        .expect(res => {
          res.body.type.should.equal('Feature Layer')
          res.body.name.should.equal('Snow')
          res.body.id.should.equal(3)
          res.body.fields
            .filter(f => {
              return f.name === 'OBJECTID'
            })
            .length.should.equal(1)
          should.exist(res.body.extent)
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('should properly route and handle a layer info request of form /FeatureServer/:layerId/info`', done => {
      request(app)
        .get('/FeatureServer/3/info?f=json')
        .expect(res => {
          res.body.type.should.equal('Feature Layer')
          res.body.name.should.equal('Snow')
          res.body.id.should.equal(3)
          res.body.fields
            .filter(f => {
              return f.name === 'OBJECTID'
            })
            .length.should.equal(1)
          should.exist(res.body.extent)
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    describe('no geometry', () => {
      beforeEach(() => {
        data = _.cloneDeep(noGeom)
      })
      it('should properly route and handle the layer with no geometry', done => {
        request(app)
          .get('/FeatureServer/3?f=json')
          .expect(res => {
            res.body.type.should.equal('Table')
            res.body.id.should.equal(3)
            res.body.fields
              .filter(f => {
                return f.name === 'OBJECTID'
              })
              .length.should.equal(1)
          })
          .expect('Content-Type', /json/)
          .expect(200, done)
      })
    })
  })

  describe('Method not supported', () => {
    it('should return an informative error', done => {
      request(app)
        .get('/FeatureServer/0/foobarbaz')
        .expect(res => {
          res.body.error.should.equal('Method not supported')
        })
        .expect('Content-Type', /json/)
        .expect(400, done)
    })
  })

  describe('Query', () => {
    before(function () {
      // This pattern is used to help insulate bugs that occur from platform-specific logic in farmhash.
      // The existing hard-coded OBJECTID's were generated by a unix-based farmhash, and would cause
      // the tests to fail when run on windows.
      const response = FeatureServer.query(data, { outFields: 'OBJECTID' })
      this.secondOBJECTID = response.features[1].attributes.OBJECTID
    })

    it('should properly route and handle a query', done => {
      request(app)
        .get('/FeatureServer/0/query?f=json&where=1%3D1')
        .expect(res => {
          res.body.features.length.should.equal(417)
          res.body.exceededTransferLimit.should.equal(false)
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('should respect passed in max record count', function (done) {
      data.metadata.maxRecordCount = 2
      request(app)
        .get('/FeatureServer/0/query?f=json&where=1%3D1')
        .expect(res => {
          res.body.features[1].attributes.OBJECTID.should.equal(this.secondOBJECTID)
          res.body.features.length.should.equal(2)
          res.body.exceededTransferLimit.should.equal(true)
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('should respect resultRecordCount', done => {
      request(app)
        .get('/FeatureServer/0/query?f=json&where=1%3D1&resultRecordCount=10')
        .expect(res => {
          res.body.features.length.should.equal(10)
          res.body.exceededTransferLimit.should.equal(true)
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('should respect limit', done => {
      request(app)
        .get('/FeatureServer/0/query?f=json&where=1%3D1&limit=10')
        .expect(res => {
          res.body.features.length.should.equal(10)
          res.body.exceededTransferLimit.should.equal(true)
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('should ignore empty query parameters', function (done) {
      request(app)
        .get('/FeatureServer/0/query?f=json&orderByFields=')
        .expect(res => {
          res.body.features[1].attributes.OBJECTID.should.equal(this.secondOBJECTID)
          res.body.features.length.should.equal(417)
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('should handle when a provider passes in statistics', done => {
      data = require('./fixtures/provider-statistics.json')
      request(app)
        .get(
          '/FeatureServer/0/query?f=json&' +
            'geometry={"xmin":-15576031.875835987,"ymin":-14167144.570483988,"xmax":15576031.875835987,"ymax":14167144.570483988}&' +
            'geometryType=esriGeometryEnvelope&' +
            'inSR=102100&' +
            'spatialRel=esriSpatialRelIntersects&' +
            'outStatistics=[{"onStatisticField":"OBJECTID","statisticType":"min","outStatisticFieldName":"min_2"},{"onStatisticField":"OBJECTID","statisticType":"max","outStatisticFieldName":"max_2"},{"onStatisticField":"OBJECTID","statisticType":"count","outStatisticFieldName":"count_2"}]&' +
            'where=1=1'
        )
        .expect(res => {
          res.body.features[0].attributes.min_2.should.equal(0)
          res.body.features[0].attributes.max_2.should.equal(57611)
          res.body.features[0].attributes.count_2.should.equal(75343)
          res.body.fields.length.should.equal(3)
          res.body.fields[0].type.should.equal('esriFieldTypeDouble')
          res.body.fields[1].type.should.equal('esriFieldTypeDouble')
          res.body.fields[2].type.should.equal('esriFieldTypeDouble')
        })
        .expect(200, done)
    })
  })

  describe('generateRenderer', () => {
    describe('when statistics are passed in', () => {
      beforeEach(() => {
        data = _.cloneDeep(ProviderStatsClassBreaks)
      })
      it('should properly route and handle when a provider passes in class breaks statistics', done => {
        request(app)
          .get('/FeatureServer/3/generateRenderer?')
          .expect(res => {
            res.body.type.should.equal('classBreaks')
            res.body.classBreakInfos.length.should.equal(9)
            res.body.classBreakInfos[0].symbol.color.should.deepEqual([0, 255, 0])
            res.body.classBreakInfos[0].label.should.equal('80-147')
            res.body.classBreakInfos[4].symbol.color.should.deepEqual([0, 255, 255])
            res.body.classBreakInfos[8].symbol.color.should.deepEqual([0, 0, 255])
          })
          .expect('Content-Type', /json/)
          .expect(200, done)
      })
      it('should ignore options when statistics are passed in', done => {
        request(app)
          .get('/FeatureServer/3/generateRenderer?' +
          'classificationDef={' +
            '"type": "classBreaksDef",' +
            '"classificationField": "daily snow total",' +
            '"classificationMethod": "esriClassifyEqualInterval",' +
            '"breakCount": 9}&' +
           'where=&' +
           'gdbVersion=&' +
           'f=json')
          .expect(res => {
            res.body.type.should.equal('classBreaks')
            res.body.classBreakInfos.length.should.equal(9)
            res.body.classBreakInfos[0].symbol.color.should.deepEqual([0, 255, 0])
            res.body.classBreakInfos[0].label.should.equal('80-147')
            res.body.classBreakInfos[4].symbol.color.should.deepEqual([0, 255, 255])
            res.body.classBreakInfos[8].symbol.color.should.deepEqual([0, 0, 255])
          })
          .expect('Content-Type', /json/)
          .expect(200, done)
      })
    })
    it('should properly route and handle a generate renderer request', done => {
      request(app)
        .get('/FeatureServer/3/generateRenderer?' +
        'classificationDef={' +
          '"type": "classBreaksDef",' +
          '"classificationField": "daily snow total",' +
          '"classificationMethod": "esriClassifyEqualInterval",' +
          '"breakCount": 7,' +
          '"colorRamp": {' +
            '"type": "algorithmic",' +
            '"fromColor": [0, 100, 0, 255],' +
            '"toColor": [0, 0, 255, 255],' +
            '"algorithm": "esriHSVAlgorithm"}' +
          '}&' +
         'where=latitude < 39 AND latitude > 38.5&' +
         'f=json')
        .expect(res => {
          res.body.type.should.equal('classBreaks')
          res.body.classBreakInfos.length.should.equal(7)
          res.body.classBreakInfos[0].symbol.color.should.deepEqual([0, 100, 0])
          res.body.classBreakInfos[0].label.should.equal('0-0.7571428571428571')
          res.body.classBreakInfos[3].symbol.color.should.deepEqual([0, 177, 178])
          res.body.classBreakInfos[6].symbol.color.should.deepEqual([0, 0, 255])
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })
  })

  describe('queryRelatedRecords', () => {
    describe('when objectIds are passed in', () => {
      beforeEach(() => {
        data = _.cloneDeep(relatedData)
      })
      it('should properly route and handle return related records result', done => {
        request(app)
          .get('/FeatureServer/0/queryRelatedRecords?')
          .expect(res => {
            res.body.relatedRecordGroups.length.should.equal(1)
            res.body.relatedRecordGroups[0].relatedRecords.length.should.equal(11)
          })
          .expect('Content-Type', /json/)
          .expect(200, done)
      })
    })
  })
})
