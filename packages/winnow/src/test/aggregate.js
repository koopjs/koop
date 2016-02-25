'use strict'
const test = require('tape')
const fs = require('fs')
const winnow = require('../')
const path = require('path')
const features = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', `trees.min.geojson`)))

test('Get a sum', t => {
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

test('Get a named aggregate', t => {
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

test('Get an aggregate with a where clause', t => {
  t.plan(1)
  const options = {
    aggregates: [{
      type: 'sum',
      field: 'Trunk_Diameter',
      name: 'total_diameter'
    }],
    where: `Trunk_Diameter > 10`
  }
  const results = winnow.query(features, options)
  t.equal(results.total_diameter, 735026)
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
  t.equal(results.total_diameter, 850305)
  t.equal(results.max_diameter, 130)
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
    where: `Trunk_Diameter > 10`
  }
  const results = winnow.query(features, options)
  t.equal(results.total_diameter, 735026)
  t.equal(results.max_diameter, 130)
})
