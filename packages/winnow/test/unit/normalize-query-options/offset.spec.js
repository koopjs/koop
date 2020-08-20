const test = require('tape')
const normalizeOffset = require('../../../lib/normalize-query-options/offset')

test('normalize-query-options, offset: undefined limit and offset', t => {
  t.plan(1)

  const normalized = normalizeOffset({ })
  t.equal(normalized, undefined)
})

test('normalize-query-options, offset: undefined limit', t => {
  t.plan(1)

  const normalized = normalizeOffset({
    offset: 100
  })
  t.equal(normalized, undefined)
})

test('normalize-query-options, offset: defer to offset option', t => {
  t.plan(1)

  const normalized = normalizeOffset({
    limit: 10,
    offset: 100,
    resultOffset: 200
  })
  t.equal(normalized, 100)
})

test('normalize-query-options, offset: defer to resultOffset option if no offset', t => {
  t.plan(1)

  const normalized = normalizeOffset({
    limit: 10,
    resultOffset: 200
  })
  t.equal(normalized, 200)
})
