const test = require('tape')
const normalizeOrder = require('../../../lib/normalize-query-options/order')

test('normalize-options, order: undefined', t => {
  t.plan(1)

  const normalized = normalizeOrder({ })
  t.equal(normalized, undefined)
})

test('normalize-options, order: empty string', t => {
  t.plan(1)

  const normalized = normalizeOrder({ order: '' })
  t.equal(normalized, undefined)
})

test('normalize-options, order: defer to "order" value', t => {
  t.plan(1)

  const normalizedOrder = normalizeOrder({ order: 'hello', orderByFields: 'world' })
  t.deepEquals(normalizedOrder, ['hello'])
})

test('normalize-options, order: use orderByFields as second choice', t => {
  t.plan(1)

  const normalizedOrder = normalizeOrder({ orderByFields: 'world' })
  t.deepEquals(normalizedOrder, ['world'])
})

test('normalize-options, order: convert string to array', t => {
  t.plan(1)
  const normalizedOrder = normalizeOrder({ order: 'hello,world' })
  t.deepEquals(normalizedOrder, ['hello', 'world'])
})

test('normalize-options, order: convert string to array, trim whitespace', t => {
  t.plan(1)
  const normalizedOrder = normalizeOrder({ order: 'hello ,world' })
  t.deepEquals(normalizedOrder, ['hello', 'world'])
})

test('normalize-options, order: value is a string array', t => {
  t.plan(2)
  const options = {
    order: ['test', 'field', 'names']
  }
  const order = normalizeOrder(options)
  t.ok(Array.isArray(order))
  t.deepEquals(order, ['test', 'field', 'names'])
})

test('normalize-options, order: value is a not a string or array', t => {
  t.plan(1)
  const options = {
    order: 1
  }
  const order = normalizeOrder(options)
  t.equals(order, undefined)
})
