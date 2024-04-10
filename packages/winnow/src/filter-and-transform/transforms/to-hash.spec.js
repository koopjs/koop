const test = require('tape');
const toHash = require('./to-hash');

test('transformToHash, empty hashStore', (spec) => {
  const result = toHash('foobar');
  spec.deepEquals(result, { foobar: 1 });
  spec.end();
});

test('transformToHash, initial count', (spec) => {
  const result = toHash('foobar', { hello: 1 });
  spec.deepEquals(result, { foobar: 1, hello: 1 });
  spec.end();
});

test('transformToHash, subsequent count', (spec) => {
  const result = toHash('foobar', { foobar: 1, hello: 1 });
  spec.deepEquals(result, { foobar: 2, hello: 1 });
  spec.end();
});
