const test = require('tape')
const createSqlParams = require('../../../lib/sql-query-builder/create-sql-params')

test('createSqlParams: returns features if no options', t => {
  t.plan(1)
  const params = createSqlParams(['feature'])
  t.deepEquals(params, [['feature']])
})

test('createSqlParams: returns features and geometry filter', t => {
  t.plan(1)
  const params = createSqlParams(['feature'], { geometry: 'geom-filter' })
  t.deepEquals(params, [['feature'], 'geom-filter'])
})

test('createSqlParams: returns geometry precision, features and geometry filter', t => {
  t.plan(1)
  const params = createSqlParams(['feature'], {
    geometryPrecision: 'precision',
    geometry: 'geom-filter'
  })
  t.deepEquals(params, ['precision', ['feature'], 'geom-filter'])
})

test('createSqlParams: returns crs, features if input/output crs different', t => {
  t.plan(1)
  const params = createSqlParams(['feature'], {
    inputCrs: { wkid: 4326 },
    outputCrs: { wkid: 3857 }
  })
  t.deepEquals(params, ['EPSG:4326', 'EPSG:3857', ['feature']])
})

test('createSqlParams: does not return crs, if returnGeometry===false', t => {
  t.plan(1)
  const params = createSqlParams(['feature'], {
    returnGeometry: false,
    inputCrs: { wkid: 4326 },
    outputCrs: { wkid: 3857 }
  })
  t.deepEquals(params, [['feature']])
})

test('createSqlParams: does not return crs, if aggregates defined', t => {
  t.plan(1)
  const params = createSqlParams(['feature'], {
    aggregates: true,
    inputCrs: { wkid: 4326 },
    outputCrs: { wkid: 3857 }
  })
  t.deepEquals(params, [['feature']])
})
