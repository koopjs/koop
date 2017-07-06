const test = require('tape')
const geojson = require('./fixtures/to-esri-fixture.json')
const oidFeature = require('./fixtures/oid-feature.json')
const emptyCollection = require('./fixtures/emptyCollection.json')
const Winnow = require('../src')
const _ = require('lodash')

test('detecting fields', t => {
  const options = {}
  const result = Winnow.query(geojson, options)
  const metadata = result.metadata
  t.equal(metadata.fields[0].type, 'Double')
  t.equal(metadata.fields[1].type, 'Integer')
  t.equal(metadata.fields[2].type, 'String')
  t.equal(metadata.fields[3].type, 'Date')
  t.end()
})

test('handling errors when feature collection is empty', t => {
  const options = {
    toEsri: true
  }
  const fixture = _.cloneDeep(emptyCollection)
  const result = Winnow.query(fixture, options)
  t.equal(result.metadata.idField, undefined)
  t.equal(result.features.length, 0)
  t.end()
})

test('checking if an object id exists', t => {
  const options = {
    toEsri: true
  }
  const fixture = _.cloneDeep(oidFeature)
  const result = Winnow.query(fixture, options)
  t.equal(result.features[0].attributes.objectid, 1)
  t.equal(result.metadata.idField, 'objectid')
  t.end()
})

test('adding an object id', t => {
  const options = {
    toEsri: true
  }
  const fixture = _.cloneDeep(geojson)
  const result = Winnow.query(fixture, options)
  t.equal(result.features[0].attributes.OBJECTID, 0)
  t.end()
})

test('do not overwrite the object id', t => {
  const options = {
    toEsri: true
  }

  const fixture = _.cloneDeep(geojson)
  fixture.features[0].properties.OBJECTID = 1
  fixture.metadata = { idField: 'OBJECTID' }

  const result = Winnow.query(fixture, options)
  t.equal(result.features[0].attributes.OBJECTID, 1)
  t.end()
})

test('converting date fields', t => {
  const options = {
    toEsri: true
  }
  const fixture = _.cloneDeep(geojson)
  const result = Winnow.query(fixture, options)
  t.equal(result.features[0].attributes.date, 1331769600000)
  t.equal(Object.keys(result.metadata.fields).length, 4)
  t.end()
})

test('converting date with passed in fields metadata', t => {
  const options = {
    toEsri: true
  }
  const fixture = Object.assign({}, geojson, {
    metdata: {
      fields: [
        {
          name: 'double',
          type: 'Double'
        },
        {
          name: 'integer',
          type: 'Integer'
        },
        {
          name: 'string',
          type: 'String'
        },
        {
          name: 'date',
          type: 'Date'
        }
      ]
    }
  })
  const result = Winnow.query(fixture, options)
  t.equal(result.features[0].attributes.date, 1331769600000)
  t.equal(Object.keys(result.metadata.fields).length, 4)
  t.end()
})
