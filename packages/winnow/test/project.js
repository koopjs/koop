'use strict'
const test = require('tape')
const fs = require('fs')
const winnow = require('../src')
const path = require('path')
const features = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'snow.geojson'))).features

test('Project to Web Mercator using 3857', t => {
  t.plan(1)
  const options = {
    projection: 3857,
    limit: 1
  }
  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-11682713.391976157, 4857924.005275469])
})

test('Project to Web Mercator using 3857 and translating to esri', t => {
  t.plan(3)
  const options = {
    projection: 3857,
    limit: 1,
    toEsri: true
  }
  const results = winnow.query(features, options)
  t.equal(results.length, 1)
  t.equal(results[0].geometry.x, -11682713.391976157)
  t.equal(results[0].geometry.y, 4857924.005275469)
})

test('Project to Web Mercator using 3857 with an esri style outSR', t => {
  t.plan(1)
  const options = {
    outSR: {latestWkid: 3857},
    limit: 1
  }
  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-11682713.391976157, 4857924.005275469])
})

test('Project to Web Mercator using 102100 when outSR is just a number', t => {
  t.plan(2)
  const options = {
    outSR: 102100,
    limit: 1,
    toEsri: true
  }
  const results = winnow.query(features, options)
  t.equal(results[0].geometry.x, -11682713.391976157)
  t.equal(results[0].geometry.y, 4857924.005275469)
})

test('Project to Web Mercator using 3857 with a geo filter', t => {
  t.plan(1)
  const options = {
    projection: 3857,
    limit: 1,
    geometry: {
      xmin: -20026376.39,
      ymin: -20048966.10,
      xmax: 20026376.39,
      ymax: 20048966.10,
      spatialReference: {
        wkid: 102100
      }
    }
  }

  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-11682713.391976157, 4857924.005275469])
})

test('Project to Web Mercator using 102100', t => {
  t.plan(1)
  const options = {
    projection: 102100,
    limit: 1
  }
  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-11682713.391976157, 4857924.005275469])
})

test('Project to Web Mercator using WKT', t => {
  t.plan(1)
  const options = {
    projection: 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.017453292519943295]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]',
    limit: 1
  }
  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-11682713.391976157, 4857924.005275469])
})
