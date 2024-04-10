const test = require('tape');
const within = require('./within');

test('within: empty input', (t) => {
  const result = within();
  t.equals(result, false);
  t.end();
});

test('within: empty object input', (t) => {
  const result = within({}, {});
  t.equals(result, false);
  t.end();
});

test('within: null input', (t) => {
  const result = within(null, {});
  t.equals(result, false);
  t.end();
});

test('within: null input', (t) => {
  const result = within({}, null);
  t.equals(result, false);
  t.end();
});

test('within: missing geometry type', (t) => {
  const result = within({ coordinates: [44, 84] }, {});
  t.equals(result, false);
  t.end();
});

test('within: missing coordinates', (t) => {
  const result = within({ type: 'Point' }, {});
  t.equals(result, false);
  t.end();
});

test('within: missing empty coordinates', (t) => {
  const result = within({ type: 'Point', coordinates: [] }, {});
  t.equals(result, false);
  t.end();
});

test('within: missing filter geometry', (t) => {
  const result = within({ type: 'Point', coordinates: [44, -84.5] });
  t.equals(result, false);
  t.end();
});

test('within: true', (t) => {
  const result = within(
    { type: 'Point', coordinates: [44, -84.5] },
    {
      type: 'Polygon',
      coordinates: [
        [
          [44, -85],
          [45, -85],
          [45, -84],
          [44, -84],
          [44, -85],
        ],
      ],
    },
  );
  t.equals(result, true);
  t.end();
});

test('within: false', (t) => {
  const result = within(
    { type: 'Point', coordinates: [0, 0] },
    {
      type: 'Polygon',
      coordinates: [
        [
          [44, -85],
          [45, -85],
          [45, -84],
          [44, -84],
          [44, -85],
        ],
      ],
    },
  );
  t.equals(result, false);
  t.end();
});
