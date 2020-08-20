const test = require('tape')
const { detectEsriFieldType } = require('../../../../lib/normalize-query-options/helpers')

test('detectEsriFieldTypes: string', t => {
  t.plan(1)
  const type = detectEsriFieldType('a string value')
  t.equals(type, 'String')
})

test('detectEsriFieldTypes: integer', t => {
  t.plan(1)
  const type = detectEsriFieldType(1)
  t.equals(type, 'Integer')
})

test('detectEsriFieldTypes: double', t => {
  t.plan(1)
  const type = detectEsriFieldType(1.1)
  t.equals(type, 'Double')
})

test('detectEsriFieldTypes: date', t => {
  t.plan(1)
  const type = detectEsriFieldType((new Date()).toISOString())
  t.equals(type, 'Date')
})
