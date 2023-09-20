const test = require('tape');
const normalizeObjectIds = require('./object-ids');

test('normalize objectIds: undefined objectIds', t => {
  t.plan(1);

  const normalized = normalizeObjectIds();
  t.equal(normalized, undefined);
});

test('normalize objectIds: numeric string', t => {
  t.plan(1);

  const normalized = normalizeObjectIds('1');
  t.deepEqual(normalized, [1]);
});

test('normalize objectIds: delimited numeric string', t => {
  t.plan(1);

  const normalized = normalizeObjectIds('1,2');
  t.deepEqual(normalized, [1, 2]);
});

test('normalize objectIds: delimited strings', t => {
  t.plan(1);

  const normalized = normalizeObjectIds('abc3ef,xyz123');
  t.deepEqual(normalized, ['abc3ef','xyz123']);
});

test('normalize objectIds: integer', t => {
  t.plan(1);

  const normalized = normalizeObjectIds(1);
  t.deepEqual(normalized, [1]);
});

test('normalize objectIds: numeric array', t => {
  t.plan(1);

  const normalized = normalizeObjectIds([1]);
  t.deepEqual(normalized, [1]);
});

test('normalize objectIds: throw on unsupported data type', t => {
  t.plan(2);

  try {
    normalizeObjectIds(true);
    t.fail('should have thrown');
  } catch (err) {
    t.equals(err.message, 'Invalid objectIds: true');
    t.equals(err.code, 400);
  }
});
