const test = require('tape');
const proxyquire = require('proxyquire');
const modulePath = './to-esri-attributes';
const toEsriAttributes = require(modulePath);

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

test('toEsriAttributes, requires idField, properties contain it, but logs debug message', t => {
  const toEsriAttributes = proxyquire(modulePath, {
    '../../log-manager': {
      logger: {
        debug: (message) => {
          t.equals(message, `Unique-identifier (\`OBJECTID\`) has a value (abc) that is not a valid integer (0 to ${Number.MAX_SAFE_INTEGER}); this may cause problems in some clients.`);
        }
      }
    }
  });
  // (properties, geometry, dateFields, requiresObjectId, idField)
  const result = toEsriAttributes({ foo: 'bar', OBJECTID: 'abc' }, { coordinates: [-118, 34] }, '', 'true', 'OBJECTID');
  t.deepEquals(result, { foo: 'bar', OBJECTID: 'abc' });
  t.end();
});

test('toEsriAttributes, requires idField and properties do not have one, so create hash', t => {
  const toEsriAttributes = proxyquire(modulePath, {
    '../helpers': {
      createIntegerHash: (string) => {
        t.deepEquals(string, '{"properties":{"foo":"bar"},"geometry":{"coordinates":[-118,34]}}');
        return 99999;
      }
    }
  });
  
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

test('toEsriAttributes, require idField, has dateFields', t => {
  const date1 = new Date();
  const date2 = new Date(1000);
  
  const toEsriAttributes = proxyquire(modulePath, {
    '../helpers': {
      createIntegerHash: (string) => {
        t.deepEquals(string, `{"properties":{"hello":"world","foo":"${date1.toISOString()}","bar":"${date2.toISOString()}"},"geometry":{"coordinates":[-118,34]}}`);
        return 99999;
      }
    }
  });
  
  // (properties, geometry, dateFields, requiresObjectId, idField)
  const result = toEsriAttributes({ hello: 'world', foo: date1.toISOString(), bar: date2.toISOString() }, { coordinates: [-118, 34] }, 'foo,bar', 'true', 'null');
  t.deepEquals(result, { OBJECTID: 99999, hello: 'world', foo: date1.getTime(), bar: date2.getTime() });
  t.end();
});

test('toEsriAttributes, does not require idField, has null dateField', t => {
  // (properties, geometry, dateFields, requiresObjectId, idField)
  const date2 = new Date(1000);
  const result = toEsriAttributes({ hello: 'world', foo: null, bar: date2.toISOString() }, { coordinates: [-118, 34] }, 'foo,bar', 'false', '');
  t.deepEquals(result, { hello: 'world', foo: null, bar: date2.getTime() });
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
