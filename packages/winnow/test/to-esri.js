const test = require('tape')
const geojson = require('./fixtures/to-esri-fixture.json')
const Winnow = require('../src')

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

test('converting date fields', t => {
  const options = {
    toEsri: true
  }
  const result = Winnow.query(geojson, options)
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
