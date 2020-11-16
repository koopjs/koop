const test = require('tape')
const _ = require('lodash')
const transformCoordinates = require('../../../lib/helpers/transform-coordinates')
const {
  point,
  linestring,
  polygon,
  multipoint,
  multilinestring,
  multipolygon
} = require('../fixtures')

test('transform coordinates, point', t => {
  t.plan(1)
  const transform = (coordinates) => {
    coordinates[0] = 'x'
    coordinates[1] = 'y'
  }
  const input = _.cloneDeep(point.coordinates)
  transformCoordinates(input, {}, transform)
  t.deepEquals(input, ['x', 'y'])
})

test('transform coordinates, line', t => {
  t.plan(1)
  const transform = (coordinates) => {
    coordinates[0] = 'x'
    coordinates[1] = 'y'
  }
  const input = _.cloneDeep(linestring.coordinates)
  transformCoordinates(input, {}, transform)
  t.deepEquals(input, [['x', 'y'], ['x', 'y']])
})

test('transform coordinates, polygon', t => {
  t.plan(1)
  const transform = (coordinates) => {
    coordinates[0] = 'x'
    coordinates[1] = 'y'
  }
  const input = _.cloneDeep(polygon.coordinates)
  transformCoordinates(input, {}, transform)
  t.deepEquals(input, [
    [
      ['x', 'y'],
      ['x', 'y'],
      ['x', 'y'],
      ['x', 'y'],
      ['x', 'y']
    ]
  ])
})

test('transform coordinates, multi-point', t => {
  t.plan(1)
  const transform = (coordinates) => {
    coordinates[0] = 'x'
    coordinates[1] = 'y'
  }
  const input = _.cloneDeep(multipoint.coordinates)
  transformCoordinates(input, {}, transform)
  t.deepEquals(input, [['x', 'y'], ['x', 'y']]
  )
})

test('transform coordinates, multi-linestring', t => {
  t.plan(1)
  const transform = (coordinates) => {
    coordinates[0] = 'x'
    coordinates[1] = 'y'
  }
  const input = _.cloneDeep(multilinestring.coordinates)
  transformCoordinates(input, {}, transform)
  t.deepEquals(input, [
    [
      ['x', 'y'],
      ['x', 'y']
    ],
    [
      ['x', 'y'],
      ['x', 'y']
    ]
  ])
})

test('transform coordinates, multi-polygon', t => {
  t.plan(1)
  const transform = (coordinates) => {
    coordinates[0] = 'x'
    coordinates[1] = 'y'
  }
  const input = _.cloneDeep(multipolygon.coordinates)
  transformCoordinates(input, {}, transform)
  t.deepEquals(input, [
    [
      [
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y']
      ]
    ],
    [
      [
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y']
      ],
      [
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y']
      ]
    ]
  ])
})
