const test = require('tape');
const normalizeCollection = require('./collection');

test('normalize-options, collection: undefined', (t) => {
  t.plan(1);
  const normalized = normalizeCollection();
  t.equal(normalized, undefined);
});

test('normalize-options, collection: add metadata object', (t) => {
  t.plan(1);
  const normalized = normalizeCollection({});
  t.deepEquals(normalized, { metadata: {} });
});

test('normalize-options, collection: unable to generate metadata fields without feature', (t) => {
  t.plan(1);
  const normalized = normalizeCollection({}, []);
  t.deepEquals(normalized, { metadata: {} });
});

test('normalize-options, collection: metadata.fields already defined', (t) => {
  t.plan(1);
  const normalized = normalizeCollection({ metadata: { fields: ['abc'] } });
  t.deepEquals(normalized, { metadata: { fields: ['abc'] } });
});

test('normalize-options, collection: generate metadata fields from feature', (t) => {
  t.plan(1);
  const normalized = normalizeCollection({}, [{ properties: { name: 'test' } }]);
  t.deepEquals(normalized, {
    metadata: {
      fields: [
        {
          name: 'name',
          type: 'String',
        },
      ],
    },
  });
});
