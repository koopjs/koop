const test = require('tape');
const toEsriGeometry = require('./to-esri-geometry');

test('toEsriGeometry: no geometry', (t) => {
  t.plan(1);
  const transformed = toEsriGeometry();
  t.equals(transformed, null);
});

test('toEsriGeometry: null geometry', (t) => {
  t.plan(1);
  const transformed = toEsriGeometry(null);
  t.equals(transformed, null);
});

test('toEsriGeometry: no geometry type', (t) => {
  t.plan(1);
  const transformed = toEsriGeometry({});
  t.equals(transformed, null);
});

test('toEsriGeometry: point', (t) => {
  t.plan(1);
  const transformed = toEsriGeometry({
    type: 'Point',
    coordinates: [100, 0],
  });
  t.deepEquals(transformed, { x: 100, y: 0 });
});

test('toEsriGeometry: linestring', (t) => {
  t.plan(1);
  const transformed = toEsriGeometry({
    type: 'LineString',
    coordinates: [
      [100.0, 0.0],
      [101.0, 1.0],
    ],
  });
  t.deepEquals(transformed, {
    paths: [
      [
        [100, 0],
        [101, 1],
      ],
    ],
  });
});

test('toEsriGeometry: polygon', (t) => {
  t.plan(1);
  const transformed = toEsriGeometry({
    type: 'Polygon',
    coordinates: [
      [
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0],
      ],
    ],
  });
  t.deepEquals(transformed, {
    rings: [
      [
        [100, 0],
        [100, 1],
        [101, 1],
        [101, 0],
        [100, 0],
      ],
    ],
  });
});

test('toEsriGeometry: multipoint', (t) => {
  t.plan(1);
  const transformed = toEsriGeometry({
    type: 'MultiPoint',
    coordinates: [
      [100.0, 0.0],
      [101.0, 1.0],
    ],
  });
  t.deepEquals(transformed, {
    points: [
      [100, 0],
      [101, 1],
    ],
  });
});

test('toEsriGeometry: multilinestring', (t) => {
  t.plan(1);
  const transformed = toEsriGeometry({
    type: 'MultiLineString',
    coordinates: [
      [
        [100.0, 0.0],
        [101.0, 1.0],
      ],
      [
        [102.0, 2.0],
        [103.0, 3.0],
      ],
    ],
  });
  t.deepEquals(transformed, {
    paths: [
      [
        [100, 0],
        [101, 1],
      ],
      [
        [102, 2],
        [103, 3],
      ],
    ],
  });
});

test('toEsriGeometry: multipolygon', (t) => {
  t.plan(1);
  const transformed = toEsriGeometry({
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [102.0, 2.0],
          [103.0, 2.0],
          [103.0, 3.0],
          [102.0, 3.0],
          [102.0, 2.0],
        ],
      ],
      [
        [
          [100.0, 0.0],
          [101.0, 0.0],
          [101.0, 1.0],
          [100.0, 1.0],
          [100.0, 0.0],
        ],
        [
          [100.2, 0.2],
          [100.2, 0.8],
          [100.8, 0.8],
          [100.8, 0.2],
          [100.2, 0.2],
        ],
      ],
    ],
  });
  t.deepEquals(transformed, {
    rings: [
      [
        [102, 2],
        [102, 3],
        [103, 3],
        [103, 2],
        [102, 2],
      ],
      [
        [100.2, 0.2],
        [100.8, 0.2],
        [100.8, 0.8],
        [100.2, 0.8],
        [100.2, 0.2],
      ],
      [
        [100, 0],
        [100, 1],
        [101, 1],
        [101, 0],
        [100, 0],
      ],
    ],
  });
});

test('toEsriGeometry: unsupported type', (t) => {
  t.plan(1);
  const result = toEsriGeometry({ type: 'unsupported' });
  t.equals(result, null);
});
