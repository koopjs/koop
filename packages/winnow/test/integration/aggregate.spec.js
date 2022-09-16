'use strict'
const test = require('tape')
const winnow = require('../..')
const features = require('./fixtures/trees.json')
const snowFeatures = require('./fixtures/snow.json')

test('Get a sum', t => {
  t.plan(1)
  const options = {
    aggregates: [
      {
        type: 'sum',
        field: 'Trunk_Diameter'
      }
    ]
  }
  const results = winnow.query(features, options)
  t.equal(results.sum_Trunk_Diameter, 263)
})

test('Use a group by', t => {
  t.plan(3)
  const options = {
    aggregates: [
      {
        type: 'avg',
        field: 'Trunk_Diameter'
      }
    ],
    groupBy: 'Genus'
  }
  const results = winnow.query(features, options)
  t.equal(results.length, 6)
  t.ok(results[0].Genus)
  t.ok(results[0].avg_Trunk_Diameter)
})

test('Use an order and a group by', t => {
  t.plan(2)
  const options = {
    aggregates: [
      {
        type: 'avg',
        field: 'Trunk_Diameter'
      }
    ],
    groupBy: 'Genus',
    order: 'avg_Trunk_Diameter DESC'
  }
  const results = winnow.query(features, options)
  t.equal(results.length, 6)
  t.equal(results[0].avg_Trunk_Diameter, 13.166666666666666)
})

test('Use a group by esri style', t => {
  t.plan(3)
  const options = {
    outStatistics: [
      {
        statisticType: 'avg',
        onStatisticField: 'Trunk_Diameter'
      }
    ],
    groupByFieldsForStatistics: ['Genus']
  }
  const results = winnow.query(features, options)
  t.equal(results.length, 6)
  t.ok(results[0].Genus)
  t.ok(results[0].avg_Trunk_Diameter)
})

test('Use multiple group bys', t => {
  t.plan(4)
  const options = {
    aggregates: [
      {
        type: 'avg',
        field: 'Trunk_Diameter'
      }
    ],
    groupBy: ['Genus', 'Common_Name']
  }
  const results = winnow.query(features, options)
  t.equal(results.length, 7)
  t.ok(results[0].Genus)
  t.ok(results[0].Common_Name)
  t.ok(results[0].avg_Trunk_Diameter)
})

test('Use multiple group bys ESRI style', t => {
  t.plan(4)
  const options = {
    aggregates: [
      {
        type: 'avg',
        field: 'Trunk_Diameter'
      }
    ],
    groupByFieldsForStatistics: 'Genus,Common_Name'
  }
  const results = winnow.query(features, options)
  t.equal(results.length, 7)
  t.ok(results[0].Genus)
  t.ok(results[0].Common_Name)
  t.ok(results[0].avg_Trunk_Diameter)
})

test('Use a group by with a where clause', t => {
  t.plan(3)
  const options = {
    aggregates: [
      {
        type: 'avg',
        field: 'Trunk_Diameter'
      }
    ],
    where: 'Trunk_Diameter > 10',
    groupBy: 'Genus'
  }
  const results = winnow.query(features, options)
  t.equal(results.length, 3)
  t.ok(results[0].Genus)
  t.ok(results[0].avg_Trunk_Diameter)
})

test('Get a named aggregate', t => {
  t.plan(1)
  const options = {
    aggregates: [
      {
        type: 'sum',
        field: 'Trunk_Diameter',
        name: 'total_diameter'
      }
    ]
  }
  const results = winnow.query(features, options)
  t.equal(results.total_diameter, 263)
})

test('Get an aggregate on a field with a space', t => {
  t.plan(1)
  const options = {
    aggregates: [
      {
        type: 'sum',
        field: 'total precip'
      }
    ]
  }
  const results = winnow.query(snowFeatures, options)
  t.equal(results.sum_total_precip, 5.300000000000001)
})

test('Get an aggregate on a field with a /', t => {
  t.plan(1)
  const options = {
    aggregates: [
      {
        type: 'count',
        field: 'Test/Field',
        name: 'Test/Field_COUNT'
      }
    ]
  }
  const results = winnow.query(features, options)
  t.equal(results['Test/Field_COUNT'], 2)
})

test('Get the variance of a field', t => {
  t.plan(1)
  const options = {
    aggregates: [
      {
        type: 'var',
        field: 'total precip'
      }
    ]
  }
  const results = winnow.query(snowFeatures, options)
  t.equal(results.var_total_precip, 0.02571923076923076)
})

test('Get an aggregate with a where clause', t => {
  t.plan(1)
  const options = {
    aggregates: [
      {
        type: 'sum',
        field: 'Trunk_Diameter',
        name: 'total_diameter'
      }
    ],
    where: 'Trunk_Diameter > 10'
  }
  const results = winnow.query(features, options)
  t.equal(results.total_diameter, 207)
})

test('Get multiple aggregates', t => {
  t.plan(2)
  const options = {
    aggregates: [
      {
        type: 'sum',
        field: 'Trunk_Diameter',
        name: 'total_diameter'
      },
      {
        type: 'max',
        field: 'Trunk_Diameter',
        name: 'max_diameter'
      }
    ]
  }
  const results = winnow.query(features, options)
  t.equal(results.total_diameter, 263)
  t.equal(results.max_diameter, 27)
})

test('Get multiple aggregates specified in the esri way', t => {
  t.plan(2)
  const options = {
    outStatistics: [
      {
        statisticType: 'sum',
        onStatisticField: 'Trunk_Diameter',
        outStatisticFieldName: 'total_diameter'
      },
      {
        statisticType: 'max',
        onStatisticField: 'Trunk_Diameter',
        outStatisticFieldName: 'max_diameter'
      }
    ]
  }
  const results = winnow.query(features, options)
  t.equal(results.total_diameter, 263)
  t.equal(results.max_diameter, 27)
})

test('Get multiple aggregates with a where clause', t => {
  t.plan(2)
  const options = {
    aggregates: [
      {
        type: 'sum',
        field: 'Trunk_Diameter',
        name: 'total_diameter'
      },
      {
        type: 'max',
        field: 'Trunk_Diameter',
        name: 'max_diameter'
      }
    ],
    where: 'Trunk_Diameter > 10'
  }
  const results = winnow.query(features, options)
  t.equal(results.total_diameter, 207)
  t.equal(results.max_diameter, 27)
})

test('ignore projection when getting an aggregate', t => {
  t.plan(3)
  const options = {
    aggregates: [
      {
        type: 'count',
        field: 'Trunk_Diameter',
        name: 'count_trunk_Diameter'
      }
    ],
    groupBy: 'Trunk_Diameter',
    outSR: 102100
  }
  const results = winnow.query(features, options)
  t.equal(results[0].count_trunk_Diameter, 2)
  t.ok(results[0].Trunk_Diameter)
  t.ok(results[0].count_trunk_Diameter)
})

test('ignore projection when getting an aggregate specified in the esri way', t => {
  t.plan(3)
  const options = {
    outStatistics: [
      {
        statisticType: 'count',
        onStatisticField: 'Trunk_Diameter',
        outStatisticFieldName: 'count_trunk_Diameter'
      }
    ],
    groupByFieldsForStatistics: ['Trunk_Diameter'],
    outSR: 102100
  }
  const results = winnow.query(features, options)
  t.equal(results[0].count_trunk_Diameter, 2)
  t.ok(results[0].Trunk_Diameter)
  t.ok(results[0].count_trunk_Diameter)
})
