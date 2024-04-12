const test = require('tape');
const normalizeGeometryFilterSpatialReference = require('./geometry-filter-spatial-reference');

test('undefined input', (t) => {
  t.plan(1);
  const { wkid } = normalizeGeometryFilterSpatialReference();
  t.equal(wkid, 4326);
});

test('undefined options', (t) => {
  t.plan(1);
  const { wkid } = normalizeGeometryFilterSpatialReference({});
  t.equal(wkid, 4326);
});

test('defer to geometry option', (t) => {
  t.plan(1);
  const options = {
    geometry: '100,200,300,400,3857',
    bbox: '100,200,300,400,4326',
    inSR: '4269',
  };
  const { wkid } = normalizeGeometryFilterSpatialReference(options);
  t.equal(wkid, 3857);
});

test('defer to bbox option if no geometry', (t) => {
  t.plan(1);
  const options = {
    bbox: '100,200,300,400,3857',
    inSR: '4269',
  };
  const { wkid } = normalizeGeometryFilterSpatialReference(options);
  t.equal(wkid, 3857);
});

test('geometry filter bbox missing spatial reference', (t) => {
  t.plan(1);
  const options = {
    geometry: '100,200,300,400',
    inSR: '4269',
  };
  const { wkid } = normalizeGeometryFilterSpatialReference(options);
  t.equal(wkid, 4269);
});

test('defer to geometry filter wkid', (t) => {
  t.plan(1);
  const options = {
    geometry: {
      spatialReference: {
        wkid: 4326,
      },
    },
    inSR: '4269',
  };
  const { wkid } = normalizeGeometryFilterSpatialReference(options);
  t.equal(wkid, 4326);
});

test('inSR string', (t) => {
  t.plan(1);
  const options = { inSR: '4269' };
  const { wkid } = normalizeGeometryFilterSpatialReference(options);
  t.equal(wkid, 4269);
});

test('inSR spatialReference object', (t) => {
  t.plan(1);
  const options = { inSR: { wkid: 4269 } };
  const { wkid } = normalizeGeometryFilterSpatialReference(options);
  t.equal(wkid, 4269);
});
