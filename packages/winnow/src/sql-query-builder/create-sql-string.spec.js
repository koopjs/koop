const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const whereSpy = sinon.spy(function () {
  return ' WHERE "substring"';
});

const selectSpy = sinon.spy(function () {
  return 'SELECT "substring"';
});

const orderBySpy = sinon.spy(function () {
  return ' ORDER BY "substring"';
});

const groupBySpy = sinon.spy(function () {
  return ' GROUP BY "substring"';
});

const testCleanup = () => {
  whereSpy.resetHistory();
  selectSpy.resetHistory();
  orderBySpy.resetHistory();
  groupBySpy.resetHistory();
};

const createSqlString = proxyquire('./create-sql-string', {
  './where-builder': whereSpy,
  './select': selectSpy,
  './order-by': orderBySpy,
  './group-by': groupBySpy
});

test('createSqlString: with no options', t => {
  t.plan(9);
  testCleanup();
  const sqlString = createSqlString();
  t.equals(sqlString, 'SELECT "substring" GROUP BY "substring" ORDER BY "substring"');
  t.equals(selectSpy.callCount, 1);
  t.equals(whereSpy.callCount, 0);
  t.equals(groupBySpy.callCount, 1);
  t.equals(orderBySpy.callCount, 1);
  t.deepEquals(selectSpy.firstCall.args, [{}]);
  t.deepEquals(whereSpy.notCalled, true);
  t.deepEquals(groupBySpy.firstCall.args, [{}]);
  t.deepEquals(orderBySpy.firstCall.args, [{}]);
  testCleanup();
});

test('createSqlString: with limit and offset options', t => {
  t.plan(9);
  testCleanup();
  const sqlString = createSqlString({
    limit: 10,
    offset: 20
  });
  t.equals(sqlString, 'SELECT "substring" GROUP BY "substring" ORDER BY "substring" LIMIT 10 OFFSET 20');
  t.equals(selectSpy.callCount, 1);
  t.equals(whereSpy.callCount, 0);
  t.equals(groupBySpy.callCount, 1);
  t.equals(orderBySpy.callCount, 1);
  t.deepEquals(selectSpy.firstCall.args, [{
    limit: 10,
    offset: 20
  }]);
  t.deepEquals(whereSpy.notCalled, true);
  t.deepEquals(groupBySpy.firstCall.args, [{
    limit: 10,
    offset: 20
  }]);
  t.deepEquals(orderBySpy.firstCall.args, [{
    limit: 10,
    offset: 20
  }]);
  testCleanup();
});
