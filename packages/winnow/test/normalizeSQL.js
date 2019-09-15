const test = require('tape')
const { normalizeFields } = require('../src/options/normalizeSQL')

// TODO: put other functions from normalize fields under test

test('normalize fields when value is "*"', t => {
  t.plan(1)
  const options = {
    fields: '*'
  }
  const fields = normalizeFields(options)
  t.equals(fields, undefined, 'is undefined')
})

test('normalize fields when value is "test,field,names"', t => {
  t.plan(2)
  const options = {
    fields: 'test,field,names'
  }
  const fields = normalizeFields(options)
  t.ok(Array.isArray(fields), 'is an array')
  t.deepEquals(fields, ['test', 'field', 'names'], 'has expected contents')
})

test('normalize fields when value is "[\'test\', \'field\', \'names\']"', t => {
  t.plan(2)
  const options = {
    fields: ['test', 'field', 'names']
  }
  const fields = normalizeFields(options)
  t.ok(Array.isArray(fields), 'is an array')
  t.deepEquals(fields, ['test', 'field', 'names'], 'has expected contents')
})

test('normalize fields when value options has "outFields" rather thatn "fields', t => {
  t.plan(1)
  const options = {
    outFields: '*'
  }
  const fields = normalizeFields(options)
  t.equals(fields, undefined, 'should be undefined')
})

test('normalize fields when returnIdsOnly is set to true and an idField is set', t => {
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
  t.equals(fields[0], 'feature_id', 'is the idField')
})

test('normalize fields when returnIdsOnly is set to true and an idField is not set', t => {
  t.plan(1)
  const options = {
    returnIdsOnly: true,
    outFields: '*'
  }
  const fields = normalizeFields(options)
  t.equals(fields[0], 'OBJECTID', 'is OBJECTID')
})
