'use strict'
const test = require('tape')
const fs = require('fs')
const winnow = require('../src')
const path = require('path')
const features = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'trees.geojson'))).features

test('Select a single field', (t) => {
  t.plan(1)
  const options = {
    fields: ['Trunk_Diameter'],
    limit: 1
  }
  const filtered = winnow.query(features, options)
  const fields = Object.keys(filtered[0].properties)
  t.equal(fields[0], 'Trunk_Diameter')
})

test('Select a single field with string input', (t) => {
  t.plan(1)
  const options = {
    fields: 'Trunk_Diameter',
    limit: 1
  }
  const filtered = winnow.query(features, options)
  const fields = Object.keys(filtered[0].properties)
  t.equal(fields[0], 'Trunk_Diameter')
})

test('Select multiple fields', (t) => {
  t.plan(2)
  const options = {
    fields: ['Trunk_Diameter', 'Genus'],
    limit: 1
  }
  const filtered = winnow.query(features, options)
  const fields = Object.keys(filtered[0].properties)
  t.equal(fields[0], 'Trunk_Diameter')
  t.equal(fields[1], 'Genus')
})

test('Select multiple fields with string input', (t) => {
  t.plan(2)
  const options = {
    fields: 'Trunk_Diameter, Genus',
    limit: 1
  }
  const filtered = winnow.query(features, options)
  const fields = Object.keys(filtered[0].properties)
  t.equal(fields[0], 'Trunk_Diameter')
  t.equal(fields[1], 'Genus')
})
