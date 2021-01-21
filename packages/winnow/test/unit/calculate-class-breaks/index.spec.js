const test = require('tape')
const calculateClassBreaks = require('../../../lib/calculate-class-breaks/index.js')

test('calculateClassBreaks: no breakCount', t => {
  t.plan(1)
  const features = [
    { properties: { Trunk_Diameter: 13 } },
    { properties: { Trunk_Diameter: 7 } },
    { properties: { Trunk_Diameter: 17 } },
    { properties: { Trunk_Diameter: 25 } },
    { properties: { Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'classes',
    field: 'Trunk_Diameter',
    method: 'equalInterval'
  }

  try {
    calculateClassBreaks(features, classification)
    t.fail('should have thrown')
  } catch (error) {
    t.equals(error.message, 'must supply classification.breakCount')
  }
})

test('calculateClassBreaks: no method', t => {
  t.plan(1)
  const features = [
    { properties: { Trunk_Diameter: 13 } },
    { properties: { Trunk_Diameter: 7 } },
    { properties: { Trunk_Diameter: 17 } },
    { properties: { Trunk_Diameter: 25 } },
    { properties: { Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'classes',
    field: 'Trunk_Diameter'
  }

  try {
    calculateClassBreaks(features, classification)
    t.fail('should have thrown')
  } catch (error) {
    t.equals(error.message, 'must supply classification.method')
  }
})

test('calculateClassBreaks: field not found', t => {
  t.plan(1)
  const features = [
    { properties: { Trunk_Diameter: 13 } },
    { properties: { Trunk_Diameter: 7 } },
    { properties: { Trunk_Diameter: 17 } },
    { properties: { Trunk_Diameter: 25 } },
    { properties: { Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'classes',
    method: 'equalInterval',
    field: 'foodbar',
    breakCount: 3
  }

  try {
    calculateClassBreaks(features, classification)
    t.fail('should have thrown')
  } catch (error) {
    t.equals(error.message, '"foodbar" was not found on any feature.')
  }
})

test('calculateClassBreaks: equal interval', t => {
  t.plan(1)
  const features = [
    { properties: { Trunk_Diameter: 13 } },
    { properties: { Trunk_Diameter: 7 } },
    { properties: { Trunk_Diameter: 17 } },
    { properties: { Trunk_Diameter: 25 } },
    { properties: { Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'classes',
    field: 'Trunk_Diameter',
    method: 'equalInterval',
    breakCount: 3
  }

  const result = calculateClassBreaks(features, classification)
  t.deepEquals(result, [[3, 10.333333333333332], [10.333333333333334, 17.666666666666664], [17.666666666666664, 25]])
})

test('calculateClassBreaks: stddev', t => {
  t.plan(1)
  const features = [
    { properties: { Trunk_Diameter: 13 } },
    { properties: { Trunk_Diameter: 7 } },
    { properties: { Trunk_Diameter: 17 } },
    { properties: { Trunk_Diameter: 25 } },
    { properties: { Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'classes',
    field: 'Trunk_Diameter',
    method: 'stddev',
    stddev_intv: 0.5,
    breakCount: 3
  }

  const result = calculateClassBreaks(features, classification)
  t.deepEquals(result, [[-13.929538, -6.235385], [-6.235384, 1.458768], [1.458769, 9.152922], [9.152923, 16.847077], [16.847078, 24.541231], [24.541232, 32.235384], [32.235385, 39.929538]])
})

test('calculateClassBreaks: natural breaks', t => {
  t.plan(1)
  const features = [
    { properties: { Trunk_Diameter: 13 } },
    { properties: { Trunk_Diameter: 7 } },
    { properties: { Trunk_Diameter: 17 } },
    { properties: { Trunk_Diameter: 25 } },
    { properties: { Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'classes',
    field: 'Trunk_Diameter',
    method: 'naturalBreaks',
    breakCount: 3
  }

  const result = calculateClassBreaks(features, classification)
  t.deepEquals(result, [[3, 7], [8, 17], [18, 25]])
})

test('calculateClassBreaks: quantile', t => {
  t.plan(1)
  const features = [
    { properties: { Trunk_Diameter: 13 } },
    { properties: { Trunk_Diameter: 7 } },
    { properties: { Trunk_Diameter: 17 } },
    { properties: { Trunk_Diameter: 25 } },
    { properties: { Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'classes',
    field: 'Trunk_Diameter',
    method: 'quantile',
    breakCount: 3
  }

  const result = calculateClassBreaks(features, classification)
  t.deepEquals(result, [[3, 7], [8, 17], [18, 25]])
})

test('calculateClassBreaks: normalize by field', t => {
  t.plan(1)
  const features = [
    { properties: { age: 10, Trunk_Diameter: 13 } },
    { properties: { age: 5, Trunk_Diameter: 7 } },
    { properties: { age: 13, Trunk_Diameter: 17 } },
    { properties: { age: 20, Trunk_Diameter: 25 } },
    { properties: { age: 3, Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'classes',
    field: 'Trunk_Diameter',
    method: 'equalInterval',
    breakCount: 3,
    normType: 'field',
    normField: 'age'
  }

  const result = calculateClassBreaks(features, classification)
  t.deepEquals(result, [[1, 1.1333333333333333], [1.1333333333333333, 1.2666666666666666], [1.2666666666666666, 1.4]])
})

test('calculateClassBreaks: normalize by log', t => {
  t.plan(1)
  const features = [
    { properties: { age: 10, Trunk_Diameter: 13 } },
    { properties: { age: 5, Trunk_Diameter: 7 } },
    { properties: { age: 13, Trunk_Diameter: 17 } },
    { properties: { age: 20, Trunk_Diameter: 25 } },
    { properties: { age: 3, Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'classes',
    field: 'Trunk_Diameter',
    method: 'equalInterval',
    breakCount: 3,
    normType: 'log'
  }

  const result = calculateClassBreaks(features, classification)
  t.deepEquals(result, [[0.47712125471966244, 0.7840608393704542], [0.7840608393704543, 1.091000424021246], [1.091000424021247, 1.3979400086720377]])
})

test('calculateClassBreaks: normalize by percent', t => {
  t.plan(1)
  const features = [
    { properties: { age: 10, Trunk_Diameter: 13 } },
    { properties: { age: 5, Trunk_Diameter: 7 } },
    { properties: { age: 13, Trunk_Diameter: 17 } },
    { properties: { age: 20, Trunk_Diameter: 25 } },
    { properties: { age: 3, Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'classes',
    field: 'Trunk_Diameter',
    method: 'equalInterval',
    breakCount: 3,
    normType: 'percent'
  }

  const result = calculateClassBreaks(features, classification)
  t.deepEquals(result, [[4.615384615384616, 15.897435897435901], [15.897435897435903, 27.179487179487186], [27.179487179487186, 38.46153846153847]])
})

test('calculateClassBreaks: null values not used in breaks calculation', t => {
  t.plan(1)
  const features = [
    { properties: { Trunk_Diameter: 13 } },
    { properties: { Trunk_Diameter: null } },
    { properties: { Trunk_Diameter: 7 } },
    { properties: { Trunk_Diameter: 17 } },
    { properties: { Trunk_Diameter: 25 } },
    { properties: { Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'classes',
    field: 'Trunk_Diameter',
    method: 'equalInterval',
    breakCount: 3
  }

  const result = calculateClassBreaks(features, classification)
  t.deepEquals(result, [[3, 10.333333333333332], [10.333333333333334, 17.666666666666664], [17.666666666666664, 25]])
})
