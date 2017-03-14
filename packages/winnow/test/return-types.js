'use strict'
const test = require('tape')
const winnow = require('../src')
const trees = require('./fixtures/trees.json')
test('Return a feature collection when a collection is passed in', (t) => {
  t.plan(1)
  const options = { where: 'Trunk_Diameter > 120' }
  const input = trees
  const filtered = winnow.query(input, options)
  t.equal(filtered.type, 'FeatureCollection')
})

test('Return a feature array when an array is passed in', (t) => {
  t.plan(2)
  const options = { where: 'Trunk_Diameter > 120' }
  const input = trees.features
  const filtered = winnow.query(input, options)
  t.equal(filtered.type, undefined)
  t.equal(filtered[0].type, 'Feature')
})

test('Return a feature collection when a feature collection is passed into a compiled query', (t) => {
  t.plan(1)
  const options = { where: 'Trunk_Diameter > 120' }
  const query = winnow.prepareQuery(options)
  const filtered = query(trees)
  t.equal(filtered.type, 'FeatureCollection')
})

test('Return a feature array when an array is passed into a compiled query', (t) => {
  t.plan(2)
  const options = { where: 'Trunk_Diameter > 120' }
  const query = winnow.prepareQuery(options)
  const filtered = query(trees.features)
  t.equal(filtered.type, undefined)
  t.equal(filtered[0].type, 'Feature')
})

test('Return an array when a single feature is passed into a compiled query', (t) => {
  t.plan(2)
  const options = { where: 'Trunk_Diameter > 0' }
  const query = winnow.prepareQuery(options)
  const filtered = query(trees.features[0])
  t.equal(filtered.type, undefined)
  t.equal(filtered[0].type, 'Feature')
})

test('Return a feature array when an array is passed into a compiled statement', (t) => {
  t.plan(2)
  const statement = 'SELECT * FROM ? WHERE properties->Trunk_Diameter > 120'
  const query = winnow.prepareSql(statement)
  const filtered = query(trees.features)
  t.equal(filtered.type, undefined)
  t.equal(filtered[0].type, 'Feature')
})

test('Return an array when a single feature is passed into a compiled statement', (t) => {
  t.plan(2)
  const statement = 'SELECT * FROM ? WHERE properties->Trunk_Diameter > 0'
  const query = winnow.prepareSql(statement)
  const filtered = query(trees.features[0])
  t.equal(filtered.type, undefined)
  t.equal(filtered[0].type, 'Feature')
})
