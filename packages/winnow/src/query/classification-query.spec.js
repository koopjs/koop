const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const modulePath = './classification-query';

test('classificationQuery, unsupported classification type', (t) => {
  const standardQuerySpy = sinon.spy(function () {
    return { features: ['feature1', 'feature2'] };
  });

  const classificationQuery = proxyquire(modulePath, {
    './standard-query': standardQuerySpy,
  });

  try {
    classificationQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', {
      foo: 'bar',
      collection: {},
      classification: {},
    });
    t.fail('classificationQuery should have failed');
  } catch (error) {
    t.equals(error.message, 'unacceptable classification type: undefined');
    t.ok(standardQuerySpy.calledOnce);
    t.deepEquals(standardQuerySpy.firstCall.args, [
      ['feature1', 'feature2', 'feature3'],
      'SQL statement',
      { foo: 'bar', collection: {}, classification: {} },
    ]);
  }
  t.end();
});

test('classificationQuery, unsupported breakCount', (t) => {
  const standardQuerySpy = sinon.spy(function () {
    return { features: ['feature1', 'feature2'] };
  });

  const classificationQuery = proxyquire(modulePath, {
    './standard-query': standardQuerySpy,
  });

  try {
    classificationQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', {
      foo: 'bar',
      collection: {},
      classification: { type: 'classes', breakCount: 0 },
    });
    t.fail('classificationQuery should have failed');
  } catch (error) {
    t.equals(error.message, 'breakCount must be positive: 0');
    t.ok(standardQuerySpy.calledOnce);
    t.deepEquals(standardQuerySpy.firstCall.args, [
      ['feature1', 'feature2', 'feature3'],
      'SQL statement',
      {
        foo: 'bar',
        collection: {},
        classification: { type: 'classes', breakCount: 0 },
      },
    ]);
  }
  t.end();
});

test('classificationQuery, classes classification type', (t) => {
  const standardQuerySpy = sinon.spy(function () {
    return { features: ['feature1', 'feature2'] };
  });

  const calculateClassBreaksSpy = sinon.spy(function () {
    return 'classification results';
  });

  const classificationQuery = proxyquire(modulePath, {
    './standard-query': standardQuerySpy,
    '../calculate-class-breaks/index': calculateClassBreaksSpy,
  });

  const result = classificationQuery(['feature1', 'feature2', 'feature3'], 'SQL statement', {
    foo: 'bar',
    collection: {},
    classification: { type: 'classes', breakCount: 1 },
  });
  t.deepEquals(result, 'classification results');
  t.ok(standardQuerySpy.calledOnce);
  t.deepEquals(standardQuerySpy.firstCall.args, [
    ['feature1', 'feature2', 'feature3'],
    'SQL statement',
    {
      foo: 'bar',
      collection: {},
      classification: { type: 'classes', breakCount: 1 },
    },
  ]);
  t.ok(calculateClassBreaksSpy.calledOnce);
  t.deepEquals(calculateClassBreaksSpy.firstCall.args, [
    ['feature1', 'feature2'],
    { type: 'classes', breakCount: 1 },
  ]);
  t.end();
});

test('classificationQuery, unique classification type', (t) => {
  const standardQuerySpy = sinon.spy(function () {
    return { features: ['feature1', 'feature2'] };
  });

  const uniqueValueQuerySpy = sinon.spy(function () {
    return 'unique value query result';
  });

  const classificationQuery = proxyquire(modulePath, {
    './standard-query': standardQuerySpy,
    './unique-value-query': uniqueValueQuerySpy,
  });

  const result = classificationQuery(['feature1', 'feature2', 'feature3'], 'SQL filter statement', {
    foo: 'bar',
    collection: {},
    classification: { type: 'unique' },
  });
  t.deepEquals(result, 'unique value query result');
  t.ok(standardQuerySpy.calledOnce);
  t.deepEquals(standardQuerySpy.firstCall.args, [
    ['feature1', 'feature2', 'feature3'],
    'SQL filter statement',
    { foo: 'bar', collection: {}, classification: { type: 'unique' } },
  ]);
  t.ok(uniqueValueQuerySpy.calledOnce);
  t.deepEquals(uniqueValueQuerySpy.firstCall.args, [['feature1', 'feature2'], { type: 'unique' }]);
  t.end();
});
