const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const toGeohash = require('./to-geohash');
const modulePath = './to-geohash';

test('toGeohash, empty input, returns undefined', (t) => {
  const result = toGeohash();
  t.equals(result, undefined);
  t.end();
});

test('toGeohash, empty geometry object, returns undefined', (t) => {
  const result = toGeohash();
  t.equals(result, undefined);
  t.end();
});

test('project, missing input geometry coordinates, return input geometry', (t) => {
  const result = toGeohash({ type: 'Point' });
  t.deepEquals(result, undefined);
  t.end();
});

test('project, missing input geometry type, return input geometry', (t) => {
  const result = toGeohash({ coordinates: [] });
  t.deepEquals(result, undefined);
  t.end();
});

test('toGeohash, point input, returns geohash', (t) => {
  const geohashSpy = sinon.spy(function () {
    return 'geohash-result';
  });
  const centroidSpy = sinon.spy(function () {
    return { coordinates: [11, 19] };
  });
  const toGeohash = proxyquire(modulePath, {
    ngeohash: {
      encode: geohashSpy,
    },
    '@turf/centroid': {
      default: centroidSpy,
    },
  });
  const result = toGeohash({ type: 'Point', coordinates: [23, 24] });
  t.equals(result, 'geohash-result');
  t.ok(geohashSpy.calledOnce);
  t.deepEquals(geohashSpy.firstCall.args, [24, 23, 8]);
  t.ok(centroidSpy.notCalled);
  t.end();
});

test('toGeohash, non-point input, returns geohash', (t) => {
  const geohashSpy = sinon.spy(function () {
    return 'geohash-result';
  });
  const centroidSpy = sinon.spy(function () {
    return { coordinates: [11, 19] };
  });
  const toGeohash = proxyquire(modulePath, {
    ngeohash: {
      encode: geohashSpy,
    },
    '@turf/centroid': {
      default: centroidSpy,
    },
  });
  const result = toGeohash({
    type: 'Polygon',
    coordinates: 'polygon-coordinates',
  });
  t.equals(result, 'geohash-result');
  t.ok(geohashSpy.calledOnce);
  t.deepEquals(geohashSpy.firstCall.args, [19, 11, 8]);
  t.ok(centroidSpy.calledOnce);
  t.deepEquals(centroidSpy.firstCall.args, [
    { type: 'Polygon', coordinates: 'polygon-coordinates' },
  ]);
  t.end();
});

test('toGeohash, point input, precision input, returns geohash', (t) => {
  const geohashSpy = sinon.spy(function () {
    return 'geohash-result';
  });
  const centroidSpy = sinon.spy(function () {
    return { coordinates: [11, 19] };
  });
  const toGeohash = proxyquire(modulePath, {
    ngeohash: {
      encode: geohashSpy,
    },
    '@turf/centroid': {
      default: centroidSpy,
    },
  });
  const result = toGeohash({ type: 'Point', coordinates: [23, 24] }, 5);
  t.equals(result, 'geohash-result');
  t.ok(geohashSpy.calledOnce);
  t.deepEquals(geohashSpy.firstCall.args, [24, 23, 5]);
  t.ok(centroidSpy.notCalled);
  t.end();
});
