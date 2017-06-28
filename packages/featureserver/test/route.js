/* global describe, it, beforeEach */
const FeatureServer = require('../src')
const request = require('supertest')
const express = require('express')
const should = require('should')
const _ = require('lodash')
const snow = require('./fixtures/snow.json')
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
app.get('/FeatureServer/layers', handler)
app.get('/FeatureServer/:layer', handler)
app.get('/FeatureServer/:layer/:method', handler)

describe('Routing feature server requests', () => {
  beforeEach(() => {
    data = _.cloneDeep(snow)
    data.name = 'Snow'
  })

  describe('Server Info', () => {
    it('should properly route and handle a server info request`', done => {
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
  })

  describe('Query', () => {
    it('should properly route and handle a query', done => {
      request(app)
        .get('/FeatureServer/0/query?f=json&where=1%3D1')
        .expect(res => {
          res.body.features[1].attributes.OBJECTID.should.equal(1)
          res.body.features.length.should.equal(417)
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('should handle when a provider passes in statistics', done => {
      data = require('./fixtures/provider-statistics.json')
      request(app)
        .get('/FeatureServer/0/query?f=json' +
         'geometry={"xmin":-15576031.875835987,"ymin":-14167144.570483988,"xmax":15576031.875835987,"ymax":14167144.570483988}&' +
         'geometryType=esriGeometryEnvelope&' +
         'inSR=102100&' +
         'spatialRel=esriSpatialRelIntersects&' +
         'outStatistics=[{"onStatisticField":"OBJECTID","statisticType":"min","outStatisticFieldName":"min_2"},{"onStatisticField":"OBJECTID","statisticType":"max","outStatisticFieldName":"max_2"},{"onStatisticField":"OBJECTID","statisticType":"count","outStatisticFieldName":"count_2"}]&' +
         'where=1=1')
        .expect(res => {
          res.body.features[0].attributes.min_2.should.equal(0)
          res.body.features[0].attributes.max_2.should.equal(57611)
          res.body.features[0].attributes.count_2.should.equal(75343)
          res.body.fields.length.should.equal(3)
          res.body.fields[0].type.should.equal('esriFieldTypeInteger')
          res.body.fields[1].type.should.equal('esriFieldTypeInteger')
          res.body.fields[2].type.should.equal('esriFieldTypeInteger')
        })
        .expect(200, done)
    })
  })

  describe('Layer Info', () => {
    it('should properly route and handle a layer info request`', done => {
      request(app)
        .get('/FeatureServer/0?f=json')
        .expect(res => {
          res.body.type.should.equal('Feature Layer')
          res.body.name.should.equal('Snow')
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
})
