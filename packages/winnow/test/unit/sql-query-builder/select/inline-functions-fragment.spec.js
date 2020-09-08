const test = require('tape')
const compose = require('../../../../lib/sql-query-builder/select/inline-functions-fragment')

test('With a single string function', t => {
  const composed = compose(['round'], 'geometry')
  t.equal(composed, 'round(geometry)', 'composed correctly')
  t.end()
})

test('With multiple string functions', t => {
  const composed = compose(['round', 'flatten'], 'geometry')
  t.equal(composed, 'flatten(round(geometry))', 'composed correctly')
  t.end()
})

test('With a single object function', t => {
  const composed = compose([{ round: 3 }], 'geometry')
  t.equal(composed, 'round(geometry,?)', 'composed correctly')
  t.end()
})

test('With multiple object functions', t => {
  const composed = compose([{ round: 3 }, { flatten: 4 }], 'geometry')
  t.equal(composed, 'flatten(round(geometry,?),?)', 'composed correctly')
  t.end()
})

test('With a string and an object function', t => {
  const composed = compose([{ round: 3 }, 'flatten'], 'geometry')
  t.equal(composed, 'flatten(round(geometry,?))', 'composed correctly')
  t.end()
})
