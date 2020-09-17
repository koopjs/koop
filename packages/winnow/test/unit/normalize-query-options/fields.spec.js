const test = require('tape')
const normalizeFields = require('../../../lib/normalize-query-options/fields')

test('normalize-options, fields: undefined', t => {
  t.plan(1)

  const normalized = normalizeFields({ })
  t.equal(normalized, undefined)
})

test('normalize-options, fields: defer to "fields" value', t => {
  t.plan(1)

  const normalizedFields = normalizeFields({ fields: 'hello', outFields: 'world' })
  t.deepEquals(normalizedFields, ['hello'])
})

test('normalize-options, fields: remove Geoservices-style "*" when present', t => {
  t.plan(1)

  const normalizedFields = normalizeFields({ fields: '*' })
  t.deepEquals(normalizedFields, undefined)
})

test('normalize-options, fields: convert string to array', t => {
  t.plan(1)
  const normalizedFields = normalizeFields({ fields: 'hello,world' })
  t.deepEquals(normalizedFields, ['hello', 'world'])
})

test('normalize-options, fields: convert string to array, trim whitespace', t => {
  t.plan(1)
  const normalizedFields = normalizeFields({ fields: 'hello ,world' })
  t.deepEquals(normalizedFields, ['hello', 'world'])
})

test('normalize-options, fields: value is a string array', t => {
  t.plan(2)
  const options = {
    fields: ['test', 'field', 'names']
  }
  const fields = normalizeFields(options)
  t.ok(Array.isArray(fields))
  t.deepEquals(fields, ['test', 'field', 'names'])
})

test('normalize-options, fields: returnIdsOnly is set to true and an idField is set', t => {
  t.plan(1)
  const options = {
    returnIdsOnly: true,
    outFields: '*',
    collection: {
      metadata: {
        idField: 'feature_id'
      }
    }
  }
  const fields = normalizeFields(options)
  t.deepEquals(fields, ['feature_id'])
})

test('normalize-options, fields: returnIdsOnly is set to true and an idField is not set', t => {
  t.plan(1)
  const options = {
    returnIdsOnly: true,
    outFields: '*'
  }
  const fields = normalizeFields(options)
  t.deepEquals(fields, ['OBJECTID'])
})
