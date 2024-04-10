const test = require('tape');
const createOrderByClause = require('./order-by');

test('createOrderByClause: returns empty string if no options', (t) => {
  t.plan(1);
  const orderByClause = createOrderByClause();
  t.equals(orderByClause, '');
});

test('createOrderByClause: returns empty string if empty options', (t) => {
  t.plan(1);
  const orderByClause = createOrderByClause({});
  t.equals(orderByClause, '');
});

test('createOrderByClause: returns orderBy clause with default direction', (t) => {
  t.plan(1);
  const orderByClause = createOrderByClause({ order: ['foo', 'bar'] });
  t.equals(
    orderByClause,
    ' ORDER BY properties->`foo` ASC, properties->`bar` ASC',
  );
});

test('createOrderByClause: returns orderBy clause for esri JSON', (t) => {
  t.plan(1);
  const orderByClause = createOrderByClause({
    esri: true,
    order: ['foo', 'bar'],
  });
  t.equals(
    orderByClause,
    ' ORDER BY attributes->`foo` ASC, attributes->`bar` ASC',
  );
});

test('createOrderByClause: returns orderBy clause with directions ', (t) => {
  t.plan(1);
  const orderByClause = createOrderByClause({
    order: ['foo DESC', 'bar DESC'],
  });
  t.equals(
    orderByClause,
    ' ORDER BY properties->`foo` DESC, properties->`bar` DESC',
  );
});

test('createOrderByClause: returns orderBy clause formated for aggregation select', (t) => {
  t.plan(1);
  const orderByClause = createOrderByClause({
    order: ['foo DESC', 'bar DESC'],
    aggregates: [{ name: 'foo' }],
  });
  t.equals(orderByClause, ' ORDER BY `foo` DESC, properties->`bar` DESC');
});

test('createOrderByClause: returns orderBy clause formated for aggregation select', (t) => {
  t.plan(1);
  const orderByClause = createOrderByClause({
    order: ['foo DESC', 'bar DESC'],
    aggregates: [{ name: 'hello' }],
  });
  t.equals(
    orderByClause,
    ' ORDER BY properties->`foo` DESC, properties->`bar` DESC',
  );
});
