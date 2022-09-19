const test = require('tape');
const { getCollectionCrs } = require('./');

test('getCollectionCrs: no collection', t => {
  t.plan(1);
  const crs = getCollectionCrs();
  t.equals(crs, undefined);
});

test('getCollectionCrs: no crs', t => {
  t.plan(1);
  const crs = getCollectionCrs({});
  t.equals(crs, undefined);
});

test('getCollectionCrs: no crs object', t => {
  t.plan(1);
  const crs = getCollectionCrs({ crs: {} });
  t.equals(crs, undefined);
});

test('getCollectionCrs: bad crs definition', t => {
  t.plan(1);
  const crs = getCollectionCrs({ crs: { properties: { name: 'foodbar' } } });
  t.equals(crs, undefined);
});

test('getCollectionCrs: WGS84 definition', t => {
  t.plan(1);
  const crs = getCollectionCrs({ crs: { properties: { name: 'urn:ogc:def:crs:ogc:1.3:crs84' } } });
  t.equals(crs, undefined);
});

test('getCollectionCrs: non-WGS84 definition', t => {
  t.plan(1);
  const crs = getCollectionCrs({ crs: { properties: { name: 'urn:ogc:def:crs:EPSG::2285' } } });
  t.equals(crs, '2285');
});
