const test = require('tape')
const _ = require('lodash')
const rewind = require('geojson-rewind')
const {
  ringIsClockwise,
  arraysIntersectArrays,
  coordinatesContainPoint,
  coordinatesContainCoordinates
} = require('../../../lib/geometry/utils')

const {
  polygon
} = require('./fixtures')

test('geometry-utils: ringIsClockwise === false', t => {
  t.plan(1)
  const result = ringIsClockwise(polygon.coordinates[0])
  t.equals(result, false)
})

test('geometry-utils: ringIsClockwise === true', t => {
  t.plan(1)
  const rewoundPolygon = rewind(_.cloneDeep(polygon), true)
  const result = ringIsClockwise(rewoundPolygon.coordinates[0])
  t.equals(result, true)
})

test('geometry-utils: arraysIntersectArrays, false', t => {
  t.plan(1)
  const coordinateArr1 = [
    [100.0, 0.0],
    [101.0, 0.0],
    [101.0, 1.0],
    [100.0, 1.0],
    [100.0, 0.0]
  ]
  const coordinateArr2 = [
    [100.2, 0.2],
    [100.2, 0.8],
    [100.8, 0.8],
    [100.8, 0.2],
    [100.2, 0.2]
  ]
  const result = arraysIntersectArrays(coordinateArr1, coordinateArr2)
  t.equals(result, false)
})

test('geometry-utils: arraysIntersectArrays, true', t => {
  t.plan(1)
  const coordinateArr1 = [
    [100.0, 0.0],
    [101.0, 0.0],
    [101.0, 1.0],
    [100.0, 1.0],
    [100.0, 0.0]
  ]
  const coordinateArr2 = [
    [100.2, 0.2],
    [101.2, 0.8],
    [100.8, 0.8],
    [100.8, 0.2],
    [100.2, 0.2]
  ]
  const result = arraysIntersectArrays(coordinateArr1, coordinateArr2)
  t.equals(result, true)
})

test('geometry-utils: coordinatesContainCoordinates, true', t => {
  t.plan(1)
  const coordinateArr1 = [
    [100.0, 0.0],
    [101.0, 0.0],
    [101.0, 1.0],
    [100.0, 1.0],
    [100.0, 0.0]
  ]
  const coordinateArr2 = [
    [100.2, 0.2],
    [100.2, 0.8],
    [100.8, 0.8],
    [100.8, 0.2],
    [100.2, 0.2]
  ]
  const result = coordinatesContainCoordinates(coordinateArr1, coordinateArr2)
  t.equals(result, true)
})

test('geometry-utils: coordinatesContainCoordinates, false due to intersection', t => {
  t.plan(1)
  const coordinateArr1 = [
    [100.0, 0.0],
    [101.0, 0.0],
    [101.0, 1.0],
    [100.0, 1.0],
    [100.0, 0.0]
  ]
  const coordinateArr2 = [
    [100.2, 0.2],
    [101.2, 0.8],
    [100.8, 0.8],
    [100.8, 0.2],
    [100.2, 0.2]
  ]
  const result = coordinatesContainCoordinates(coordinateArr1, coordinateArr2)
  t.equals(result, false)
})

test('geometry-utils: coordinatesContainCoordinates, false due to being outside', t => {
  t.plan(1)
  const coordinateArr1 = [
    [100.0, 0.0],
    [101.0, 0.0],
    [101.0, 1.0],
    [100.0, 1.0],
    [100.0, 0.0]
  ]
  const coordinateArr2 = [
    [102.0, 2.0],
    [103.0, 2.0],
    [103.0, 3.0],
    [102.0, 3.0],
    [102.0, 2.0]
  ]
  const result = coordinatesContainCoordinates(coordinateArr1, coordinateArr2)
  t.equals(result, false)
})

test('geometry-utils: coordinatesContainPoint, true', t => {
  t.plan(1)
  const coordinateArr1 = [
    [100.0, 0.0],
    [101.0, 0.0],
    [101.0, 1.0],
    [100.0, 1.0],
    [100.0, 0.0]
  ]
  const result = coordinatesContainPoint(coordinateArr1, [100.8, 0.8])
  t.equals(result, true)
})

test('geometry-utils: coordinatesContainPoint, false', t => {
  t.plan(1)
  const coordinateArr1 = [
    [100.0, 0.0],
    [101.0, 0.0],
    [101.0, 1.0],
    [100.0, 1.0],
    [100.0, 0.0]
  ]
  const result = coordinatesContainPoint(coordinateArr1, [100.8, 1.8])
  t.equals(result, false)
})
