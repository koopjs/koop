const test = require('tape')
const packageFeatures = require('../../../lib/query/package-features')

test('packageFeatures: groupBy option', t => {
  const result = packageFeatures(['feature1', 'feature2'], { groupBy: true })
  t.deepEquals(result, ['feature1', 'feature2'])
  t.end()
})

test('packageFeatures: aggregates option', t => {
  const result = packageFeatures(['feature1', 'feature2'], { aggregates: true })
  t.deepEquals(result, 'feature1')
  t.end()
})

test('packageFeatures: collection option', t => {
  const result = packageFeatures(['feature1', 'feature2'], { collection: { foo: 'bar' } })
  t.deepEquals(result, { foo: 'bar', features: ['feature1', 'feature2'] })
  t.end()
})

test('packageFeatures: no options', t => {
  const result = packageFeatures(['feature1', 'feature2'], {})
  t.deepEquals(result, ['feature1', 'feature2'])
  t.end()
})
