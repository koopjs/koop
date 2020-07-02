'use strict'
const test = require('tape')
const _ = require('lodash')
const winnow = require('../')
const fixture = require('./fixtures/trees.json')

test('With a limit of 10, order by OBJECTID ASC', t => {
  t.plan(2)
  const options = {
    limit: 10,
    order: 'OBJECTID ASC'
  }
  const filtered = winnow.query(fixture.features, options)
  t.equals(filtered[0].properties.OBJECTID, 1)
  t.equals(filtered[1].properties.OBJECTID, 2)
})

test('With a limit of 10, toEsri, and an idField, order by OBJECTID ASC', t => {
  t.plan(2)
  const options = {
    limit: 10,
    order: 'OBJECTID',
    toEsri: true,
    collection: { metadata: { idField: 'OBJECTID' } }
  }
  const filtered = winnow.query(fixture.features, options)
  t.equals(filtered.features[0].attributes.OBJECTID, 1)
  t.equals(filtered.features[1].attributes.OBJECTID, 2)
})

test('With a limit of 10, toEsri, and an idField, order by OBJECTID DESC', t => {
  t.plan(2)
  const options = {
    limit: 10,
    order: 'OBJECTID DESC',
    toEsri: true,
    collection: { metadata: { idField: 'OBJECTID' } }
  }
  const filtered = winnow.query(fixture.features, options)
  t.equals(filtered.features[0].attributes.OBJECTID, 82335)
  t.equals(filtered.features[1].attributes.OBJECTID, 82334)
})

test('With a limit of 10, toEsri and no idField specified (winnow generates OBJECTID), order by OBJECTID DESC', t => {
  t.plan(3)
  const options = {
    limit: 10,
    order: 'OBJECTID DESC',
    toEsri: true
  }
  // Clone fixture so it isn't mutated
  const filtered = winnow.query(_.cloneDeep(fixture).features, options)
  t.ok(filtered[0].attributes.OBJECTID > filtered[1].attributes.OBJECTID)
  t.ok(filtered[1].attributes.OBJECTID > filtered[2].attributes.OBJECTID)
  t.ok(filtered[2].attributes.OBJECTID > filtered[3].attributes.OBJECTID)
})

test('With a limit of 10 and toEsri and no idField specified, order by Species DESC', t => {
  t.plan(2)
  const options = {
    limit: 10,
    order: 'Species DESC',
    toEsri: true
  }
  const features = require('./fixtures/trees.json').features
  const filtered = winnow.query(features, options)
  t.equal(filtered[0].attributes.Species, 'ugandense')
  t.equal(filtered[1].attributes.Species, 'sinensis')
})
