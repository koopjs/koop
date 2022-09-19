const test = require('tape');
const proxyquire = require('proxyquire');
const modulePath = './to-esri-attributes';
const toEsriAttributes = proxyquire(modulePath, {
  '../helpers': {
    createIntegerHash: () => {
      return 99999;
    }
  }
});

test('toEsriAttributes, does not require idField', t => {
  // (properties, geometry, dateFields, requiresObjectId, idField)
  const result = toEsriAttributes({ foo: 'bar' }, { coordinates: [-118, 34] }, '', 'false', '');
  t.deepEquals(result, { foo: 'bar' });
  t.end();
});

test('toEsriAttributes, requires idField and properties contain it', t => {
  // (properties, geometry, dateFields, requiresObjectId, idField)
  const result = toEsriAttributes({ foo: 'bar', OBJECTID: 11111 }, { coordinates: [-118, 34] }, '', 'true', 'OBJECTID');
  t.deepEquals(result, { foo: 'bar', OBJECTID: 11111 });
  t.end();
});

test('toEsriAttributes, requires idField and properties do not have one, so create hash', t => {
  // (properties, geometry, dateFields, requiresObjectId, idField)
  const result = toEsriAttributes({ foo: 'bar' }, { coordinates: [-118, 34] }, '', 'true', 'null');
  t.deepEquals(result, { foo: 'bar', OBJECTID: 99999 });
  t.end();
});

test('toEsriAttributes, does not require idField, has dateFields', t => {
  // (properties, geometry, dateFields, requiresObjectId, idField)
  const date1 = new Date();
  const date2 = new Date(1000);
  const result = toEsriAttributes({ hello: 'world', foo: date1.toISOString(), bar: date2.toISOString() }, { coordinates: [-118, 34] }, 'foo,bar', 'false', '');
  t.deepEquals(result, { hello: 'world', foo: date1.getTime(), bar: date2.getTime() });
  t.end();
});

test('toEsriAttributes, does not require idField, has nested properties', t => {
  const result = toEsriAttributes({
    hello: 'world',
    nested: {
      foo: 'bar'
    }
  }, {
    coordinates: [-118, 34]
  },
  '',
  'false',
  '');
  t.deepEquals(result, { hello: 'world', nested: '{"foo":"bar"}' });
  t.end();
});
