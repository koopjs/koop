'use strict'
const test = require('tape')
const featureParser = require('feature-parser')
const _ = require('highland')
const fs = require('fs')
const winnow = require('../')
const path = require('path')

test('With a where option', t => {
  const where = `Genus like '%Quercus%'`
  run('trees', where, null, null, 12105, t)
})

test('With multiple like clauses', t => {
  const where = `Genus like '%Quercus%' AND Common_Name like '%Live Oak%' AND Street_Type like '%AVE%'`
  run('trees', where, null, null, 3330, t)
})

test('With an in parameter', t => {
  const where = `Genus IN ('QUERCUS', 'EUGENIA')`
  run('trees', where, null, null, 13134, t)
})

test('With an > parameter', t => {
  const where = `Trunk_Diameter>10`
  run('trees', where, null, null, 35961, t)
})

test('With an >= parameter', t => {
  const where = `Trunk_Diameter>=10`
  run('trees', where, null, null, 37777, t)
})

test('With an in parameter and a numeric test', t => {
  const where = `Genus IN ('QUERCUS', 'EUGENIA') AND Trunk_Diameter=10`
  run('trees', where, null, null, 409, t)
})

test('With an AND and an OR', t => {
  const where = `(Genus like '%Quercus%' AND Common_Name like '%Live Oak%') OR Street_Type like '%AVE%'`
  run('trees', where, null, null, 31533, t)
})

test('With an equality parameter', t => {
  const where = `Common_Name = 'LIVE OAK'`
  run('trees', where, null, null, 6498, t)
})

test('With an esri style envelope', t => {
  const geometry = {
    xmin: -13155799.066536672,
    ymin: 4047806.77771083,
    xmax: -13143569.142011061,
    ymax: 4050673.16627152,
    spatialReference: {
      wkid: 102100
    }
  }
  run('trees', null, geometry, null, 29744, t)
})

test('With a ST_Within geometry predicate', t => {
  const geometry = {
    type: 'Polygon',
    coordinates: [[[-118.163, 34.162], [-118.108, 34.162], [-118.108, 34.173], [-118.163, 34.173], [-118.163, 34.162]]],
    predicate: 'ST_Within'
  }
  run('trees', null, geometry, null, 9878, t)
})

test('With a ST_Contains geometry predicate', t => {
  const geometry = {
    type: 'Polygon',
    coordinates: [[[-118.163, 34.162], [-118.108, 34.162], [-118.108, 34.173], [-118.163, 34.173], [-118.163, 34.162]]],
    predicate: 'ST_Contains'
  }
  run('states', null, geometry, null, 1, t)
})

test('With a ST_Intersects geometry predicate', t => {
  const geometry = {
    type: 'LineString',
    coordinates: [[-85.983201784023521, 34.515410848143297, 204.5451898127248], [-121.278821256198796, 39.823566607727578, 1173.189682061974963]],
    predicate: 'ST_Intersects'
  }
  run('states', null, geometry, null, 9, t)
})

test('With a where and a geometry option', t => {
  const where = `Genus like '%Quercus%'`
  const geometry = {
    type: 'Polygon',
    coordinates: [[[-118.163, 34.162], [-118.108, 34.162], [-118.108, 34.173], [-118.163, 34.173], [-118.163, 34.162]]]
  }
  run('trees', where, geometry, null, 2315, t)
})

function run (data, where, geometry, options, expected, t) {
  t.plan(1)
  const trees = path.join(__dirname, 'fixtures', `${data}.min.geojson`)
  _(fs.createReadStream(trees))
  .pipe(featureParser.parse())
  .map(JSON.parse)
  .batch(80000)
  .map(features => { return winnow(features, where, geometry) })
  .errors(e => {
    return t.end()
  })
  .sequence()
  .toArray(features => {
    t.equal(features.length, expected)
  })
}
