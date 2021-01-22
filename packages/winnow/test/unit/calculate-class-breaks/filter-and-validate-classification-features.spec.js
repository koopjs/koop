const test = require('tape')
const filterAndValidateClassificationValues = require('../../../lib/calculate-class-breaks/filter-and-validate-classification-features')

test('filterAndValidateClassificationValues: success', spec => {
  const features = [
    { properties: { rain: 0.1 } },
    { properties: { rain: '0.1' } },
    { properties: { rain: 0 } },
    { properties: { } }
  ]
  const result = filterAndValidateClassificationValues(features, 'rain')
  spec.deepEquals(result, [0.1, 0.1, 0])
  spec.end()
})

test('filterAndValidateClassificationValues: should throw error', spec => {
  const features = [
    { properties: { rain: 0.1 } },
    { properties: { rain: 'foo' } },
    { properties: { rain: 0 } },
    { properties: { } }
  ]

  try {
    filterAndValidateClassificationValues(features, 'rain')
    spec.fail('should throw error')
  } catch (error) {
    spec.equals(error.message, 'Cannot use non-numeric classificationField, rain: "foo"')
  }
  spec.end()
})
