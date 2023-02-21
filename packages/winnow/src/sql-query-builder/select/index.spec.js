const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const createSelectSql = proxyquire('./', {
  './aggregation-select': sinon.stub().returns('aggregation SELECT'),
  './geometry-select-fragment': sinon.stub().returns('geometry fragment'),
  './fields-select-fragment': sinon.stub().returns('fields fragment')
});

test('createSelectSql: no options', async (spec) => {
  spec.plan(1);
  const result = createSelectSql();
  spec.equals(result, 'SELECT fields fragment, geometry fragment FROM ?');
});

test('createSelectSql: empty options', async (spec) => {
  spec.plan(1);
  const result = createSelectSql({});
  spec.equals(result, 'SELECT fields fragment, geometry fragment FROM ?');
});

test('createSelectSql: aggregates option', async (spec) => {
  spec.plan(1);
  const result = createSelectSql({ aggregates: ['test'] });
  spec.equals(result, 'aggregation SELECT');
});

test('createSelectSql: returnGeometry:false option', async (spec) => {
  spec.plan(1);
  const result = createSelectSql({ returnGeometry: false });
  spec.equals(result, 'SELECT fields fragment FROM ?');
});

test('createSelectSql: distinct:true option', async (spec) => {
  spec.plan(1);
  const result = createSelectSql({ distinct: true, returnGeometry: false });
  spec.equals(result, 'SELECT DISTINCT fields fragment FROM ?');
});