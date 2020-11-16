const test = require('tape')
const toEsriGeometry = require('../../../../lib/filter-and-transform/transforms/to-esri-geometry')
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
} = require('../../fixtures')

test('toEsriGeometry: no geometry', t => {
  t.plan(1)
  const transformed = toEsriGeometry()
  t.equals(transformed, null)
})

test('toEsriGeometry: no geometry type', t => {
  t.plan(1)
  const transformed = toEsriGeometry({})
  t.equals(transformed, null)
})

test('toEsriGeometry: point', t => {
  t.plan(1)
  const transformed = toEsriGeometry(point)
  t.deepEquals(transformed, esriPoint)
})

test('toEsriGeometry: linestring', t => {
  t.plan(1)
  const transformed = toEsriGeometry(linestring)
  t.deepEquals(transformed, esriLinestring)
})

test('toEsriGeometry: polygon', t => {
  t.plan(1)
  const transformed = toEsriGeometry(polygon)
  t.deepEquals(transformed, esriPolygon)
})

test('toEsriGeometry: multipoint', t => {
  t.plan(1)
  const transformed = toEsriGeometry(multipoint)
  t.deepEquals(transformed, esriMultiPoint)
})

test('toEsriGeometry: multilinestring', t => {
  t.plan(1)
  const transformed = toEsriGeometry(multilinestring)
  t.deepEquals(transformed, esriMulitLinestring)
})

test('toEsriGeometry: multipolygon', t => {
  t.plan(1)
  const transformed = toEsriGeometry(multipolygon)
  t.deepEquals(transformed, esriMultiPolygon)
})

test('toEsriGeometry: unsupported type', t => {
  t.plan(1)
  const result = toEsriGeometry({ type: 'unsupported' })
  t.equals(result, null)
})
