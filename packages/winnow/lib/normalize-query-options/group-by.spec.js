const test = require('tape');
const normalizeGroupBy = require('./group-by');

test('normalize-options, groupBy: undefined', t => {
  t.plan(1);

  const normalized = normalizeGroupBy({ });
  t.equal(normalized, undefined);
});

test('normalize-options, groupBy: defer to "groupBy" value', t => {
  t.plan(1);

  const normalizedOrder = normalizeGroupBy({ groupBy: 'hello', groupByFieldsForStatistics: 'world' });
  t.deepEquals(normalizedOrder, ['hello']);
});

test('normalize-options, groupBy: use "groupByFieldsForStatistics" as second choice', t => {
  t.plan(1);

  const normalizedOrder = normalizeGroupBy({ groupByFieldsForStatistics: 'world' });
  t.deepEquals(normalizedOrder, ['world']);
});

test('normalize-options, groupBy: convert string to array', t => {
  t.plan(1);
  const normalizedOrder = normalizeGroupBy({ groupBy: 'hello,world' });
  t.deepEquals(normalizedOrder, ['hello', 'world']);
});

test('normalize-options, groupBy: convert string to array, trim whitespace', t => {
  t.plan(1);
  const normalizedOrder = normalizeGroupBy({ groupBy: 'hello ,world' });
  t.deepEquals(normalizedOrder, ['hello', 'world']);
});

test('normalize-options, groupBy: value is a string array', t => {
  t.plan(2);
  const options = {
    groupBy: ['test', 'field', 'names']
  };
  const order = normalizeGroupBy(options);
  t.ok(Array.isArray(order));
  t.deepEquals(order, ['test', 'field', 'names']);
});

test('normalize-options, groupBy: value is a not a string or array', t => {
  t.plan(1);
  const options = {
    groupBy: 1
  };
  const order = normalizeGroupBy(options);
  t.equals(order, undefined);
});
