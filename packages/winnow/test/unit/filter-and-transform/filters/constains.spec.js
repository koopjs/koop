const test = require('tape')
const contains = require('../../../../lib/filter-and-transform/filters/contains')

test('contains: empty input', t => {
  const result = contains()
  t.equals(result, false)
  t.end()
})

test('contains: empty object input', t => {
  const result = contains({}, {})
  t.equals(result, false)
  t.end()
})

test('contains: null input', t => {
  const result = contains(null, {})
  t.equals(result, false)
  t.end()
})

test('contains: null input', t => {
  const result = contains({}, null)
  t.equals(result, false)
  t.end()
})

test('contains: missing geometry type', t => {
  const result = contains({ coordinates: [44, 84] }, {})
  t.equals(result, false)
  t.end()
})

test('contains: missing coordinates', t => {
  const result = contains({ type: 'Point' }, {})
  t.equals(result, false)
  t.end()
})

test('contains: missing empty coordinates', t => {
  const result = contains({ type: 'Point', coordinates: [] }, {})
  t.equals(result, false)
  t.end()
})

test('contains: missing filter geometry', t => {
  const result = contains({ type: 'Point', coordinates: [44, -84.5] })
  t.equals(result, false)
  t.end()
})

test('contains: true', t => {
  const result = contains({ type: 'Point', coordinates: [44, -84.5] }, {
    type: 'Polygon',
    coordinates: [[[44, -85], [45, -85], [45, -84], [44, -84], [44, -85]]]
  })
  t.equals(result, true)
  t.end()
})

test('contains: false', t => {
  const result = contains({ type: 'Point', coordinates: [0, 0] }, {
    type: 'Polygon',
    coordinates: [[[44, -85], [45, -85], [45, -84], [44, -84], [44, -85]]]
  })
  t.equals(result, false)
  t.end()
})
