const test = require('tape')
const convertToEsri = require('../../../lib/geometry/convert-to-esri')
const {
  point,
  linestring,
  polygon,
  multipoint,
  multilinestring,
  multipolygon,
  esriPoint,
  esriLinestring,
  esriPolygon,
  esriMultiPoint,
  esriMulitLinestring,
  esriMultiPolygon
} = require('./fixtures')

test('convertToEsri: point', t => {
  t.plan(1)
  const transformed = convertToEsri(point)
  t.deepEquals(transformed, esriPoint)
})

test('convertToEsri: linestring', t => {
  t.plan(1)
  const transformed = convertToEsri(linestring)
  t.deepEquals(transformed, esriLinestring)
})

test('convertToEsri: polygon', t => {
  t.plan(1)
  const transformed = convertToEsri(polygon)
  t.deepEquals(transformed, esriPolygon)
})

test('convertToEsri: multipoint', t => {
  t.plan(1)
  const transformed = convertToEsri(multipoint)
  t.deepEquals(transformed, esriMultiPoint)
})

test('convertToEsri: multilinestring', t => {
  t.plan(1)
  const transformed = convertToEsri(multilinestring)
  t.deepEquals(transformed, esriMulitLinestring)
})

test('convertToEsri: multipolygon', t => {
  t.plan(1)
  const transformed = convertToEsri(multipolygon)
  t.deepEquals(transformed, esriMultiPolygon)
})
