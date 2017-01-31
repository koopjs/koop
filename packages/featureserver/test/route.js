const FeatureServer = require('../src')
const request = require('supertest')
const express = require('express')
const should = require('should')
const app = express()
let data

const handler = (req, res) => FeatureServer.route(req, res, data)

app.get('/FeatureServer', handler)
app.get('/FeatureServer/layers', handler)
app.get('/FeatureServer/:layer', handler)
app.get('/FeatureServer/:layer/:method', handler)

describe('Routing feature server requests', () => {
  beforeEach(() => {
    data = require('./fixtures/snow.json')
    data.name = 'Snow'
  })

  describe('Query', () => {
    it('should properly route and handle a query', done => {
      request(app)
      .get('/FeatureServer/0/query?f=json&where=&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22xmin%22%3A-9764371.741274796%2C%22ymin%22%3A4813698.293307044%2C%22xmax%22%3A-9744803.862033816%2C%22ymax%22%3A4833266.172548024%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&outSR=102100')
      .expect(res => {
        res.body.features.length.should.equal(1)
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
        should.exist(res.body.secureSoapUrl)
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
