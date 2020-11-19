const test = require('tape')
const projectCoordinates = require('../../../lib/helpers/project-coordinates')

test('Do not project coordinates if one is null', t => {
  t.plan(2)
  const transformed = projectCoordinates({ coordinates: [null, 63] })
  t.equal(transformed[0], null, 'not projected')
  t.equal(transformed[1], 63, 'not projected')
})

test('Do not project coordinates if both are null', t => {
  t.plan(2)
  const transformed = projectCoordinates({ coordinates: [null, null] })
  t.equal(transformed[0], null, 'not projected')
  t.equal(transformed[1], null, 'not projected')
})

test('Do not project coordinates if empty array', t => {
  t.plan(2)
  const transformed = projectCoordinates({ coordinates: [] })
  t.equal(transformed[0], undefined, 'not projected')
  t.equal(transformed[1], undefined, 'not projected')
})

test('Do not project coordinates if no toSR', t => {
  t.plan(2)
  const transformed = projectCoordinates({ coordinates: [45, 75] })
  t.equal(transformed[0], 45, 'not projected')
  t.equal(transformed[1], 75, 'not projected')
})

test('Project coordinates correctly', t => {
  t.plan(2)
  const transformed = projectCoordinates({ coordinates: [45, 75], toSR: 'EPSG:3857' })
  t.equal(transformed[0], 5009377.085697311, 'projected correctly')
  t.equal(transformed[1], 12932243.111992031, 'projected correctly')
})

test('Do not project coordinates if target and source spatial reference are the same', t => {
  t.plan(2)
  const transformed = projectCoordinates({ coordinates: [45, 75], fromSR: 'EPSG:4326', toSR: 'EPSG:4326' })
  t.equal(transformed[0], 45, 'projected correctly')
  t.equal(transformed[1], 75, 'projected correctly')
})
