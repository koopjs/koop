const test = require('tape');
const reducePrecision = require('./reduce-precision');

const inputFixture = {
  type: 'Point',
  coordinates: [100.011189, 0.123451],
};

test('reducePrecision, empty input, returns undefined', (t) => {
  const result = reducePrecision();
  t.equals(result, undefined);
  t.end();
});

test('reducePrecision, empty geometry, returns empty geometry', (t) => {
  const result = reducePrecision({});
  t.deepEquals(result, {});
  t.end();
});

test('reducePrecision, no precision input', (t) => {
  const result = reducePrecision(inputFixture);
  t.deepEquals(result, { type: 'Point', coordinates: [100, 0] });
  t.end();
});

test('reducePrecision', (t) => {
  const result = reducePrecision(inputFixture, 3);
  t.deepEquals(result, { type: 'Point', coordinates: [100.011, 0.123] });
  t.end();
});
