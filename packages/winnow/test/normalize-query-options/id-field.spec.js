const test = require('tape')
const normalizeIdField = require('../../lib/normalize-query-options/id-field')

test('normalize-query-options, idField: undefined inputs return null', spec => {
  spec.plan(1)
  const result = normalizeIdField()
  spec.equals(result, null)
})

test('normalize-query-options, idField: undefined metadata and no feature properties', spec => {
  spec.plan(1)
  const result = normalizeIdField({}, [{}])
  spec.equals(result, null)
})

test('normalize-query-options, idField: undefined metadata and feature OBJECTID', spec => {
  spec.plan(1)
  const result = normalizeIdField({}, [{ properties: {} }])
  spec.equals(result, null)
})

test('normalize-query-options, idField: undefined metadata and feature OBJECTID', spec => {
  spec.plan(1)
  const result = normalizeIdField({}, [{ attributes: {} }])
  spec.equals(result, null)
})

test('normalize-query-options, idField: no collection metadata', spec => {
  spec.plan(1)
  const result = normalizeIdField({ collection: {} })
  spec.equals(result, null)
})

test('normalize-query-options, idField: empty collection metadata', spec => {
  spec.plan(1)
  const result = normalizeIdField({ collection: { metadata: {} } })
  spec.equals(result, null)
})

test('normalize-query-options, idField: set by metadata.idField', spec => {
  spec.plan(1)
  const result = normalizeIdField({ collection: { metadata: { idField: 'customIdField' } } })
  spec.equals(result, 'customIdField')
})

test('normalize-query-options, idField: default to metadata.idField', spec => {
  spec.plan(1)
  const result = normalizeIdField({
    collection: {
      metadata: {
        idField: 'customIdField',
        fields: [
          { name: 'OBJECTID' }
        ]
      }
    }
  }, [{ properties: { OBJECTID: 9999 } }])
  spec.equals(result, 'customIdField')
})

test('normalize-query-options, idField: derive from metadata.fields', spec => {
  spec.plan(1)
  const result = normalizeIdField({
    collection: {
      metadata: {
        fields: [
          { name: 'OBJECTID' }
        ]
      }
    }
  }, [{ properties: { OBJECTID: 9999 } }])
  spec.equals(result, 'OBJECTID')
})

test('normalize-query-options, idField: derive from data', spec => {
  spec.plan(1)
  const result = normalizeIdField({}, [{ properties: { OBJECTID: 9999 } }])
  spec.equals(result, 'OBJECTID')
})
