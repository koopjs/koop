const test = require('tape');
const isDifferentCrs = require('./is-different-crs');

test('isDifferentCrs: different WKIDs', (t) => {
  t.plan(1);
  const result = isDifferentCrs({ wkid: 4326 }, { wkid: 3857 });
  t.equals(result, true);
});

test('isDifferentCrs: same WKIDs', (t) => {
  t.plan(1);
  const result = isDifferentCrs({ wkid: 4326 }, { wkid: 4326 });
  t.equals(result, false);
});

test('isDifferentCrs: different WKTs', (t) => {
  t.plan(1);
  const result = isDifferentCrs({ wkt: 'wkt-string' }, { wkt: 'foodbar' });
  t.equals(result, true);
});

test('isDifferentCrs: same WKTs', (t) => {
  t.plan(1);
  const result = isDifferentCrs({ wkt: 'wkt-string' }, { wkt: 'wkt-string' });
  t.equals(result, false);
});

test('isDifferentCrs: different WKTs', (t) => {
  t.plan(1);
  const result = isDifferentCrs({ wkt: 'wkt-string' }, { wkt: 'foodbar' });
  t.equals(result, true);
});

test('isDifferentCrs: mixed wkt and wkid', (t) => {
  t.plan(1);
  const result = isDifferentCrs({ wkid: 4326 }, { wkt: 'wkt-string' });
  t.equals(result, true);
});

test('isDifferentCrs: mixed wkt and wkid', (t) => {
  t.plan(1);
  const result = isDifferentCrs({ wkt: 'wkt-string' }, { wkid: 4326 });
  t.equals(result, true);
});
