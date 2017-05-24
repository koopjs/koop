'use strict'
const test = require('tape')
const winnow = require('../src')
const features = require('./fixtures/snow.json').features
const polygonFeatures = require('./fixtures/polygon.json').features
const multiPolyFeatures = require('./fixtures/multipolygon.json').features

test('Project to Web Mercator using 3857', t => {
  t.plan(2)
  const options = {
    projection: 3857,
    limit: 1
  }
  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-11682713.391976157, 4857924.005275469])
  t.equal(results[0].geometry.spatialReference, undefined)
})

test('Project to Web Mercator using 3857 and reduce the precision', t => {
  t.plan(2)
  const options = {
    projection: 3857,
    limit: 1,
    geometryPrecision: 3
  }
  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-11682713.392, 4857924.005])
  t.equal(results[0].geometry.spatialReference, undefined)
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

test('Project a polygon to Web Mercator using 3857 and translating to esri', t => {
  t.plan(2)
  const options = {
    projection: 3857,
    limit: 1,
    toEsri: true
  }
  const results = winnow.query(polygonFeatures, options)

  t.equal(results.length, 1)
  t.deepEqual(results[0].geometry.rings, [
    [
      [-13247454.246160466, 6496535.908013698],
      [-11408073.597505985, 6985732.8890388245],
      [-9216471.12251341, 4813698.293287256],
      [-10214432.963804673, 3874440.0897190133],
      [-12934368.178304385, 3424378.867175897],
      [-13247454.246160466, 6496535.908013698]
    ]
  ])
})

test('Project a multi-polygon to Web Mercator using 3857 and translating to esri', t => {
  t.plan(3)
  const options = {
    projection: 3857,
    limit: 1,
    toEsri: true
  }
  const results = winnow.query(multiPolyFeatures, options)

  t.equal(results.length, 1)
  const expected = [
    [-13247454.246160466, 6496535.908013698],
    [-11408073.597505985, 6985732.8890388245],
    [-9216471.12251341, 4813698.293287256],
    [-10214432.963804673, 3874440.0897190133],
    [-12934368.178304385, 3424378.867175897],
    [-13247454.246160466, 6496535.908013698]
  ]
  t.deepEqual(results[0].geometry.rings[0][0], expected[0])
  t.deepEqual(results[0].geometry.rings[1][0], expected[0])
})

test('Project to Web Mercator using 3857 with an esri style outSR', t => {
  t.plan(1)
  const options = {
    outSR: { latestWkid: 3857 },
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
