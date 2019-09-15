'use strict'
const test = require('tape')
const where = require('../src/where')

test('Transform a simple equality predicate', t => {
  t.plan(1)
  const options = {
    where: 'foo=\'bar\''
  }
  const whereFragment = where.createClause(options)
  t.equals(whereFragment, 'properties->`foo` = \'bar\'')
})

test('Transform a simple but inverse predicate', t => {
  t.plan(1)
  const options = {
    where: '\'bar\'=foo'
  }
  const whereFragment = where.createClause(options)
  t.equals(whereFragment, '\'bar\' = properties->`foo`')
})

test('Transform a simple predicate', t => {
  t.plan(1)
  const options = {
    where: '\'bar\'=foo'
  }
  const whereFragment = where.createClause(options)
  t.equals(whereFragment, '\'bar\' = properties->`foo`')
})

test('Transform a simple predicate to Esri flavor', t => {
  t.plan(1)
  const options = {
    where: 'foo=\'bar\'',
    esri: true
  }
  const whereFragment = where.createClause(options)
  t.equals(whereFragment, 'attributes->`foo` = \'bar\'')
})

test('Transform a simple but inverse predicate to Esri flavor', t => {
  t.plan(1)
  const options = {
    where: '\'bar\'=foo',
    esri: true
  }
  const whereFragment = where.createClause(options)
  t.equals(whereFragment, '\'bar\' = attributes->`foo`')
})

test('Transform a predicate with OBJECTID and no metadata fields to user-defined function', t => {
  t.plan(1)
  const options = {
    where: 'OBJECTID=1234'
  }
  const whereFragment = where.createClause(options)
  t.equals(whereFragment, 'hashedObjectIdComparator(properties, geometry, 1234, \'=\')=true')
})

test('Transform a predicate with OBJECTID and no metadata fields to Esri flavor with user-defined function', t => {
  t.plan(1)
  const options = {
    where: 'OBJECTID=1234',
    esri: true
  }
  const whereFragment = where.createClause(options)
  t.equals(whereFragment, 'hashedObjectIdComparator(attributes, geometry, 1234, \'=\')=true')
})

test('Transform an inverse predicate with OBJECTID and no metadata fields to user-defined function', t => {
  t.plan(1)
  const options = {
    where: '1234>OBJECTID'
  }
  const whereFragment = where.createClause(options)
  t.equals(whereFragment, 'hashedObjectIdComparator(properties, geometry, 1234, \'<=\')=true')
})

test('Transform an inverse predicate with OBJECTID and no metadata fields to Esri flavor with user-defined function', t => {
  t.plan(1)
  const options = {
    where: '1234>OBJECTID',
    esri: true
  }
  const whereFragment = where.createClause(options)
  t.equals(whereFragment, 'hashedObjectIdComparator(attributes, geometry, 1234, \'<=\')=true')
})

test('Transform a predicate with OBJECTID and metadata fields that define the OBJECTID', t => {
  t.plan(1)
  const options = {
    where: 'OBJECTID=1234',
    collection: {
      metadata: {
        fields: [{ name: 'OBJECTID' }]
      }
    }
  }
  const whereFragment = where.createClause(options)
  t.equals(whereFragment, 'properties->`OBJECTID` = 1234')
})
