const test = require('tape')
const normalizeSpatialPredicate = require('../../lib/normalize-query-options/spatial-predicate')

test('normalize-query-options, spatial-predicate: undefined', t => {
  t.plan(1)

  const normalized = normalizeSpatialPredicate(undefined)
  t.equal(normalized, undefined)
})

test('normalize-options, spatial-predicate: defer to "spatialPredicate" value', t => {
  t.plan(1)

  const normalizedOrder = normalizeSpatialPredicate({ spatialPredicate: 'hello', spatialRel: 'world' })
  t.deepEquals(normalizedOrder, 'hello')
})

test('normalize-options, spatial-predicate: defer to "spatialPredicate" value', t => {
  t.plan(1)

  const normalizedOrder = normalizeSpatialPredicate({ spatialPredicate: 'hello', spatialRel: 'world' })
  t.deepEquals(normalizedOrder, 'hello')
})

test('normalize-options, spatial-predicate: normalize esriSpatialRelContains ', t => {
  t.plan(1)

  const normalizedOrder = normalizeSpatialPredicate({ spatialPredicate: 'esriSpatialRelContains' })
  t.deepEquals(normalizedOrder, 'ST_Contains')
})

test('normalize-options, spatial-predicate: normalize esriSpatialRelWithin', t => {
  t.plan(1)

  const normalizedOrder = normalizeSpatialPredicate({ spatialPredicate: 'esriSpatialRelWithin' })
  t.deepEquals(normalizedOrder, 'ST_Within')
})

test('normalize-options, spatial-predicate: normalize esriSpatialRelIntersects', t => {
  t.plan(1)

  const normalizedOrder = normalizeSpatialPredicate({ spatialPredicate: 'esriSpatialRelIntersects' })
  t.deepEquals(normalizedOrder, 'ST_Intersects')
})

test('normalize-options, spatial-predicate: normalize esriSpatialRelEnvelopeIntersects', t => {
  t.plan(1)

  const normalizedOrder = normalizeSpatialPredicate({ spatialPredicate: 'esriSpatialRelEnvelopeIntersects' })
  t.deepEquals(normalizedOrder, 'ST_EnvelopeIntersects')
})
