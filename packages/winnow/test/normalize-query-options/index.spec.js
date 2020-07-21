const test = require('tape')
const normalizeQueryOptions = require('../../lib/normalize-query-options')

test('normalize a wfs srsName', t => {
  t.plan(1)
  const options = { srsName: 'EPSG:3857' }
  const normalizedOptions = normalizeQueryOptions(options)
  t.equal(normalizedOptions.projection, 'EPSG:3857')
})

test('normalize a wfs srsname', t => {
  t.plan(1)
  const options = { srsname: 'EPSG:3857' }
  const normalizedOptions = normalizeQueryOptions(options)
  t.equal(normalizedOptions.projection, 'EPSG:3857')
})

test('handle a query with no returned features', t => {
  t.plan(1)
  const options = { toEsri: true, collection: { type: 'FeatureCollection' } }
  const features = []

  const normalizedOptions = normalizeQueryOptions(options, features)
  t.equal(normalizedOptions.collection.metadata.idField, undefined)
})

test('handle a query with no features but options returnIdsOnly and idField set in metadata', t => {
  t.plan(3)
  const options = { toEsri: true, returnIdsOnly: true, collection: { metadata: { idField: 'feature_id' }, type: 'FeatureCollection' } }
  const features = []

  const normalizedOptions = normalizeQueryOptions(options, features)
  t.equal(normalizedOptions.collection.metadata.idField, 'feature_id')
  t.equal(normalizedOptions.idField, 'feature_id')
  t.equal(normalizedOptions.fields[0], 'feature_id')
})
