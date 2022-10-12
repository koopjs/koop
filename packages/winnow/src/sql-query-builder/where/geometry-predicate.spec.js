const test = require('tape');
const createGeometryPredicate = require('./geometry-predicate');
const normalizeQueryOptions = require('../../normalize-query-options');

test('geometryPredicate: returns undefined if no options', t => {
  t.plan(1);
  const geometryPredicate = createGeometryPredicate();
  t.equals(geometryPredicate, undefined);
});

test('geometryPredicate: returns undefined if empty options', t => {
  t.plan(1);
  const options = normalizeQueryOptions({});
  const geometryPredicate = createGeometryPredicate(options);
  t.equals(geometryPredicate, undefined);
});

test('geometryPredicate: returns default geometry function if geometry filter option is defined', t => {
  t.plan(1);
  const options = normalizeQueryOptions({ geometry: [0, 0, 0, 0] });
  const geometryPredicate = createGeometryPredicate(options);
  t.equals(geometryPredicate, 'ST_Intersects(geometry, ?)');
});

test('geometryPredicate: returns request geometry function if geometry filter and spatial-predicate options are defined', t => {
  t.plan(1);
  const options = normalizeQueryOptions({ geometry: [0, 0, 0, 0], spatialPredicate: 'ST_Contains' });
  const geometryPredicate = createGeometryPredicate(options);
  t.equals(geometryPredicate, 'ST_Contains(geometry, ?)');
});
