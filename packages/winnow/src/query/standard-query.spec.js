const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const modulePath = './standard-query';

test('standardQuery, no options', (t) => {
  const filterAndTransformSpy = sinon.spy({
    filterAndTransform: () => {
      return ['feature1', 'feature2'];
    },
  });

  const queryBuilderSpy = sinon.spy({
    params: () => {
      return ['params1', 'params2'];
    },
  });

  const standardQuery = proxyquire(modulePath, {
    '../filter-and-transform': filterAndTransformSpy,
    '../sql-query-builder': queryBuilderSpy,
  });

  const result = standardQuery(['feature1', 'feature2', 'feature3'], 'SQL statement');
  t.deepEquals(result, ['feature1', 'feature2']);
  t.ok(queryBuilderSpy.params.calledOnce);
  t.deepEquals(queryBuilderSpy.params.firstCall.args, [['feature1', 'feature2', 'feature3'], {}]);
  t.ok(filterAndTransformSpy.filterAndTransform.calledOnce);
  t.deepEquals(filterAndTransformSpy.filterAndTransform.firstCall.args, [
    'SQL statement',
    ['params1', 'params2'],
  ]);
  t.end();
});

test('standardQuery, limit option', (t) => {
  const filterAndTransformSpy = sinon.spy({
    filterAndTransform: () => {
      return ['feature1', 'feature2'];
    },
  });

  const queryBuilderSpy = sinon.spy({
    params: () => {
      return ['params1', 'params2'];
    },
  });

  const standardQuery = proxyquire(modulePath, {
    '../filter-and-transform': filterAndTransformSpy,
    '../sql-query-builder': queryBuilderSpy,
  });

  const result = standardQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', {
    foo: 'bar',
    limit: 2,
  });
  t.deepEquals(result, ['feature1']);
  t.ok(queryBuilderSpy.params.calledOnce);
  t.deepEquals(queryBuilderSpy.params.firstCall.args, [
    ['feature1', 'feature2', 'feature3'],
    { foo: 'bar', limit: 2 },
  ]);
  t.ok(filterAndTransformSpy.filterAndTransform.calledOnce);
  t.deepEquals(filterAndTransformSpy.filterAndTransform.firstCall.args, [
    'SQL statement',
    ['params1', 'params2'],
  ]);
  t.end();
});

test('standardQuery, limit and collection option', (t) => {
  const filterAndTransformSpy = sinon.spy({
    filterAndTransform: () => {
      return ['feature1', 'feature2'];
    },
  });

  const queryBuilderSpy = sinon.spy({
    params: () => {
      return ['params1', 'params2'];
    },
  });

  const standardQuery = proxyquire(modulePath, {
    '../filter-and-transform': filterAndTransformSpy,
    '../sql-query-builder': queryBuilderSpy,
  });

  const result = standardQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', {
    foo: 'bar',
    limit: 2,
    collection: {},
  });
  t.deepEquals(result, {
    metadata: { exceededTransferLimit: true },
    features: ['feature1'],
  });
  t.ok(queryBuilderSpy.params.calledOnce);
  t.deepEquals(queryBuilderSpy.params.firstCall.args, [
    ['feature1', 'feature2', 'feature3'],
    {
      foo: 'bar',
      limit: 2,
      collection: { metadata: { exceededTransferLimit: true } },
    },
  ]);
  t.ok(filterAndTransformSpy.filterAndTransform.calledOnce);
  t.deepEquals(filterAndTransformSpy.filterAndTransform.firstCall.args, [
    'SQL statement',
    ['params1', 'params2'],
  ]);
  t.end();
});
