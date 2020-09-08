const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const modulePath = '../../lib/prepare-query'

test('Should return prepared query', t => {
  const preparedQuerySpy = sinon.spy(function (input) { return 'results' })
  const normalizeQueryInput = sinon.spy(function () { return ['features'] })
  const normalizeQueryOptions = sinon.spy(function (options) { return options })
  const sqlQueryHelpers = sinon.spy({
    create: function () { return 'sql statement' },
    params: function (features) { return [features] }
  })
  const executeQuery = sinon.spy({
    finishQuery: function () { return 'return finished query result' }
  })
  const alaSql = sinon.spy({
    compile: function () {
      return preparedQuerySpy
    }
  })

  const query = proxyquire(modulePath, {
    './normalize-query-input': normalizeQueryInput,
    './normalize-query-options': normalizeQueryOptions,
    './sql-query-builder': sqlQueryHelpers,
    './execute-query': executeQuery,
    './alasql': alaSql
  })

  // Get a prepared query function
  const preparedQuery = query({ hello: 'world' })
  t.ok(normalizeQueryOptions.calledOnce)
  t.deepEquals(normalizeQueryOptions.firstCall.args, [{ hello: 'world' }])
  t.ok(sqlQueryHelpers.create.calledOnce)
  t.deepEquals(sqlQueryHelpers.create.firstCall.args, [{ hello: 'world' }])
  t.ok(sqlQueryHelpers.params.calledOnce)
  t.deepEquals(sqlQueryHelpers.params.firstCall.args, ['$features$', { hello: 'world' }])
  t.equals(typeof preparedQuery, 'function')

  // Execute prepared query
  const result = preparedQuery({ metadata: { foo: 'bar' }, features: ['features'] })
  t.ok(normalizeQueryInput.calledOnce)
  t.deepEquals(normalizeQueryInput.firstCall.args, [{ metadata: { foo: 'bar' }, features: ['features'] }])
  t.ok(executeQuery.finishQuery.calledOnce)
  t.deepEquals(executeQuery.finishQuery.firstCall.args, ['results', { hello: 'world', collection: { metadata: { foo: 'bar' } } }])
  t.equals(result, 'return finished query result')
  t.end()
})
