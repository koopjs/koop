'use strict'
const test = require('tape')
const fs = require('fs')
const winnow = require('../src')
const path = require('path')
const features = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'trees.geojson')))
const snowFeatures = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'snow.geojson')))
const budgetTable = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'budgetTable.geojson')))

test('Get a sum', (t) => {
  t.plan(1)
  const options = {
    aggregates: [{
      type: 'sum',
      field: 'Trunk_Diameter'
    }]
  }
  const results = winnow.query(features, options)
  t.equal(results.sum_Trunk_Diameter, 850305)
})

test('Use a group by', (t) => {
  t.plan(3)
  const options = {
    aggregates: [{
      type: 'avg',
      field: 'Trunk_Diameter'
    }],
    groupBy: 'Genus',
    order: {}
  }
  const results = winnow.query(features, options)
  t.equal(results.length, 162)
  t.ok(results[0].Genus)
  t.ok(results[0].avg_Trunk_Diameter)
})

test('Get a named aggregate', (t) => {
  t.plan(1)
  const options = {
    aggregates: [{
      type: 'sum',
      field: 'Trunk_Diameter',
      name: 'total_diameter'
    }]
  }
  const results = winnow.query(features, options)
  t.equal(results.total_diameter, 850305)
})

test('Get an aggregate on a field with a space', (t) => {
  t.plan(1)
  const options = {
    aggregates: [{
      type: 'sum',
      field: 'total precip'
    }]
  }
  const results = winnow.query(snowFeatures, options)
  t.equal(results.sum_total_precip, 135.69000000000003)
})

test('Get an aggregate on a field with a /', (t) => {
  t.plan(1)
  const options = {
    aggregates: [{
      type: 'count',
      field: 'Full/Part',
      name: 'Full/Part_COUNT'
    }]
  }
  const results = winnow.query(budgetTable, options)
  t.equal(results['Full/Part_COUNT'], 6885)
})

test('Get the variance of a field', (t) => {
  t.plan(1)
  const options = {
    aggregates: [{
      type: 'var',
      field: 'total precip'
    }]
  }
  const results = winnow.query(snowFeatures, options)
  t.equal(results.var_total_precip, 0.07661480700055341)
})

test('Get an aggregate with a where clause', (t) => {
  t.plan(1)
  const options = {
    aggregates: [{
      type: 'sum',
      field: 'Trunk_Diameter',
      name: 'total_diameter'
    }],
    where: 'Trunk_Diameter > 10'
  }
  const results = winnow.query(features, options)
  t.equal(results.total_diameter, 735026)
})

test('Get multiple aggregates', (t) => {
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
  t.equal(results.total_diameter, 850305)
  t.equal(results.max_diameter, 130)
})

test('Get multiple aggregates specified in the esri way', (t) => {
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
  t.equal(results.total_diameter, 850305)
  t.equal(results.max_diameter, 130)
})

test('Get multiple aggregates specified in the esri way when the input is a string', (t) => {
  t.plan(2)
  const options = {
    outStatistics: JSON.stringify([
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
    ])
  }
  const results = winnow.query(features, options)
  t.equal(results.total_diameter, 850305)
  t.equal(results.max_diameter, 130)
})

test('Get multiple aggregates with a where clause', (t) => {
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
  t.equal(results.total_diameter, 735026)
  t.equal(results.max_diameter, 130)
})
