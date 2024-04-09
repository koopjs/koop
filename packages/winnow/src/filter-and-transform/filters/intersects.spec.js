const test = require('tape');
const intersects = require('./intersects');

test('intersects: empty input', (t) => {
  const result = intersects();
  t.equals(result, false);
  t.end();
});

test('intersects: empty object input', (t) => {
  const result = intersects({}, {});
  t.equals(result, false);
  t.end();
});

test('intersects: null input', (t) => {
  const result = intersects(null, {});
  t.equals(result, false);
  t.end();
});

test('intersects: null input', (t) => {
  const result = intersects({}, null);
  t.equals(result, false);
  t.end();
});

test('intersects: missing geometry type', (t) => {
  const result = intersects({ coordinates: [44, 84] }, {});
  t.equals(result, false);
  t.end();
});

test('intersects: missing coordinates', (t) => {
  const result = intersects({ type: 'Point' }, {});
  t.equals(result, false);
  t.end();
});

test('intersects: missing empty coordinates', (t) => {
  const result = intersects({ type: 'Point', coordinates: [] }, {});
  t.equals(result, false);
  t.end();
});

test('intersects: missing filter geometry', (t) => {
  const result = intersects({ type: 'Point', coordinates: [44, -84.5] });
  t.equals(result, false);
  t.end();
});

test('intersects: Point inside polygon, true', (t) => {
  const result = intersects(
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

test('intersects: LineString outside polygon, false', (t) => {
  const result = intersects(
    {
      type: 'LineString',
      coordinates: [
        [17.41, 52.22],
        [17.42, 52.22],
      ],
    },
    {
      type: 'Polygon',
      coordinates: [
        [
          [17.2, 52.2],
          [17.4, 52.2],
          [17.4, 52.3],
          [17.2, 52.3],
          [17.2, 52.2],
        ],
      ],
    },
  );
  t.equals(result, false);
  t.end();
});

test('intersects: Point inside polygon, Esri Geometry, true', (t) => {
  const result = intersects(
    { x: 44, y: -84.5 },
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
