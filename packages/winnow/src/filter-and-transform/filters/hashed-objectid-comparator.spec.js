const test = require('tape');
const hashedObjectIdComparator = require('./hashed-objectid-comparator');
const createIntegerHash = require('../helpers/create-integer-hash');

const properties = { foo: 'bar' };
const geometry = { type: 'Point', coordinates: [44, -84.5] };
const objectId = createIntegerHash(JSON.stringify({ properties, geometry }));

test('hashedObjectIdComparator: =, should return true', t => {
  const result = hashedObjectIdComparator(properties, geometry, objectId, '=');
  t.equals(result, true);
  t.end();
});

test('hashedObjectIdComparator: !=, should return true', t => {
  const result = hashedObjectIdComparator(properties, geometry, -9999, '!=');
  t.equals(result, true);
  t.end();
});

test('hashedObjectIdComparator: >, should return true', t => {
  const result = hashedObjectIdComparator(properties, geometry, 0, '>');
  t.equals(result, true);
  t.end();
});

test('hashedObjectIdComparator: >=, should return true', t => {
  const result = hashedObjectIdComparator(properties, geometry, 0, '>=');
  t.equals(result, true);
  t.end();
});

test('hashedObjectIdComparator: >, should return true', t => {
  const result = hashedObjectIdComparator(properties, geometry, 9999999999, '<');
  t.equals(result, true);
  t.end();
});

test('hashedObjectIdComparator: >=, should return true', t => {
  const result = hashedObjectIdComparator(properties, geometry, 9999999999, '<=');
  t.equals(result, true);
  t.end();
});
