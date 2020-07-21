const test = require('tape')
const normalizeAggregates = require('../../lib/normalize-query-options/aggregates')

test('normalize-options, aggregates: undefined', t => {
  t.plan(1)

  const normalized = normalizeAggregates({ })
  t.equal(normalized, undefined)
})

test('normalize-options, aggregates: generate name property when missing', t => {
  t.plan(1)

  const options = {
    aggregates: [
      {
        type: 'avg',
        field: 'height'
      }
    ]
  }
  const normalized = normalizeAggregates(options)
  t.deepEquals(normalized, [{ type: 'avg', field: 'height', name: 'avg_height' }])
})

test('normalize-options, aggregates: remove blank space in name property', t => {
  t.plan(1)

  const options = {
    aggregates: [
      {
        type: 'avg',
        field: 'tree height'
      }
    ]
  }
  const normalized = normalizeAggregates(options)
  t.deepEquals(normalized, [{ type: 'avg', field: 'tree height', name: 'avg_tree_height' }])
})

test('normalize-options, aggregates: defer to outStatistics as aggregates source', t => {
  t.plan(1)

  const options = {
    aggregates: [
      {
        type: 'avg',
        field: 'height'
      }
    ],
    outStatistics: [
      {
        statisticType: 'avg',
        onStatisticField: 'Trunk_Diameter'
      }
    ]
  }
  const normalized = normalizeAggregates(options)
  t.deepEquals(normalized, [{ type: 'avg', field: 'Trunk_Diameter', name: 'avg_Trunk_Diameter' }])
})
