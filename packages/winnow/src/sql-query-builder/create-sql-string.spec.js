const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const whereSpy = {
  create: sinon.spy(function () {
    return '"substring"';
  })
};

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
  whereSpy.create.resetHistory();
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
  t.equals(whereSpy.create.callCount, 0);
  t.equals(groupBySpy.callCount, 1);
  t.equals(orderBySpy.callCount, 1);
  t.deepEquals(selectSpy.firstCall.args, [{}]);
  t.deepEquals(whereSpy.create.notCalled, true);
  t.deepEquals(groupBySpy.firstCall.args, [{}]);
  t.deepEquals(orderBySpy.firstCall.args, [{}]);
  testCleanup();
});

test('createSqlString: with objectIds option', t => {
  t.plan(9);
  testCleanup();
  const sqlString = createSqlString({ objectIds: [2] });
  t.equals(sqlString, 'SELECT "substring" WHERE "substring" GROUP BY "substring" ORDER BY "substring"');
  t.equals(selectSpy.callCount, 1);
  t.equals(whereSpy.create.callCount, 1);
  t.equals(groupBySpy.callCount, 1);
  t.equals(orderBySpy.callCount, 1);
  t.deepEquals(selectSpy.firstCall.args, [{ objectIds: [ 2 ] }]);
  t.deepEquals(whereSpy.create.firstCall.args, [{ objectIds: [ 2 ] }]);
  t.deepEquals(groupBySpy.firstCall.args, [{ objectIds: [ 2 ] }]);
  t.deepEquals(orderBySpy.firstCall.args, [{ objectIds: [ 2 ] }]);
  testCleanup();
});

test('createSqlString: with where option', t => {
  t.plan(9);
  testCleanup();
  const sqlString = createSqlString({ where: '1=1' });
  t.equals(sqlString, 'SELECT "substring" WHERE "substring" GROUP BY "substring" ORDER BY "substring"');
  t.equals(selectSpy.callCount, 1);
  t.equals(whereSpy.create.callCount, 1);
  t.equals(groupBySpy.callCount, 1);
  t.equals(orderBySpy.callCount, 1);
  t.deepEquals(selectSpy.firstCall.args, [{ where: '1=1' }]);
  t.deepEquals(whereSpy.create.firstCall.args, [{ where: '1=1' }]);
  t.deepEquals(groupBySpy.firstCall.args, [{ where: '1=1' }]);
  t.deepEquals(orderBySpy.firstCall.args, [{ where: '1=1' }]);
  testCleanup();
});

test('createSqlString: with geometry option', t => {
  t.plan(9);
  testCleanup();
  const sqlString = createSqlString({ geometry: [0,0,0,0] });
  t.equals(sqlString, 'SELECT "substring" WHERE "substring" GROUP BY "substring" ORDER BY "substring"');
  t.equals(selectSpy.callCount, 1);
  t.equals(whereSpy.create.callCount, 1);
  t.equals(groupBySpy.callCount, 1);
  t.equals(orderBySpy.callCount, 1);
  t.deepEquals(selectSpy.firstCall.args, [{ geometry: [0,0,0,0] }]);
  t.deepEquals(whereSpy.create.firstCall.args, [{ geometry: [0,0,0,0] }]);
  t.deepEquals(groupBySpy.firstCall.args, [{ geometry: [0,0,0,0] }]);
  t.deepEquals(orderBySpy.firstCall.args, [{ geometry: [0,0,0,0] }]);
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
  t.equals(whereSpy.create.callCount, 0);
  t.equals(groupBySpy.callCount, 1);
  t.equals(orderBySpy.callCount, 1);
  t.deepEquals(selectSpy.firstCall.args, [{
    limit: 10,
    offset: 20
  }]);
  t.deepEquals(whereSpy.create.notCalled, true);
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
