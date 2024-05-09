const test = require('tape');
const contains = require('./contains');
const turf = require('@turf/helpers');

const point = turf.point([-130, 37]).geometry;
const multiPoint = turf.multiPoint([
  [-130, 37],
  [-130, 37],
]).geometry;

const line = turf.lineString([
  [-130, 38],
  [-130, 37],
  [-130, 36],
]).geometry;

const multiLine = turf.multiLineString([
  [
    [-130, 38],
    [-130, 37],
    [-130, 36],
  ],
  [
    [-130, 38],
    [-130, 37],
    [-130, 36],
  ],
]).geometry;

const poly = turf.polygon([
  [
    [-131, 39],
    [-131, 35],
    [-113, 35],
    [-131, 39],
  ],
]).geometry;

const multiPoly = turf.multiPolygon([
  [
    [
      [-131, 39],
      [-131, 35],
      [-113, 35],
      [-131, 39],
    ],
  ],
  [
    [
      [-131, 39],
      [-131, 35],
      [-113, 35],
      [-131, 39],
    ],
  ],
]).geometry;

const multiPoly2 = turf.multiPolygon([
  [
    [
      [-130, 39],
      [-130, 35],
      [-113, 35],
      [-130, 39],
    ],
  ],
  [
    [
      [-130, 39],
      [-130, 35],
      [-113, 35],
      [-130, 39],
    ],
  ],
]).geometry;
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

test('contains: empty input', (t) => {
  const result = contains(searchGeometry);
  t.equals(result, false);
  t.end();
});

test('contains: empty object input', (t) => {
  const result = contains(searchGeometry, {});
  t.equals(result, false);
  t.end();
});

test('contains: null input', (t) => {
  const result = contains(searchGeometry, null);
  t.equals(result, false);
  t.end();
});

test('contains: missing geometry type', (t) => {
  const result = contains(searchGeometry, { coordinates: [44, 84] });
  t.equals(result, false);
  t.end();
});

test('contains: missing coordinates', (t) => {
  const result = contains(searchGeometry, { type: 'Point' });
  t.equals(result, false);
  t.end();
});

test('contains: missing empty coordinates', (t) => {
  const result = contains(searchGeometry, { type: 'Point', coordinates: [] });
  t.equals(result, false);
  t.end();
});

test('contains: feature on search geometry edge is false', (t) => {
  const result = contains(
    searchGeometry,
    { type: 'Point', coordinates: [-130, 38] }, // feature
  );
  t.equals(result, false);
  t.end();
});

test('contains: feature inside search geometry is true', (t) => {
  const result = contains(
    searchGeometry,
    { type: 'Point', coordinates: [-129, 37] }, // feature
  );
  t.equals(result, true);
  t.end();
});

test('contains: point outside the search geometry is false', (t) => {
  const result = contains(searchGeometry, { type: 'Point', coordinates: [0, 0] });
  t.equals(result, false);
  t.end();
});

test('contains: search geometry contains a feature, true', (t) => {
  t.ok(contains(point, point));
  t.ok(contains(multiPoint, point));
  t.ok(contains(multiPoint, multiPoint));
  t.ok(contains(line, point));
  t.ok(contains(line, multiPoint));
  t.ok(contains(line, line));

  t.ok(contains(poly, point));
  t.ok(contains(poly, multiPoint));
  t.ok(contains(poly, line));
  t.ok(contains(poly, poly));

  t.ok(contains(multiLine, point));
  t.ok(contains(multiLine, line));
  t.ok(contains(multiLine, multiLine));
  t.ok(contains(multiLine, multiPoint));

  t.ok(contains(poly, multiLine));
  t.ok(contains(poly, multiPoly));

  t.ok(contains(multiPoly, point));
  t.ok(contains(multiPoly, line));
  t.ok(contains(multiPoly, multiLine));
  t.ok(contains(multiPoly, multiPoint));
  t.ok(contains(multiPoly, multiPoly));
  t.end();
});

test('contains: search geometry within a feature, false', (t) => {
  const pointOut = turf.point([0, 0]).geometry;
  t.notOk(contains(pointOut, point));
  t.notOk(contains(pointOut, multiPoint));
  t.notOk(contains(pointOut, line));
  t.notOk(contains(pointOut, multiLine));
  t.notOk(contains(pointOut, multiPoly));

  const multiPointOut = turf.multiPoint([
    [0, 0],
    [0, 0],
  ]).geometry;
  t.notOk(contains(multiPointOut, multiPoint));
  t.notOk(contains(multiPointOut, line));
  t.notOk(contains(multiPointOut, multiLine));
  t.notOk(contains(multiPointOut, poly));
  t.notOk(contains(multiPointOut, multiPoly));

  const lineOut = turf.lineString([
    [0, 0],
    [0, 1],
  ]).geometry;
  t.notOk(contains(lineOut, line));
  t.notOk(contains(lineOut, multiLine));
  t.notOk(contains(lineOut, poly));
  t.notOk(contains(lineOut, multiPoly));

  const multiLineOut = turf.multiLineString([
    [
      [0, 0],
      [0, 1],
    ],
    [
      [0, 0],
      [0, 1],
    ],
  ]).geometry;
  t.notOk(contains(multiLineOut, multiLine));
  t.notOk(contains(multiLineOut, poly));
  t.notOk(contains(multiLineOut, multiPoly));

  const polyOut = turf.polygon([
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [0, 0],
    ],
  ]).geometry;
  t.notOk(contains(polyOut, poly));
  t.notOk(contains(polyOut, multiPoly));

  t.notOk(contains(multiPoly2, multiPoly));
  t.end();
});
