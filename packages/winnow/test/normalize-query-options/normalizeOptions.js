const test = require('tape')

const {
  // TODO: Put these under test
  // normalizeLimit,
  // normalizeGeometry,
  // normalizeOffset,
  normalizeIdField
} = require('../../lib/normalize-query-options/normalizeOptions')

test('normalize idField when set with metadata', t => {
  t.plan(1)
  const options = { collection: { metadata: { idField: 'feature_id' } } }
  const idField = normalizeIdField(options)
  t.equals(idField, 'feature_id', 'idField set properly with metadata')
})

test('normalize idField with OBJECTID from feature properties', t => {
  t.plan(1)
  const options = {}
  const features = [
    {
      properties: {
        OBJECTID: 1
      }
    }
  ]
  const idField = normalizeIdField(options, features)
  t.equals(idField, 'OBJECTID', 'idField defaulted to OBJECTID when found as feature property')
})

test('normalize idField with metadata.fields', t => {
  t.plan(1)
  const options = {
    collection: {
      metadata: {
        fields: [
          {
            name: 'OBJECTID'
          }
        ]
      }
    }
  }
  const features = [
    {
      properties: {
        OBJECTID: 1
      }
    }
  ]
  const idField = normalizeIdField(options, features)
  t.equals(idField, 'OBJECTID', 'idField defaulted to OBJECTID when found in metadata.fields')
})

test('normalize idField with metadata.fields', t => {
  t.plan(1)
  const options = {
    collection: {
      metadata: {
        fields: [
          {
            name: 'OBJECTID'
          }
        ]
      }
    }
  }
  const features = [
    {
      properties: {
        OBJECTID: 1
      }
    }
  ]
  const idField = normalizeIdField(options, features)
  t.equals(idField, 'OBJECTID', 'idField defaulted to OBJECTID when found in metadata.fields')
})

test('normalize idField with metadata.idField = null', t => {
  t.plan(1)
  const options = {
    collection: {
      metadata: {
        idField: null
      }
    }
  }
  const idField = normalizeIdField(options)
  t.equals(idField, null, 'idField return as null')
})
