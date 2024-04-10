const test = require('tape');
const normalizeLimit = require('./limit');

test('normalize-query-options, limit: undefined', (t) => {
  t.plan(1);

  const normalized = normalizeLimit({});
  t.equal(normalized, undefined);
});

test('normalize-query-options, limit: defer to limit option', (t) => {
  t.plan(1);

  const normalized = normalizeLimit({
    limit: 10,
    resultRecordCount: 20,
    count: 30,
    maxFeatures: 40,
  });
  t.equal(normalized, 11);
});

test('normalize-query-options, limit: defer to resultRecordCount option', (t) => {
  t.plan(1);

  const normalized = normalizeLimit({
    resultRecordCount: 20,
    count: 30,
    maxFeatures: 40,
  });
  t.equal(normalized, 21);
});

test('normalize-query-options, limit: defer to count option', (t) => {
  t.plan(1);

  const normalized = normalizeLimit({
    count: 30,
    maxFeatures: 40,
  });
  t.equal(normalized, 31);
});

test('normalize-query-options, limit: defer to maxFeatures option', (t) => {
  t.plan(1);

  const normalized = normalizeLimit({
    maxFeatures: 40,
  });
  t.equal(normalized, 41);
});

test('normalize-query-options, limit: undefined if not an integer', (t) => {
  t.plan(1);

  const normalized = normalizeLimit({
    limit: '1',
  });
  t.equal(normalized, undefined);
});
