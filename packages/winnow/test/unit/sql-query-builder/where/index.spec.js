const test = require('tape')
const createWhereClause = require('../../../../lib/sql-query-builder/where')

test('createWhereClause: returns empty string if no options', t => {
  t.plan(1)
  const whereClause = createWhereClause()
  t.equals(whereClause, '')
})

test('createWhereClause: returns empty string if empty options', t => {
  t.plan(1)
  const whereClause = createWhereClause({})
  t.equals(whereClause, '')
})

test('createWhereClause: returns where clause with translated SQL where', t => {
  t.plan(1)
  const whereClause = createWhereClause({
    where: 'color=\'red\''
  })
  t.equals(whereClause, ' WHERE properties->`color` = \'red\'')
})

test('createWhereClause: returns where clause with geometry predicate', t => {
  t.plan(1)
  const whereClause = createWhereClause({
    geometry: [0, 0, 0, 0]
  })
  t.equals(whereClause, ' WHERE ST_Intersects(geometry, ?)')
})

test('createWhereClause: returns where clause with translated sql-where and geometry predicate', t => {
  t.plan(1)
  const whereClause = createWhereClause({
    geometry: [0, 0, 0, 0],
    where: 'color=\'red\''
  })
  t.equals(whereClause, ' WHERE properties->`color` = \'red\' AND ST_Intersects(geometry, ?)')
})
