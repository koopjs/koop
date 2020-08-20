const test = require('tape')
const projectCoordinates = require('../../lib/geometry/project-coordinates')

test('Do not project coordinates if one is null', t => {
  t.plan(2)
  const transformed = projectCoordinates([null, 63])
  t.equal(transformed[0], null, 'not projected')
  t.equal(transformed[1], 63, 'not projected')
})

test('Do not project coordinates if both are null', t => {
  t.plan(2)
  const transformed = projectCoordinates([null, 63])
  t.equal(transformed[0], null, 'not projected')
  t.equal(transformed[1], 63, 'not projected')
})

test('Do not project coordinates if empty array', t => {
  t.plan(2)
  const transformed = projectCoordinates([])
  t.equal(transformed[0], undefined, 'not projected')
  t.equal(transformed[1], undefined, 'not projected')
})

test('Project coordinates correctly', t => {
  t.plan(2)
  const transformed = projectCoordinates([0, 63])
  t.equal(transformed[0], 0, 'projected correctly')
  t.equal(transformed[1], 9100250.907059547, 'projected correctly')
})

test('Do not project coordinates if target and source spatial reference are the same', t => {
  t.plan(2)
  const transformed = projectCoordinates([0, 63], { fromSR: 'EPSG:4326', toSR: 'EPSG:4326' })
  t.equal(transformed[0], 0, 'projected correctly')
  t.equal(transformed[1], 63, 'projected correctly')
})
