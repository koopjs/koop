const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const modulePath = '../../lib/query'

test('Should normalize and execute standard query', t => {
  const spys = sinon.spy({
    normalizeQueryInput: function (input) { return ['features'] },
    normalizeQueryOptions: function (options) { return options },
    sqlQueryHelpers: sinon.spy({
      create: function () { return 'sql statement' }
    }),
    executeQuery: sinon.spy({
      breaksQuery: function () { return 'query and breaks categorization result' },
      aggregateQuery: function () { return 'query and aggregation result' },
      standardQuery: function () { return 'standard query result' }
    })
  })

  const query = proxyquire(modulePath, {
    './normalize-query-input': spys.normalizeQueryInput,
    './normalize-query-options': spys.normalizeQueryOptions,
    './sql-query-builder': spys.sqlQueryHelpers,
    './execute-query': spys.executeQuery
  })

  const result = query({ metadata: { foo: 'bar' }, features: ['features'] }, { hello: 'world' })
  t.ok(spys.normalizeQueryInput.calledOnce)
  t.deepEquals(spys.normalizeQueryInput.firstCall.args, [{ metadata: { foo: 'bar' }, features: ['features'] }])
  t.ok(spys.normalizeQueryOptions.calledOnce)
  t.deepEquals(spys.normalizeQueryOptions.firstCall.args, [{ hello: 'world', collection: { metadata: { foo: 'bar' } } }, ['features']])
  t.ok(spys.sqlQueryHelpers.create.calledOnce)
  t.deepEquals(spys.sqlQueryHelpers.create.firstCall.args, [{ hello: 'world', collection: { metadata: { foo: 'bar' } } }])
  t.ok(spys.executeQuery.standardQuery.calledOnce)
  t.equals(result, 'standard query result')
  t.end()
})

test('Should normalize and execute breaks-classification query', t => {
  const spys = sinon.spy({
    normalizeQueryInput: function (input) { return ['features'] },
    normalizeQueryOptions: function (options) { return options },
    sqlQueryHelpers: sinon.spy({
      create: function () { return 'sql statement' }
    }),
    executeQuery: sinon.spy({
      breaksQuery: function () { return 'query and breaks classification result' },
      aggregateQuery: function () { return 'query and aggregation result' },
      standardQuery: function () { return 'standard query result' }
    })
  })

  const query = proxyquire(modulePath, {
    './normalize-query-input': spys.normalizeQueryInput,
    './normalize-query-options': spys.normalizeQueryOptions,
    './sql-query-builder': spys.sqlQueryHelpers,
    './execute-query': spys.executeQuery
  })

  const result = query({ metadata: { foo: 'bar' }, features: ['features'] }, { hello: 'world', classification: {} })
  t.ok(spys.normalizeQueryInput.calledOnce)
  t.deepEquals(spys.normalizeQueryInput.firstCall.args, [{ metadata: { foo: 'bar' }, features: ['features'] }])
  t.ok(spys.normalizeQueryOptions.calledOnce)
  t.deepEquals(spys.normalizeQueryOptions.firstCall.args, [{ hello: 'world', classification: {}, collection: { metadata: { foo: 'bar' } } }, ['features']])
  t.ok(spys.sqlQueryHelpers.create.calledOnce)
  t.deepEquals(spys.sqlQueryHelpers.create.firstCall.args, [{ hello: 'world', classification: {}, collection: { metadata: { foo: 'bar' } } }])
  t.ok(spys.executeQuery.breaksQuery.calledOnce)
  t.equals(result, 'query and breaks classification result')
  t.end()
})

test('Should normalize and execute aggregation query', t => {
  const spys = sinon.spy({
    normalizeQueryInput: function (input) { return ['features'] },
    normalizeQueryOptions: function (options) { return options },
    sqlQueryHelpers: sinon.spy({
      create: function () { return 'sql statement' }
    }),
    executeQuery: sinon.spy({
      breaksQuery: function () { return 'query and breaks classification result' },
      aggregateQuery: function () { return 'query and aggregation result' },
      standardQuery: function () { return 'standard query result' }
    })
  })

  const query = proxyquire(modulePath, {
    './normalize-query-input': spys.normalizeQueryInput,
    './normalize-query-options': spys.normalizeQueryOptions,
    './sql-query-builder': spys.sqlQueryHelpers,
    './execute-query': spys.executeQuery
  })

  const result = query({ metadata: { foo: 'bar' }, features: ['features'] }, { hello: 'world', aggregates: {} })
  t.ok(spys.normalizeQueryInput.calledOnce)
  t.deepEquals(spys.normalizeQueryInput.firstCall.args, [{ metadata: { foo: 'bar' }, features: ['features'] }])
  t.ok(spys.normalizeQueryOptions.calledOnce)
  t.deepEquals(spys.normalizeQueryOptions.firstCall.args, [{ hello: 'world', aggregates: {}, collection: { metadata: { foo: 'bar' } } }, ['features']])
  t.ok(spys.sqlQueryHelpers.create.calledOnce)
  t.deepEquals(spys.sqlQueryHelpers.create.firstCall.args, [{ hello: 'world', aggregates: {}, collection: { metadata: { foo: 'bar' } } }])
  t.ok(spys.executeQuery.aggregateQuery.calledOnce)
  t.equals(result, 'query and aggregation result')
  t.end()
})
