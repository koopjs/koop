'use strict'
const test = require('tape')
const featureParser = require('feature-parser')
const _ = require('highland')
const fs = require('fs')
const winnow = require('../src')
const path = require('path')

test('With a where option', (t) => {
  const options = {
    where: "Genus like '%Quercus%'"
  }
  run('trees', options, 12105, t)
})

test('With a field that has been uppercased', (t) => {
  const options = {
    where: "UPPER(Genus) like '%Quercus%'"
  }
  run('trees', options, 12105, t)
})

test('With the toEsri option', (t) => {
  const options = {
    toEsri: true,
    where: "Genus like '%Quercus%'"
  }
  run('trees', options, 12105, t)
})

test('With the toEsri option and a null geometry', (t) => {
  const options = {
    toEsri: true
  }
  run('nogeom', options, 100, t)
})

test('With a field with a space', (t) => {
  const options = {
    where: '"total precip" > 1'
  }
  run('snow', options, 4, t)
})

test('With esri json', (t) => {
  const options = {
    where: "Genus like '%Quercus%'",
    esri: true
  }
  run('esri', options, 267, t)
})

test('With multiple like clauses', (t) => {
  const options = {
    where: "Genus like '%Quercus%' AND Common_Name like '%Live Oak%' AND Street_Type like '%AVE%'"
  }
  run('trees', options, 3330, t)
})

test('With an in parameter', (t) => {
  const options = {
    where: "Genus IN ('QUERCUS', 'EUGENIA')"
  }
  run('trees', options, 13134, t)
})

test('With an > parameter', (t) => {
  const options = {
    where: 'Trunk_Diameter>10'
  }
  run('trees', options, 35961, t)
})

test('With an >= parameter', (t) => {
  const options = {
    where: 'Trunk_Diameter>=10'
  }
  run('trees', options, 37777, t)
})

test('With an in parameter and a numeric test', (t) => {
  const options = {
    where: "Genus IN ('QUERCUS', 'EUGENIA') AND Trunk_Diameter=10"
  }
  run('trees', options, 409, t)
})

test('With an AND and an OR', (t) => {
  const options = {
    where: "(Genus like '%Quercus%' AND Common_Name like '%Live Oak%') OR Street_Type like '%AVE%'"
  }
  run('trees', options, 31533, t)
})

test('With an equality parameter', (t) => {
  const options = {
    where: "Common_Name = 'LIVE OAK'"
  }
  run('trees', options, 6498, t)
})

test('With date inputs', (t) => {
  const options = {
    where: "Date1 >= '2012-03-14T04:00:00.000Z' AND Date1 <= '2012-03-18T03:59:59.000Z'"
  }
  run('dates', options, 3, t)
})

test('With an esri style envelope', (t) => {
  const options = {
    geometry: {
      xmin: -13155799.066536672,
      ymin: 4047806.77771083,
      xmax: -13143569.142011061,
      ymax: 4050673.16627152,
      spatialReference: {
        wkid: 102100
      }
    }
  }
  run('trees', options, 29744, t)
})

test('With an empty multipolygon', (t) => {
  const options = {
    geometry: {
      xmin: -8968940.494006854,
      ymin: 2943609.5726516787,
      xmax: -8944480.644955631,
      ymax: 2949342.3497730596,
      spatialReference: {
        wkid: 102100
      }
    }
  }
  run('emptyMultiPolygon', options, 1, t)
})

test('Without a spatialReference property on an Esri-style Envelope', (t) => {
  const options = {
    geometry: {
      xmin: -118.18055376275225,
      ymin: 34.14141744789609,
      xmax: -118.07069048150241,
      ymax: 34.162726215637875
    }
  }
  run('trees', options, 29744, t)
})

test('With an array-style geometry', (t) => {
  const options = {
    geometry: [-118.18055376275225, 34.14141744789609, -118.07069048150241, 34.162726215637875]
  }
  run('trees', options, 29744, t)
})

test('With a string-style geometry', (t) => {
  const options = {
    geometry: '-118.18055376275225, 34.14141744789609, -118.07069048150241, 34.162726215637875'
  }
  run('trees', options, 29744, t)
})

test('With a ST_Contains geometry predicate', (t) => {
  const options = {
    geometry: {
      type: 'Polygon',
      coordinates: [[[-118.163, 34.162], [-118.108, 34.162], [-118.108, 34.173], [-118.163, 34.173], [-118.163, 34.162]]]
    },
    spatialPredicate: 'ST_Contains'
  }
  run('trees', options, 9878, t)
})

test('With a ST_Within geometry predicate', (t) => {
  const options = {
    geometry: {
      type: 'Polygon',
      coordinates: [[[-118.163, 34.162], [-118.108, 34.162], [-118.108, 34.173], [-118.163, 34.173], [-118.163, 34.162]]]
    },
    spatialPredicate: 'ST_Within'
  }
  run('states', options, 1, t)
})

test('With a ST_Intersects geometry predicate', (t) => {
  const options = {
    geometry: {
      type: 'LineString',
      coordinates: [[-85.983201784023521, 34.515410848143297, 204.5451898127248], [-121.278821256198796, 39.823566607727578, 1173.189682061974963]]
    },
    spatialPredicate: 'ST_Intersects'
  }
  run('states', options, 9, t)
})

test('With a where and a geometry option', (t) => {
  const options = {
    where: "Genus like '%Quercus%'",
    geometry: {
      type: 'Polygon',
      coordinates: [[[-118.163, 34.162], [-118.108, 34.162], [-118.108, 34.173], [-118.163, 34.173], [-118.163, 34.162]]]
    }
  }
  run('trees', options, 2315, t)
})

function run (data, options, expected, t) {
  t.plan(1)
  const features = require(`./fixtures/${data}.json`).features
  const filtered = winnow.query(features, options)
  t.equal(filtered.length, expected)
}
