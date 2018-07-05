'use strict'
const test = require('tape')
const winnow = require('../src')
const fixture = require(`./fixtures/trees.json`)

test('With a limit option', t => {
  t.plan(3)
  const options = {
    limit: 10
  }
  const filtered = winnow.query(fixture.features, options)
  t.equal(filtered.length, 10)
  t.equal(filtered[0].properties.Common_Name, 'SOUTHERN MAGNOLIA')
  t.equal(filtered[9].properties.Common_Name, 'WINDMILL PALM')
})

test('With a limit and an offset option', t => {
  t.plan(3)
  const options = {
    limit: 10,
    offset: 11
  }
  const filtered = winnow.query(fixture.features, options)
  t.equal(filtered.length, 10)
  t.equal(filtered[0].properties.Common_Name, 'JACARANDA')
  t.equal(filtered[9].properties.Common_Name, 'LIVE OAK')
})

test('With an offset option, but no limit; should return all features', t => {
  t.plan(1)
  const options = {
    offset: 10
  }
  const filtered = winnow.query(fixture.features, options)
  t.equal(filtered.length, 71132)
})

test('With a limit and an offset larger than returned features, should return no features', t => {
  t.plan(1)
  const options = {
    limit: 10,
    offset: 100000
  }
  const filtered = winnow.query(fixture.features, options)
  t.equal(filtered.length, 0)
})
