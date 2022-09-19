const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const modulePath = './query';

test('Should normalize and execute standard query on feature array', t => {
  const spys = sinon.spy({
    normalizeQueryInput: function () { return ['features']; },
    normalizeQueryOptions: function (options) { return options; },
    sqlQueryHelpers: sinon.spy({
      create: function () { return 'sql statement'; }
    }),
    standardQuery: function () { return 'standard query result'; }
  });

  const query = proxyquire(modulePath, {
    './normalize-query-input': spys.normalizeQueryInput,
    '../normalize-query-options': spys.normalizeQueryOptions,
    '../sql-query-builder': spys.sqlQueryHelpers,
    './standard-query': spys.standardQuery
  });

  const result = query(['features'], { hello: 'world' });
  t.ok(spys.normalizeQueryInput.calledOnce);
  t.deepEquals(spys.normalizeQueryInput.firstCall.args, [['features']]);
  t.ok(spys.normalizeQueryOptions.calledOnce);
  t.deepEquals(spys.normalizeQueryOptions.firstCall.args, [{ hello: 'world' }, ['features']]);
  t.ok(spys.sqlQueryHelpers.create.calledOnce);
  t.deepEquals(spys.sqlQueryHelpers.create.firstCall.args, [{ hello: 'world' }]);
  t.ok(spys.standardQuery.calledOnce);
  t.deepEquals(spys.standardQuery.firstCall.args, [['features'], 'sql statement', { skipLimitHandling: false, hello: 'world' }]
  );
  t.equals(result, 'standard query result');
  t.end();
});

test('Should normalize and execute standard query on collection', t => {
  const spys = sinon.spy({
    normalizeQueryInput: function () { return ['features']; },
    normalizeQueryOptions: function (options) { return options; },
    sqlQueryHelpers: sinon.spy({
      create: function () { return 'sql statement'; }
    }),
    standardQuery: function () { return 'standard query result'; }
  });

  const query = proxyquire(modulePath, {
    './normalize-query-input': spys.normalizeQueryInput,
    '../normalize-query-options': spys.normalizeQueryOptions,
    '../sql-query-builder': spys.sqlQueryHelpers,
    './standard-query': spys.standardQuery
  });

  const result = query({ metadata: { foo: 'bar' }, features: ['features'] }, { hello: 'world' });
  t.ok(spys.normalizeQueryInput.notCalled);
  t.ok(spys.normalizeQueryOptions.calledOnce);
  t.deepEquals(spys.normalizeQueryOptions.firstCall.args, [{ hello: 'world', collection: { metadata: { foo: 'bar' } } }, ['features']]);
  t.ok(spys.sqlQueryHelpers.create.calledOnce);
  t.deepEquals(spys.sqlQueryHelpers.create.firstCall.args, [{ hello: 'world', collection: { metadata: { foo: 'bar' } } }]);
  t.ok(spys.standardQuery.calledOnce);
  t.deepEquals(spys.standardQuery.firstCall.args, [
    ['features'],
    'sql statement',
    { skipLimitHandling: false, hello: 'world', collection: { metadata: { foo: 'bar' } } }
  ]);
  t.equals(result, 'standard query result');
  t.end();
});

test('Should normalize and execute breaks-classification query', t => {
  const spys = sinon.spy({
    normalizeQueryInput: function () { return ['features']; },
    normalizeQueryOptions: function (options) { return options; },
    sqlQueryHelpers: sinon.spy({
      create: function () { return 'sql statement'; }
    }),
    classificationQuery: function () { return 'breaks classification result'; }
  });

  const query = proxyquire(modulePath, {
    './normalize-query-input': spys.normalizeQueryInput,
    '../normalize-query-options': spys.normalizeQueryOptions,
    '../sql-query-builder': spys.sqlQueryHelpers,
    './classification-query': spys.classificationQuery
  });

  const result = query({ metadata: { foo: 'bar' }, features: ['features'] }, { hello: 'world', classification: {} });
  t.ok(spys.normalizeQueryInput.notCalled);
  t.ok(spys.normalizeQueryOptions.calledOnce);
  t.deepEquals(spys.normalizeQueryOptions.firstCall.args, [{ hello: 'world', classification: {}, collection: { metadata: { foo: 'bar' } } }, ['features']]);
  t.ok(spys.sqlQueryHelpers.create.calledOnce);
  t.deepEquals(spys.sqlQueryHelpers.create.firstCall.args, [{ hello: 'world', classification: {}, collection: { metadata: { foo: 'bar' } } }]);
  t.ok(spys.classificationQuery.calledOnce);
  t.deepEquals(spys.classificationQuery.firstCall.args, [
    ['features'],
    'sql statement',
    { classification: {}, hello: 'world', collection: { metadata: { foo: 'bar' } } }
  ]);
  t.equals(result, 'breaks classification result');
  t.end();
});

test('Should normalize and execute aggregation query', t => {
  const spys = sinon.spy({
    normalizeQueryInput: function () { return ['features']; },
    normalizeQueryOptions: function (options) { return options; },
    sqlQueryHelpers: sinon.spy({
      create: function () { return 'sql statement'; }
    }),
    standardQuery: function () { return 'standard query result'; }
  });

  const query = proxyquire(modulePath, {
    './normalize-query-input': spys.normalizeQueryInput,
    '../normalize-query-options': spys.normalizeQueryOptions,
    '../sql-query-builder': spys.sqlQueryHelpers,
    './standard-query': spys.standardQuery
  });

  const result = query({ metadata: { foo: 'bar' }, features: ['features'] }, { hello: 'world', aggregates: {} });
  t.ok(spys.normalizeQueryInput.notCalled);
  t.ok(spys.normalizeQueryOptions.calledOnce);
  t.deepEquals(spys.normalizeQueryOptions.firstCall.args, [{ hello: 'world', aggregates: {}, collection: { metadata: { foo: 'bar' } } }, ['features']]);
  t.ok(spys.sqlQueryHelpers.create.calledOnce);
  t.deepEquals(spys.sqlQueryHelpers.create.firstCall.args, [{ hello: 'world', aggregates: {}, collection: { metadata: { foo: 'bar' } } }]);
  t.ok(spys.standardQuery.calledOnce);
  t.equals(result, 'standard query result');
  t.end();
});
