const test = require('tape')
const normalizeGeometryFilterSpatialReference = require('../../../lib/normalize-query-options/geometry-filter-spatial-reference')

test('normalize-query-options, geometry-filter-spatial-reference: undefined input', t => {
  t.plan(1)
  const { wkid } = normalizeGeometryFilterSpatialReference()
  t.equal(wkid, 4326)
})

test('normalize-query-options, geometry-filter-spatial-reference: undefined options', t => {
  t.plan(1)
  const { wkid } = normalizeGeometryFilterSpatialReference({})
  t.equal(wkid, 4326)
})

test('normalize-query-options, geometry-filter-spatial-reference: defer to geometry option', t => {
  t.plan(1)
  const options = {
    geometry: '100,200,300,400,3857',
    bbox: '100,200,300,400,4326',
    inSR: '4269'
  }
  const { wkid } = normalizeGeometryFilterSpatialReference(options)
  t.equal(wkid, 3857)
})

test('normalize-query-options, geometry-filter-spatial-reference: defer to bbox option if no geometry', t => {
  t.plan(1)
  const options = {
    bbox: '100,200,300,400,3857',
    inSR: '4269'
  }
  const { wkid } = normalizeGeometryFilterSpatialReference(options)
  t.equal(wkid, 3857)
})

test('normalize-query-options, geometry-filter-spatial-reference: geometry filter bbox missing spatial reference', t => {
  t.plan(1)
  const options = {
    geometry: '100,200,300,400',
    inSR: '4269'
  }
  const { wkid } = normalizeGeometryFilterSpatialReference(options)
  t.equal(wkid, 4269)
})

test('normalize-query-options, geometry-filter-spatial-reference: defer to geometry filter wkid', t => {
  t.plan(1)
  const options = {
    geometry: {
      spatialReference: {
        wkid: 4326
      }
    },
    inSR: '4269'
  }
  const { wkid } = normalizeGeometryFilterSpatialReference(options)
  t.equal(wkid, 4326)
})

test('normalize-query-options, geometry-filter-spatial-reference: inSR string', t => {
  t.plan(1)
  const options = { inSR: '4269' }
  const { wkid } = normalizeGeometryFilterSpatialReference(options)
  t.equal(wkid, 4269)
})

test('normalize-query-options, geometry-filter-spatial-reference: inSR spatialReference object', t => {
  t.plan(1)
  const options = { inSR: { wkid: 4269 } }
  const { wkid } = normalizeGeometryFilterSpatialReference(options)
  t.equal(wkid, 4269)
})
