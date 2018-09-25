const Koop = require('../src')
const koop = new Koop()
const request = require('supertest')
const geojson = require('./fixtures/snow.json')
const should = require('should') // eslint-disable-line

describe('Datsets API', function () {
  describe('Cache CRUD', function () {
    it('should insert data on PUT', done => {
      request(koop.server)
        .put('/datasets/key')
        .set('Content-Type', 'application/json')
        .send(geojson)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((req, res) => {
          const fc = koop.cache.retrieve('key')
          const metadata = koop.cache.catalog.retrieve('key')
          fc.features.length.should.equal(417)
          metadata.name.should.equal('Snow')
          done()
        })
    })

    it('should read data on GET', done => {
      koop.cache.insert('getKey', geojson)
      request(koop.server)
        .get('/datasets/getKey')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((req, res) => {
          res.body.features.length.should.equal(417)
          done()
        })
    })

    it('should delete data on DELETE', done => {
      koop.cache.insert('deleteKey', geojson)
      request(koop.server)
        .delete('/datasets/deleteKey')
        .expect(200)
        .end((req, res) => {
          const fc = koop.cache.retrieve('deleteKey')
          should.not.exist(fc)
          done()
        })
    })
  })

  describe('Metadata CRUD', function () {
    it('should insert metadata on PUT', done => {
      request(koop.server)
        .put('/datasets/metaKey/metadata')
        .set('Content-Type', 'application/json')
        .send({ name: 'Test' })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((req, res) => {
          const metadata = koop.cache.catalog.retrieve('metaKey')
          metadata.name.should.equal('Test')
          done()
        })
    })

    it('should read metadata on GET', done => {
      koop.cache.catalog.insert('metadataInsert', { name: 'Test' })
      request(koop.server)
        .get('/datasets/metadataInsert/metadata')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((req, res) => {
          res.body.name.should.equal('Test')
          done()
        })
    })

    it('should delete metadata on DELETE', done => {
      koop.cache.catalog.insert('deleteMetaKey', { foo: 'bar' })
      request(koop.server)
        .delete('/datasets/deleteMetaKey/metadata')
        .expect(200)
        .end((req, res) => {
          const meta = koop.cache.catalog.retrieve('deleteMetaKey')
          should.not.exist(meta)
          done()
        })
    })
  })

  describe('FeatureServer', function () {
    it('should get features at /FeatureServer/0/query', done => {
      koop.cache.insert('fsKey', geojson)
      request(koop.server)
        .get('/datasets/fsKey/FeatureServer/0/query?where=1=1')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((req, res) => {
          res.body.features.length.should.equal(417)
          done()
        })
    })
  })
})
