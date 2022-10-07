const test = require('tape');
const createGroupByClause = require('./group-by');

test('createGroupByClause: returns empty string if no options', t => {
  t.plan(1);
  const groupByClause = createGroupByClause();
  t.equals(groupByClause, '');
});

test('createGroupByClause: returns empty string if empty options', t => {
  t.plan(1);
  const groupByClause = createGroupByClause({});
  t.equals(groupByClause, '');
});

test('createGroupByClause: returns groupBy clause', t => {
  t.plan(1);
  const groupByClause = createGroupByClause({ groupBy: ['foo', 'bar'] });
  t.equals(groupByClause, ' GROUP BY properties->`foo`, properties->`bar`');
});

test('createGroupByClause: returns groupBy clause for esri JSON', t => {
  t.plan(1);
  const groupByClause = createGroupByClause({ esri: true, groupBy: ['foo', 'bar'] });
  t.equals(groupByClause, ' GROUP BY attributes->`foo`, attributes->`bar`');
});
