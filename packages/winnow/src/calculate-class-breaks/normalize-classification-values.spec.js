const test = require('tape');
const normalizeClassificationValues = require('./normalize-classification-values');

test('nomalizeClassificationValue: unsupported method', (spec) => {
  try {
    normalizeClassificationValues([], { normType: 'unsupported' });
    spec.fail('should have thrown error');
  } catch (error) {
    spec.equals(error.message, 'Normalization not supported: unsupported');
  }
  spec.end();
});

test('nomalizeClassificationValue: normalize by field, field undefined', (spec) => {
  try {
    normalizeClassificationValues([], { normType: 'field' });
    spec.fail('should have thrown error');
  } catch (error) {
    spec.equals(error.message, 'Normalization field is undefined');
  }
  spec.end();
});

test('nomalizeClassificationValue: normalize by field, no classification field', (spec) => {
  try {
    normalizeClassificationValues([], { normType: 'field', normField: 'foo' });
    spec.fail('should have thrown error');
  } catch (error) {
    spec.equals(error.message, 'Classification field is undefined');
  }
  spec.end();
});

test('nomalizeClassificationValue: normalize by field, fields not found', (spec) => {
  try {
    normalizeClassificationValues([], {
      normType: 'field',
      normField: 'foo',
      field: 'booz',
    });
    spec.fail('should have thrown error');
  } catch (error) {
    spec.equals(
      error.message,
      'Classification field "booz" and normalization field "foo" were not found on any feature.',
    );
  }
  spec.end();
});

test('nomalizeClassificationValue: normalize by field, normalization field not found in feature', (spec) => {
  try {
    normalizeClassificationValues([{ properties: { booz: 1 } }], {
      normType: 'field',
      normField: 'foo',
      field: 'booz',
    });
    spec.fail('should have thrown error');
  } catch (error) {
    spec.equals(
      error.message,
      'Classification field "booz" and normalization field "foo" were not found on any feature.',
    );
  }
  spec.end();
});

test('nomalizeClassificationValue: normalize by field, normalization field is non-numeric', (spec) => {
  try {
    normalizeClassificationValues(
      [{ properties: { booz: 1, foo: 'string' } }],
      { normType: 'field', normField: 'foo', field: 'booz' },
    );
    spec.fail('should have thrown error');
  } catch (error) {
    spec.equals(
      error.message,
      'Cannot use non-numeric normalizationField, foo: "string"',
    );
  }
  spec.end();
});

test('nomalizeClassificationValue: normalize by field, classification field is non-numeric', (spec) => {
  try {
    normalizeClassificationValues(
      [{ properties: { booz: 'string', foo: 10 } }],
      { normType: 'field', normField: 'foo', field: 'booz' },
    );
    spec.fail('should have thrown error');
  } catch (error) {
    spec.equals(
      error.message,
      'Cannot use non-numeric classificationField, booz: "string"',
    );
  }
  spec.end();
});

test('nomalizeClassificationValue: normalize by field', (spec) => {
  const result = normalizeClassificationValues(
    [{ properties: { booz: 1, foo: 10 } }],
    { normType: 'field', normField: 'foo', field: 'booz' },
  );
  spec.deepEquals(result, [0.1]);
  spec.end();
});

test('nomalizeClassificationValue: normalize by log, normalization field not found in feature', (spec) => {
  try {
    normalizeClassificationValues([{ properties: {} }], {
      normType: 'log',
      field: 'booz',
    });
    spec.fail('should have thrown error');
  } catch (error) {
    spec.equals(
      error.message,
      'Classification field "booz" was not found on any feature.',
    );
  }
  spec.end();
});

test('nomalizeClassificationValue: normalize by log, normalization field is non-numeric', (spec) => {
  try {
    normalizeClassificationValues([{ properties: { booz: 'string' } }], {
      normType: 'log',
      field: 'booz',
    });
    spec.fail('should have thrown error');
  } catch (error) {
    spec.equals(
      error.message,
      'Cannot use non-numeric classificationField, booz: "string"',
    );
  }
  spec.end();
});

test('nomalizeClassificationValue: normalize by log, less than 0', (spec) => {
  const result = normalizeClassificationValues([{ properties: { booz: -1 } }], {
    normType: 'log',
    field: 'booz',
  });
  spec.deepEquals(result, [0]);
  spec.end();
});

test('nomalizeClassificationValue: normalize by log, 0', (spec) => {
  const result = normalizeClassificationValues([{ properties: { booz: 0 } }], {
    normType: 'log',
    field: 'booz',
  });
  spec.deepEquals(result, [0]);
  spec.end();
});

test('nomalizeClassificationValue: normalize by log', (spec) => {
  const result = normalizeClassificationValues(
    [{ properties: { booz: 200 } }],
    { normType: 'log', field: 'booz' },
  );
  spec.deepEquals(result, [2.3010299956639813]);
  spec.end();
});

test('nomalizeClassificationValue: normalize by percent, classification field not found in feature', (spec) => {
  try {
    normalizeClassificationValues([{ properties: {} }, { properties: {} }], {
      normType: 'percent',
      field: 'booz',
    });
    spec.fail('should have thrown error');
  } catch (error) {
    spec.equals(
      error.message,
      'Cannot normalize by percent because value total is not greater than 0: 0',
    );
  }
  spec.end();
});

test('nomalizeClassificationValue: normalize by percent, value total <= 0', (spec) => {
  try {
    normalizeClassificationValues(
      [{ properties: { booz: 1 } }, { properties: { booz: -2 } }],
      { normType: 'percent', field: 'booz' },
    );
    spec.fail('should have thrown error');
  } catch (error) {
    spec.equals(
      error.message,
      'Cannot normalize by percent because value total is not greater than 0: -1',
    );
  }
  spec.end();
});

test('nomalizeClassificationValue: normalize by percent', (spec) => {
  const result = normalizeClassificationValues(
    [{ properties: { booz: 1 } }, { properties: { booz: 9 } }],
    { normType: 'percent', field: 'booz' },
  );
  spec.deepEquals(result, [10, 90]);
  spec.end();
});
