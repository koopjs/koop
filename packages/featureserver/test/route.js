const FeatureServer = require('../src')
const request = require('supertest')
const express = require('express')
const should = require('should')
const _ = require('lodash')
const snow = require('./fixtures/snow.json')
const app = express()

let data

const handler = (req, res) => FeatureServer.route(req, res, data)

app.get('/FeatureServer', handler)
app.get('/FeatureServer/layers', handler)
app.get('/FeatureServer/:layer', handler)
app.get('/FeatureServer/:layer/:method', handler)

describe('Routing feature server requests', () => {
  beforeEach(() => {
    data = _.cloneDeep(snow)
    data.name = 'Snow'
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
  })

  describe('Layer Info', () => {
    it('should properly route and handle a layer info request`', done => {
      request(app)
      .get('/FeatureServer/0?f=json')
      .expect(res => {
        res.body.type.should.equal('Feature Layer')
        res.body.name.should.equal('Snow')
        res.body.fields.filter(f => { return f.name === 'OBJECTID' }).length.should.equal(1)
        should.exist(res.body.extent)
      })
      .expect('Content-Type', /json/)
      .expect(200, done)
    })
  })

  describe('Server Info', () => {
    it('should properly route and handle a server info`', done => {
      request(app)
      .get('/FeatureServer?f=json')
      .expect(res => {
        res.body.layers.length.should.equal(1)
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
