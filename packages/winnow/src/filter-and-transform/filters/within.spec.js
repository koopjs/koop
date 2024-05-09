const test = require('tape');
const within = require('./within');
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

test('within: empty input', (t) => {
  const result = within(poly);
  t.equals(result, false);
  t.end();
});

test('within: empty object input', (t) => {
  const result = within(poly, {});
  t.equals(result, false);
  t.end();
});

test('within: null input', (t) => {
  const result = within(poly, null);
  t.equals(result, false);
  t.end();
});

test('within: missing geometry type', (t) => {
  const result = within(poly, { coordinates: [44, 84] });
  t.equals(result, false);
  t.end();
});

test('within: missing coordinates', (t) => {
  const result = within(poly, { type: 'Point' });
  t.equals(result, false);
  t.end();
});

test('within: missing empty coordinates', (t) => {
  const result = within(poly, { type: 'Point', coordinates: [] });
  t.equals(result, false);
  t.end();
});

test('within: search geometry within a feature, true', (t) => {
  t.ok(within(point, point));
  t.ok(within(point, multiPoint));
  t.ok(within(point, line));
  t.ok(within(point, multiLine));
  t.ok(within(point, poly));
  t.ok(within(point, multiPoly));

  t.ok(within(multiPoint, multiPoint));
  t.ok(within(multiPoint, line));
  t.ok(within(multiPoint, multiLine));
  t.ok(within(multiPoint, poly));
  t.ok(within(multiPoint, multiPoly));

  t.ok(within(line, line));
  t.ok(within(line, multiLine));
  t.ok(within(line, poly));
  t.ok(within(line, multiPoly));

  t.ok(within(multiLine, multiLine));
  t.ok(within(multiLine, poly));
  t.ok(within(multiLine, multiPoly));

  t.ok(within(poly, poly));
  t.ok(within(poly, multiPoly));
  t.end();
});

test('within: search geometry within a feature, false', (t) => {
  const pointOut = turf.point([0, 0]).geometry;
  t.notOk(within(pointOut, point));
  t.notOk(within(pointOut, multiPoint));
  t.notOk(within(pointOut, line));
  t.notOk(within(pointOut, multiLine));
  t.notOk(within(pointOut, multiPoly));

  t.notOk(within(multiPoint, point));

  const multiPointOut = turf.multiPoint([
    [0, 0],
    [0, 0],
  ]).geometry;
  t.notOk(within(multiPointOut, multiPoint));
  t.notOk(within(multiPointOut, line));
  t.notOk(within(multiPointOut, multiLine));
  t.notOk(within(multiPointOut, poly));
  t.notOk(within(multiPointOut, multiPoly));

  const lineOut = turf.lineString([
    [0, 0],
    [0, 1],
  ]).geometry;
  t.notOk(within(lineOut, line));
  t.notOk(within(lineOut, multiLine));
  t.notOk(within(lineOut, poly));
  t.notOk(within(lineOut, multiPoly));

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
  t.notOk(within(multiLineOut, multiLine));
  t.notOk(within(multiLineOut, poly));
  t.notOk(within(multiLineOut, multiPoly));

  const polyOut = turf.polygon([
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [0, 0],
    ],
  ]).geometry;
  t.notOk(within(polyOut, poly));
  t.notOk(within(polyOut, multiPoly));

  t.notOk(within(multiPoly, multiPoly));
  t.end();
});
