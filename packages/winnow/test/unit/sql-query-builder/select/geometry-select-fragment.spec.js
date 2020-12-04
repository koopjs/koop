const test = require('tape')
const createGeometrySelectFragment = require('../../../../lib/sql-query-builder/select/geometry-select-fragment')

test('createGeometryFragment: no options', t => {
  const geometryFragment = createGeometrySelectFragment()
  t.equal(geometryFragment, 'geometry')
  t.end()
})

test('createGeometryFragment: empty options', t => {
  const geometryFragment = createGeometrySelectFragment({})
  t.equal(geometryFragment, 'geometry')
  t.end()
})

test('createGeometryFragment: outputCrs option', t => {
  const geometryFragment = createGeometrySelectFragment({ outputCrs: { wkid: 3857 } })
  t.equal(geometryFragment, 'project(geometry,?,?) as geometry')
  t.end()
})

test('createGeometryFragment: geometryPrecision option', t => {
  const geometryFragment = createGeometrySelectFragment({ geometryPrecision: 1 })
  t.equal(geometryFragment, 'reducePrecision(geometry,?) as geometry')
  t.end()
})

test('createGeometryFragment: toEsri option', t => {
  const geometryFragment = createGeometrySelectFragment({ toEsri: true })
  t.equal(geometryFragment, 'esriGeometry(geometry) as geometry')
  t.end()
})

test('createGeometryFragment: outputCrs and geometryPrecision options', t => {
  const geometryFragment = createGeometrySelectFragment({ outputCrs: { wkid: 3857 }, geometryPrecision: 1 })
  t.equal(geometryFragment, 'reducePrecision(project(geometry,?,?),?) as geometry')
  t.end()
})

test('createGeometryFragment: outputCrs, geometryPrecision, and toEsri options', t => {
  const geometryFragment = createGeometrySelectFragment({ outputCrs: { wkid: 3857 }, geometryPrecision: 1, toEsri: true })
  t.equal(geometryFragment, 'esriGeometry(reducePrecision(project(geometry,?,?),?)) as geometry')
  t.end()
})

test('createGeometryFragment: outputCrs, and toEsri options', t => {
  const geometryFragment = createGeometrySelectFragment({ outputCrs: { wkid: 3857 }, toEsri: true })
  t.equal(geometryFragment, 'esriGeometry(project(geometry,?,?)) as geometry')
  t.end()
})
