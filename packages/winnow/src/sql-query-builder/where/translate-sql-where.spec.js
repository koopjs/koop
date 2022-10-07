const test = require('tape');
const translateSqlWhere = require('./translate-sql-where');
const normalizeQueryOptions = require('../../normalize-query-options');

test('translateSqlWhere: transform a simple equality predicate', t => {
  t.plan(1);
  const options = {
    where: 'foo=\'bar\''
  };
  const normalizeOpts = normalizeQueryOptions(options);
  const whereFragment = translateSqlWhere(normalizeOpts);
  t.equals(whereFragment, 'properties->`foo` = \'bar\'');
});

test('translateSqlWhere: transform a simple but inverse predicate', t => {
  t.plan(1);
  const options = {
    where: '\'bar\'=foo'
  };
  const normalizeOpts = normalizeQueryOptions(options);
  const whereFragment = translateSqlWhere(normalizeOpts);
  t.equals(whereFragment, '\'bar\' = properties->`foo`');
});

test('translateSqlWhere: transform a simple predicate', t => {
  t.plan(1);
  const options = {
    where: '\'bar\'=foo'
  };
  const normalizeOpts = normalizeQueryOptions(options);
  const whereFragment = translateSqlWhere(normalizeOpts);
  t.equals(whereFragment, '\'bar\' = properties->`foo`');
});

test('translateSqlWhere: transform a simple predicate to a form required for Esri JSON', t => {
  t.plan(1);
  const options = {
    where: 'foo=\'bar\'',
    esri: true
  };
  const normalizeOpts = normalizeQueryOptions(options);
  const whereFragment = translateSqlWhere(normalizeOpts);
  t.equals(whereFragment, 'attributes->`foo` = \'bar\'');
});

test('translateSqlWhere: transform a simple but inverse predicate to Esri flavor', t => {
  t.plan(1);
  const options = {
    where: '\'bar\'=foo',
    esri: true
  };
  const normalizeOpts = normalizeQueryOptions(options);
  const whereFragment = translateSqlWhere(normalizeOpts);
  t.equals(whereFragment, '\'bar\' = attributes->`foo`');
});

test('translateSqlWhere: transform a predicate with OBJECTID and no metadata fields to user-defined function', t => {
  t.plan(1);
  const options = {
    where: 'OBJECTID=1234'
  };
  const normalizeOpts = normalizeQueryOptions(options);
  const whereFragment = translateSqlWhere(normalizeOpts);
  t.equals(whereFragment, 'hashedObjectIdComparator(properties, geometry, 1234, \'=\')=true');
});

test('translateSqlWhere: transform a predicate with OBJECTID and no metadata fields to Esri flavor with user-defined function', t => {
  t.plan(1);
  const options = {
    where: 'OBJECTID=1234',
    esri: true
  };
  const normalizeOpts = normalizeQueryOptions(options);
  const whereFragment = translateSqlWhere(normalizeOpts);
  t.equals(whereFragment, 'hashedObjectIdComparator(attributes, geometry, 1234, \'=\')=true');
});

test('translateSqlWhere: transform an inverse predicate with OBJECTID and no metadata fields to user-defined function', t => {
  t.plan(1);
  const options = {
    where: '1234>OBJECTID'
  };
  const normalizeOpts = normalizeQueryOptions(options);
  const whereFragment = translateSqlWhere(normalizeOpts);
  t.equals(whereFragment, 'hashedObjectIdComparator(properties, geometry, 1234, \'<=\')=true');
});

test('translateSqlWhere: transform an inverse predicate with OBJECTID and no metadata fields to Esri flavor with user-defined function', t => {
  t.plan(1);
  const options = {
    where: '1234>OBJECTID',
    esri: true
  };
  const normalizeOpts = normalizeQueryOptions(options);
  const whereFragment = translateSqlWhere(normalizeOpts);
  t.equals(whereFragment, 'hashedObjectIdComparator(attributes, geometry, 1234, \'<=\')=true');
});

test('translateSqlWhere: transform a predicate with OBJECTID and metadata fields that define the OBJECTID', t => {
  t.plan(1);
  const options = {
    where: 'OBJECTID=1234',
    collection: {
      metadata: {
        fields: [{ name: 'OBJECTID' }]
      }
    }
  };
  const normalizeOpts = normalizeQueryOptions(options);
  const whereFragment = translateSqlWhere(normalizeOpts);
  t.equals(whereFragment, 'properties->`OBJECTID` = 1234');
});
