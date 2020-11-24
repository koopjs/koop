const test = require('tape')
const normalizeQueryInput = require('../../../lib/query/normalize-query-input')

test('normalizeQueryInput: invalid input should throw error', t => {
  const invalidInput = [undefined, null, {}, { features: [{}] }, [{}], 'string', 1234, true]

  invalidInput.forEach(input => {
    try {
      normalizeQueryInput(input)
      t.fail(`should have throw error on: ${input}`)
    } catch (error) {
      t.equals(error.message, 'Could not normalize query input to feature array')
    }
  })
  t.end()
})

test('normalizeQueryInput: object with features, properties', t => {
  const result = normalizeQueryInput({ features: [{ properties: {} }] })
  t.deepEquals(result, [{ properties: {} }])
  t.end()
})

test('normalizeQueryInput: object with features, attributes', t => {
  const result = normalizeQueryInput({ features: [{ attributes: {} }] })
  t.deepEquals(result, [{ attributes: {} }])
  t.end()
})

test('normalizeQueryInput: object with empty features array', t => {
  const result = normalizeQueryInput({ features: [] })
  t.deepEquals(result, [])
  t.end()
})

test('normalizeQueryInput: empty array', t => {
  const result = normalizeQueryInput([])
  t.deepEquals(result, [])
  t.end()
})

test('normalizeQueryInput: feature array, properties', t => {
  const result = normalizeQueryInput([{ properties: {} }])
  t.deepEquals(result, [{ properties: {} }])
  t.end()
})

test('normalizeQueryInput: feature array, attributes', t => {
  const result = normalizeQueryInput([{ attributes: {} }])
  t.deepEquals(result, [{ attributes: {} }])
  t.end()
})

test('normalizeQueryInput: feature, properties', t => {
  const result = normalizeQueryInput({ properties: {} })
  t.deepEquals(result, [{ properties: {} }])
  t.end()
})

test('normalizeQueryInput: feature attributes', t => {
  const result = normalizeQueryInput({ attributes: {} })
  t.deepEquals(result, [{ attributes: {} }])
  t.end()
})
