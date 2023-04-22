const test = require('tape');
const normalizeWhere = require('./where');

test('normalize-options, where: undefined', t => {
  t.plan(1);

  const normalized = normalizeWhere(undefined);
  t.equal(normalized, undefined);
});

test('normalize-options, where: error on non-strings', t => {
  t.plan(1);

  try {
    normalizeWhere(9999);
    t.fail('should have thrown');
  } catch (error) {
    t.equals(error.message, 'Invalid "where" parameter: must be a string if defined');
  }
});

test('normalize-options, where: no changes', t => {
  t.plan(1);

  const normalized = normalizeWhere('columns = \'test\'');
  t.equal(normalized, 'columns = \'test\'');
});

test('normalize-options, where: remove esri-style select-all when present', t => {
  t.plan(1);

  const normalized = normalizeWhere('1=1');
  t.equal(normalized, undefined);
});

test('normalize-options, where: convert esri/sql-style dates to ISO dates', t => {
  t.plan(1);
  const where = 'foo=\'bar\' AND ISSUE_DATE >= date 2017-01-05 AND ISSUE_DATE <= date 2018-01-05';

  const normalized = normalizeWhere(where);
  t.equal(normalized, 'foo=\'bar\' AND ISSUE_DATE >= \'2017-01-05T00:00:00.000Z\' AND ISSUE_DATE <= \'2018-01-05T00:00:00.000Z\'');
});
