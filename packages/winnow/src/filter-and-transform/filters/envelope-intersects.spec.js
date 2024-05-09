const test = require('tape');
const intersects = require('./envelope-intersects');

const searchGeometry = {
  coordinates: [
    [
      [-130, 38],
      [-130, 35],
      [-113, 35],
      [-113, 38],
      [-130, 38],
    ],
  ],
  type: 'Polygon',
};

test('intersects: empty input', (t) => {
  const result = intersects(searchGeometry);
  t.equals(result, false);
  t.end();
});

test('intersects: empty object input', (t) => {
  const result = intersects(searchGeometry, {});
  t.equals(result, false);
  t.end();
});

test('intersects: null input', (t) => {
  const result = intersects(searchGeometry, null);
  t.equals(result, false);
  t.end();
});

test('intersects: missing geometry type', (t) => {
  const result = intersects(searchGeometry, { coordinates: [44, 84] });
  t.equals(result, false);
  t.end();
});

test('intersects: missing coordinates', (t) => {
  const result = intersects(searchGeometry, { type: 'Point' });
  t.equals(result, false);
  t.end();
});

test('intersects: missing empty coordinates', (t) => {
  const result = intersects(searchGeometry, { type: 'Point', coordinates: [] });
  t.equals(result, false);
  t.end();
});

test('intersects: Point inside polygon, true', (t) => {
  const result = intersects(searchGeometry, { type: 'Point', coordinates: [-115, 37] });
  t.equals(result, true);
  t.end();
});

test('intersects: LineString outside polygon, false', (t) => {
  const result = intersects(searchGeometry, {
    type: 'LineString',
    coordinates: [
      [17.41, 52.22],
      [17.42, 52.22],
    ],
  });
  t.equals(result, false);
  t.end();
});

test('intersects: Point inside polygon, Esri Geometry, true', (t) => {
  const result = intersects(searchGeometry, { x: -115, y: 37 });
  t.equals(result, true);
  t.end();
});
