const test = require('tape')
const createFieldsSelectFragment = require('../../../../lib/sql-query-builder/select/fields-select-fragment')

test('createFieldsSelectFragment: no specification', t => {
  const fieldsFragment = createFieldsSelectFragment({})
  t.equal(fieldsFragment, 'type, properties as properties')
  t.end()
})

test('createFieldsSelectFragment: fields option', t => {
  const fieldsFragment = createFieldsSelectFragment({
    fields: ['foo', 'bar']
  })
  t.equal(fieldsFragment, 'pick(properties, "foo,bar") as properties')
  t.end()
})

test('createFieldsSelectFragment: fields and dateFields options', t => {
  const fieldsFragment = createFieldsSelectFragment({
    fields: ['foo', 'bar', 'hello', 'world'],
    dateFields: ['foo', 'hello']
  })
  t.equal(fieldsFragment, 'pick(properties, "foo,bar,hello,world") as properties')
  t.end()
})

test('createFieldsSelectFragment: fields, dateFields, returnIdsOnly options', t => {
  const fieldsFragment = createFieldsSelectFragment({
    fields: ['foo', 'bar', 'hello', 'world'],
    dateFields: ['foo', 'hello'],
    returnIdsOnly: true
  })
  t.equal(fieldsFragment, 'pick(properties, "foo,bar,hello,world") as properties')
  t.end()
})

test('createFieldsSelectFragment: fields, dateFields, returnIdsOnly, idField options', t => {
  const fieldsFragment = createFieldsSelectFragment({
    fields: ['foo', 'bar', 'hello', 'world'],
    dateFields: ['foo', 'hello'],
    returnIdsOnly: true,
    idField: 'bar'
  })
  t.equal(fieldsFragment, 'pick(properties, "foo,bar,hello,world") as properties')
  t.end()
})

test('createFieldsSelectFragment: fields, dateFields, returnIdsOnly, idField as OBJECTID options', t => {
  const fieldsFragment = createFieldsSelectFragment({
    fields: ['foo', 'OBJECTID', 'hello', 'world'],
    dateFields: ['foo', 'hello'],
    returnIdsOnly: true,
    idField: 'OBJECTID'
  })
  t.equal(fieldsFragment, 'pick(properties, "foo,OBJECTID,hello,world") as properties')
  t.end()
})

test('createFieldsSelectFragment: toEsri option', t => {
  const fieldsFragment = createFieldsSelectFragment({
    toEsri: true
  })
  t.equal(fieldsFragment, 'esriFy(properties, geometry, "", "true", "null") as attributes')
  t.end()
})

test('createFieldsSelectFragment: toEsri and fields options', t => {
  const fieldsFragment = createFieldsSelectFragment({
    toEsri: true,
    fields: ['foo', 'bar']
  })
  t.equal(fieldsFragment, 'pickAndEsriFy(properties, geometry, "foo,bar", "", "false", "null") as attributes')
  t.end()
})

test('createFieldsSelectFragment: toEsri, fields, dateFields options', t => {
  const fieldsFragment = createFieldsSelectFragment({
    toEsri: true,
    fields: ['foo', 'bar', 'hello', 'world'],
    dateFields: ['foo', 'hello']
  })
  t.equal(fieldsFragment, 'pickAndEsriFy(properties, geometry, "foo,bar,hello,world", "foo,hello", "false", "null") as attributes')
  t.end()
})

test('createFieldsSelectFragment: toEsri, fields, dateFields, returnIdsOnly options', t => {
  const fieldsFragment = createFieldsSelectFragment({
    toEsri: true,
    fields: ['foo', 'bar', 'hello', 'world'],
    dateFields: ['foo', 'hello'],
    returnIdsOnly: true
  })
  t.equal(fieldsFragment, 'pickAndEsriFy(properties, geometry, "foo,bar,hello,world", "foo,hello", "true", "null") as attributes')
  t.end()
})

test('createFieldsSelectFragment: toEsri, fields, dateFields, returnIdsOnly, idField options', t => {
  const fieldsFragment = createFieldsSelectFragment({
    toEsri: true,
    fields: ['foo', 'bar', 'hello', 'world'],
    dateFields: ['foo', 'hello'],
    returnIdsOnly: true,
    idField: 'bar'
  })
  t.equal(fieldsFragment, 'pickAndEsriFy(properties, geometry, "foo,bar,hello,world", "foo,hello", "true", "bar") as attributes')
  t.end()
})

test('createFieldsSelectFragment: toEsri, fields, dateFields, returnIdsOnly, idField as OBJECTID options', t => {
  const fieldsFragment = createFieldsSelectFragment({
    toEsri: true,
    fields: ['foo', 'OBJECTID', 'hello', 'world'],
    dateFields: ['foo', 'hello'],
    returnIdsOnly: true,
    idField: 'OBJECTID'
  })
  t.equal(fieldsFragment, 'pickAndEsriFy(properties, geometry, "foo,OBJECTID,hello,world", "foo,hello", "true", "OBJECTID") as attributes')
  t.end()
})
