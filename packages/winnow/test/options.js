const test = require('tape')
const prepare = require('../lib/options').prepare

test('normalize a where query with an esri-style date', t => {
  t.plan(1)
  const options = {
    where: 'foo=\'bar\' AND ISSUE_DATE >= date 2017-01-05 AND ISSUE_DATE <= date 2018-01-05'
  }

  const prepared = prepare(options)
  t.equal(prepared.where, 'foo=\'bar\' AND ISSUE_DATE >= \'2017-01-05T00:00:00.000Z\' AND ISSUE_DATE <= \'2018-01-05T00:00:00.000Z\'')
})

test('normalize a wfs srsName', t => {
  t.plan(1)
  const options = { srsName: 'EPSG:3857' }
  const prepared = prepare(options)
  t.equal(prepared.projection, 'EPSG:3857')
})

test('normalize a wfs srsname', t => {
  t.plan(1)
  const options = { srsname: 'EPSG:3857' }
  const prepared = prepare(options)
  t.equal(prepared.projection, 'EPSG:3857')
})

test('handle a query with no returned features', t => {
  t.plan(1)
  const options = { toEsri: true, collection: { type: 'FeatureCollection' } }
  const features = []

  const prepared = prepare(options, features)
  t.equal(prepared.collection.metadata.idField, undefined)
})

test('handle a query with no features but options returnIdsOnly andidField set in metadata', t => {
  t.plan(3)
  const options = { toEsri: true, returnIdsOnly: true, collection: { metadata: { idField: 'feature_id' }, type: 'FeatureCollection' } }
  const features = []

  const prepared = prepare(options, features)
  t.equal(prepared.collection.metadata.idField, 'feature_id')
  t.equal(prepared.idField, 'feature_id')
  t.equal(prepared.fields[0], 'feature_id')
})
