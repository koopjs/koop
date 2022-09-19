const test = require('tape');
const envelopeIntersects = require('./envelope-intersects');

test('envelopeIntersects: empty input', t => {
  const result = envelopeIntersects();
  t.equals(result, false);
  t.end();
});

test('envelopeIntersects: empty object input', t => {
  const result = envelopeIntersects({}, {});
  t.equals(result, false);
  t.end();
});

test('envelopeIntersects: null input', t => {
  const result = envelopeIntersects(null, {});
  t.equals(result, false);
  t.end();
});

test('envelopeIntersects: null input', t => {
  const result = envelopeIntersects({}, null);
  t.equals(result, false);
  t.end();
});

test('envelopeIntersects: missing geometry type', t => {
  const result = envelopeIntersects({ coordinates: [44, 84] }, {});
  t.equals(result, false);
  t.end();
});

test('envelopeIntersects: missing coordinates', t => {
  const result = envelopeIntersects({ type: 'Point' }, {});
  t.equals(result, false);
  t.end();
});

test('envelopeIntersects: missing empty coordinates', t => {
  const result = envelopeIntersects({ type: 'Point', coordinates: [] }, {});
  t.equals(result, false);
  t.end();
});

test('envelopeIntersects: missing filter geometry', t => {
  const result = envelopeIntersects({ type: 'Point', coordinates: [44, -84.5] });
  t.equals(result, false);
  t.end();
});

test('envelopeIntersects: Point inside polygon, true', t => {
  const result = envelopeIntersects({ type: 'Point', coordinates: [44, -84.5] }, {
    type: 'Polygon',
    coordinates: [[[44, -85], [45, -85], [45, -84], [44, -84], [44, -85]]]
  });
  t.equals(result, true);
  t.end();
});

test('envelopeIntersects: LineString outside polygon, false', t => {
  const result = envelopeIntersects({ type: 'LineString', coordinates: [[17.41, 52.22], [17.42, 52.22]] }, {
    type: 'Polygon',
    coordinates: [[[17.2, 52.2], [17.4, 52.2], [17.4, 52.3], [17.2, 52.3], [17.2, 52.2]]]
  });
  t.equals(result, false);
  t.end();
});

test('envelopeIntersects: Point inside polygon, Esri Geometry, true', t => {
  const result = envelopeIntersects({ x: 44, y: -84.5 }, {
    type: 'Polygon',
    coordinates: [[[44, -85], [45, -85], [45, -84], [44, -84], [44, -85]]]
  });
  t.equals(result, true);
  t.end();
});

test('envelopeIntersects: Point inside polygon envelope, true', t => {
  const result = envelopeIntersects({ type: 'Point', coordinates: [17.505, 52.029] }, {
    type: 'Polygon',
    coordinates: [
      [
        [
          17.52,
          52.037
        ],
        [
          17.50,
          52.02
        ],
        [
          17.551345825195312,
          52.01
        ],
        [
          17.56988525390625,
          52.02
        ],
        [
          17.538986206054688,
          52.03
        ],
        [
          17.52,
          52.037
        ]
      ]
    ]
  });
  t.equals(result, true);
  t.end();
});

test('envelopeIntersects: Point outside polygon envelope, false', t => {
  const result = envelopeIntersects({ type: 'Point', coordinates: [20, 53] }, {
    type: 'Polygon',
    coordinates: [
      [
        [
          17.52,
          52.037
        ],
        [
          17.50,
          52.02
        ],
        [
          17.551345825195312,
          52.01
        ],
        [
          17.56988525390625,
          52.02
        ],
        [
          17.538986206054688,
          52.03
        ],
        [
          17.52,
          52.037
        ]
      ]
    ]
  });
  t.equals(result, false);
  t.end();
});
