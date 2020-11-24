const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const modulePath = '../../../lib/query/classification-query'

test('classificationQuery, unsupported classification type', t => {
  const standardQuerySpy = sinon.spy(function () {
    return { features: ['feature1', 'feature2'] }
  })

  const classificationQuery = proxyquire(modulePath, {
    './standard-query': standardQuerySpy
  })

  try {
    classificationQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', {
      foo: 'bar',
      collection: {},
      classification: { }
    })
    t.fail('classificationQuery should have failed')
  } catch (error) {
    t.equals(error.message, 'unacceptable classification type: undefined')
    t.ok(standardQuerySpy.calledOnce)
    t.deepEquals(standardQuerySpy.firstCall.args, [
      ['feature1', 'feature2', 'feature3'],
      'SQL statement',
      { foo: 'bar', collection: {}, classification: {} }
    ])
  }
  t.end()
})

test('classificationQuery, unsupported breakCount', t => {
  const standardQuerySpy = sinon.spy(function () {
    return { features: ['feature1', 'feature2'] }
  })

  const classificationQuery = proxyquire(modulePath, {
    './standard-query': standardQuerySpy
  })

  try {
    classificationQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', {
      foo: 'bar',
      collection: {},
      classification: { type: 'classes', breakCount: 0 }
    })
    t.fail('classificationQuery should have failed')
  } catch (error) {
    t.equals(error.message, 'breakCount must be positive: 0')
    t.ok(standardQuerySpy.calledOnce)
    t.deepEquals(standardQuerySpy.firstCall.args, [
      ['feature1', 'feature2', 'feature3'],
      'SQL statement',
      { foo: 'bar', collection: {}, classification: { type: 'classes', breakCount: 0 } }
    ])
  }
  t.end()
})

test('classificationQuery, classes classification type', t => {
  const standardQuerySpy = sinon.spy(function () {
    return { features: ['feature1', 'feature2'] }
  })

  const generateBreaksSpy = sinon.spy({
    calculateClassBreaks: () => {
      return 'classification results'
    }
  })

  const classificationQuery = proxyquire(modulePath, {
    './standard-query': standardQuerySpy,
    '../generateBreaks/index': generateBreaksSpy
  })

  const result = classificationQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', {
    foo: 'bar',
    collection: {},
    classification: { type: 'classes', breakCount: 1 }
  })
  t.deepEquals(result, 'classification results')
  t.ok(standardQuerySpy.calledOnce)
  t.deepEquals(standardQuerySpy.firstCall.args, [
    ['feature1', 'feature2', 'feature3'],
    'SQL statement',
    { foo: 'bar', collection: {}, classification: { type: 'classes', breakCount: 1 } }
  ])
  t.ok(generateBreaksSpy.calculateClassBreaks.calledOnce)
  t.deepEquals(generateBreaksSpy.calculateClassBreaks.firstCall.args, [
    ['feature1', 'feature2'],
    { type: 'classes', breakCount: 1 }
  ])
  t.end()
})

test('classificationQuery, classes classification type', t => {
  const standardQuerySpy = sinon.spy(function () {
    if (standardQuerySpy.callCount === 1) {
      return { features: ['feature1', 'feature2'] }
    }
    return 'classification query result'
  })

  const generateBreaksSpy = sinon.spy({
    calculateUniqueValueBreaks: () => {
      return { options: { aggregates: true, groupBy: true }, query: 'SQL classification statement' }
    }
  })

  const classificationQuery = proxyquire(modulePath, {
    './standard-query': standardQuerySpy,
    '../generateBreaks/index': generateBreaksSpy
  })

  const result = classificationQuery(['feature1', 'feature2', 'feature3'], 'SQL filter statement', {
    foo: 'bar',
    collection: {},
    classification: { type: 'unique' }
  })
  t.deepEquals(result, 'classification query result')
  t.ok(standardQuerySpy.calledTwice)
  t.deepEquals(standardQuerySpy.firstCall.args, [
    ['feature1', 'feature2', 'feature3'],
    'SQL filter statement',
    { foo: 'bar', collection: {}, classification: { type: 'unique' } }
  ])
  t.deepEquals(standardQuerySpy.secondCall.args, [
    ['feature1', 'feature2'],
    'SQL classification statement',
    { aggregates: true, groupBy: true, skipLimitHandling: true }
  ])
  t.ok(generateBreaksSpy.calculateUniqueValueBreaks.calledOnce)
  t.end()
})
