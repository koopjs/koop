const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const modulePath = '../../lib/execute-query'
const { finishQuery } = require('../../lib/execute-query')

test('finishQuery: groupBy option', t => {
  const result = finishQuery(['feature1', 'feature2'], { groupBy: true })
  t.deepEquals(result, ['feature1', 'feature2'])
  t.end()
})

test('finishQuery: aggregates option', t => {
  const result = finishQuery(['feature1', 'feature2'], { aggregates: true })
  t.deepEquals(result, 'feature1')
  t.end()
})

test('finishQuery: collection option', t => {
  const result = finishQuery(['feature1', 'feature2'], { collection: {} })
  t.deepEquals(result, { features: ['feature1', 'feature2'] })
  t.end()
})

test('finishQuery: no options', t => {
  const result = finishQuery(['feature1', 'feature2'], {})
  t.deepEquals(result, ['feature1', 'feature2'])
  t.end()
})

test('standardQuery, no options', t => {
  const filterAndTransformSpy = sinon.spy({
    filterAndTransform: () => {
      return ['feature1', 'feature2']
    }
  })

  const queryBuilderSpy = sinon.spy({
    params: () => {
      return ['params1', 'params2']
    }
  })

  const { standardQuery } = proxyquire(modulePath, {
    './filter-and-transform': filterAndTransformSpy,
    './sql-query-builder': queryBuilderSpy
  })

  const result = standardQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', { foo: 'bar' })
  t.deepEquals(result, ['feature1', 'feature2'])
  t.ok(queryBuilderSpy.params.calledOnce)
  t.deepEquals(queryBuilderSpy.params.firstCall.args, [['feature1', 'feature2', 'feature3'], { foo: 'bar' }])
  t.ok(filterAndTransformSpy.filterAndTransform.calledOnce)
  t.deepEquals(filterAndTransformSpy.filterAndTransform.firstCall.args, ['SQL statement', ['params1', 'params2']])
  t.end()
})

test('standardQuery, limit option', t => {
  const filterAndTransformSpy = sinon.spy({
    filterAndTransform: () => {
      return ['feature1', 'feature2']
    }
  })

  const queryBuilderSpy = sinon.spy({
    params: () => {
      return ['params1', 'params2']
    }
  })

  const { standardQuery } = proxyquire(modulePath, {
    './filter-and-transform': filterAndTransformSpy,
    './sql-query-builder': queryBuilderSpy
  })

  const result = standardQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', { foo: 'bar', limit: 2 })
  t.deepEquals(result, ['feature1'])
  t.ok(queryBuilderSpy.params.calledOnce)
  t.deepEquals(queryBuilderSpy.params.firstCall.args, [['feature1', 'feature2', 'feature3'], { foo: 'bar', limit: 2 }])
  t.ok(filterAndTransformSpy.filterAndTransform.calledOnce)
  t.deepEquals(filterAndTransformSpy.filterAndTransform.firstCall.args, ['SQL statement', ['params1', 'params2']])
  t.end()
})

test('standardQuery, limit and collection option', t => {
  const filterAndTransformSpy = sinon.spy({
    filterAndTransform: () => {
      return ['feature1', 'feature2']
    }
  })

  const queryBuilderSpy = sinon.spy({
    params: () => {
      return ['params1', 'params2']
    }
  })

  const { standardQuery } = proxyquire(modulePath, {
    './filter-and-transform': filterAndTransformSpy,
    './sql-query-builder': queryBuilderSpy
  })

  const result = standardQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', { foo: 'bar', limit: 2, collection: {} })
  t.deepEquals(result, { metadata: { limitExceeded: true }, features: ['feature1'] })
  t.ok(queryBuilderSpy.params.calledOnce)
  t.deepEquals(queryBuilderSpy.params.firstCall.args, [
    ['feature1', 'feature2', 'feature3'],
    { foo: 'bar', limit: 2, collection: { metadata: { limitExceeded: true }, features: ['feature1'] } }
  ])
  t.ok(filterAndTransformSpy.filterAndTransform.calledOnce)
  t.deepEquals(filterAndTransformSpy.filterAndTransform.firstCall.args, ['SQL statement', ['params1', 'params2']])
  t.end()
})

test('aggregateQuery', t => {
  const filterAndTransformSpy = sinon.spy({
    filterAndTransform: () => {
      return ['feature1', 'feature2']
    }
  })

  const queryBuilderSpy = sinon.spy({
    params: () => {
      return ['params1', 'params2']
    }
  })

  const { aggregateQuery } = proxyquire(modulePath, {
    './filter-and-transform': filterAndTransformSpy,
    './sql-query-builder': queryBuilderSpy
  })

  const result = aggregateQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', { foo: 'bar' })
  t.deepEquals(result, ['feature1', 'feature2'])
  t.ok(queryBuilderSpy.params.calledOnce)
  t.deepEquals(queryBuilderSpy.params.firstCall.args, [['feature1', 'feature2', 'feature3'], { foo: 'bar' }])
  t.ok(filterAndTransformSpy.filterAndTransform.calledOnce)
  t.deepEquals(filterAndTransformSpy.filterAndTransform.firstCall.args, ['SQL statement', ['params1', 'params2']])
  t.end()
})

test('breaksQuery, unsupported classification type', t => {
  const filterAndTransformSpy = sinon.spy({
    filterAndTransform: () => {
      return ['feature1', 'feature2']
    }
  })

  const queryBuilderSpy = sinon.spy({
    params: () => {
      return ['params1', 'params2']
    }
  })

  const { breaksQuery } = proxyquire(modulePath, {
    './filter-and-transform': filterAndTransformSpy,
    './sql-query-builder': queryBuilderSpy
  })

  try {
    breaksQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', {
      foo: 'bar',
      collection: {},
      classification: { }
    })
    t.fail('breaksQuery should have failed')
  } catch (error) {
    t.equals(error.message, 'unacceptable classification type: undefined')
    t.ok(queryBuilderSpy.params.calledOnce)
    t.deepEquals(queryBuilderSpy.params.firstCall.args, [
      ['feature1', 'feature2', 'feature3'],
      { foo: 'bar', collection: { features: ['feature1', 'feature2'] }, classification: {} }
    ])
    t.ok(filterAndTransformSpy.filterAndTransform.calledOnce)
    t.deepEquals(filterAndTransformSpy.filterAndTransform.firstCall.args, ['SQL statement', ['params1', 'params2']])
  }
  t.end()
})

test('breaksQuery, unsupported breakCount', t => {
  const filterAndTransformSpy = sinon.spy({
    filterAndTransform: () => {
      return ['feature1', 'feature2']
    }
  })

  const queryBuilderSpy = sinon.spy({
    params: () => {
      return ['params1', 'params2']
    }
  })

  const { breaksQuery } = proxyquire(modulePath, {
    './filter-and-transform': filterAndTransformSpy,
    './sql-query-builder': queryBuilderSpy
  })

  try {
    breaksQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', {
      foo: 'bar',
      collection: {},
      classification: { type: 'classes', breakCount: 0 }
    })
    t.fail('breaksQuery should have failed')
  } catch (error) {
    t.equals(error.message, 'breakCount must be positive: 0')
    t.ok(queryBuilderSpy.params.calledOnce)
    t.deepEquals(queryBuilderSpy.params.firstCall.args, [
      ['feature1', 'feature2', 'feature3'],
      {
        foo: 'bar',
        collection: { features: ['feature1', 'feature2'] },
        classification: { type: 'classes', breakCount: 0 }
      }
    ])
    t.ok(filterAndTransformSpy.filterAndTransform.calledOnce)
    t.deepEquals(filterAndTransformSpy.filterAndTransform.firstCall.args, ['SQL statement', ['params1', 'params2']])
  }
  t.end()
})

test('breaksQuery, classes classification type', t => {
  const filterAndTransformSpy = sinon.spy({
    filterAndTransform: () => {
      return ['feature1', 'feature2']
    }
  })

  const queryBuilderSpy = sinon.spy({
    params: () => {
      return ['params1', 'params2']
    }
  })

  const generateBreaksSpy = sinon.spy({
    calculateClassBreaks: () => {
      return 'classification results'
    }
  })
  const { breaksQuery } = proxyquire(modulePath, {
    './filter-and-transform': filterAndTransformSpy,
    './sql-query-builder': queryBuilderSpy,
    './generateBreaks/index': generateBreaksSpy
  })

  const result = breaksQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', {
    foo: 'bar',
    collection: {},
    classification: { type: 'classes', breakCount: 1 }
  })
  t.deepEquals(result, 'classification results')
  t.ok(queryBuilderSpy.params.calledOnce)
  t.deepEquals(queryBuilderSpy.params.firstCall.args, [
    ['feature1', 'feature2', 'feature3'],
    { foo: 'bar', collection: { features: ['feature1', 'feature2'] }, classification: { type: 'classes', breakCount: 1 } }
  ])
  t.ok(filterAndTransformSpy.filterAndTransform.calledOnce)
  t.deepEquals(filterAndTransformSpy.filterAndTransform.firstCall.args, ['SQL statement', ['params1', 'params2']])
  t.ok(generateBreaksSpy.calculateClassBreaks.calledOnce)
  t.deepEquals(generateBreaksSpy.calculateClassBreaks.firstCall.args, [
    ['feature1', 'feature2'],
    { type: 'classes', breakCount: 1 }
  ])
  t.end()
})

test('breaksQuery, classes classification type', t => {
  const filterAndTransformSpy = sinon.spy({
    filterAndTransform: () => {
      return 'aggregate query result'
    }
  })

  const queryBuilderSpy = sinon.spy({
    params: () => {
      return ['params1', 'params2']
    }
  })

  const generateBreaksSpy = sinon.spy({
    calculateUniqueValueBreaks: () => {
      return { options: { aggregates: true, groupBy: true }, query: 'SQL statement' }
    }
  })
  const { breaksQuery } = proxyquire(modulePath, {
    './filter-and-transform': filterAndTransformSpy,
    './sql-query-builder': queryBuilderSpy,
    './generateBreaks/index': generateBreaksSpy
  })

  const result = breaksQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', {
    foo: 'bar',
    collection: {},
    classification: { type: 'unique' }
  })
  t.deepEquals(result, 'aggregate query result')
  t.ok(queryBuilderSpy.params.calledTwice)
  t.ok(filterAndTransformSpy.filterAndTransform.calledTwice)
  t.deepEquals(filterAndTransformSpy.filterAndTransform.firstCall.args, ['SQL statement', ['params1', 'params2']])
  t.ok(generateBreaksSpy.calculateUniqueValueBreaks.calledOnce)
  t.end()
})
