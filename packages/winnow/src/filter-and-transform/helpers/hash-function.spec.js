const test = require('tape');
const proxyquire = require('proxyquire');
const modulePath = './hash-function';
const stub = {
  'murmurhash': () => { return 'murmurhash'; },
  'farmhash': { // eslint-disable-line
    hash32: () => { return 'farmhash'; }
  }
};

test('hashFunction: ENV variable forces use of murmurhash', t => {
  t.plan(1);
  process.env.OBJECTID_FEATURE_HASH = 'javascript';
  const hashFunction = proxyquire(modulePath, stub);
  t.equals(hashFunction(), 'murmurhash');
  process.env.OBJECTID_FEATURE_HASH = undefined;
});

test('hashFunction: default use of farmhash', t => {
  t.plan(1);
  const hashFunction = proxyquire(modulePath, stub);
  t.equals(hashFunction(), 'farmhash');
});

test('hashFunction: fallback use of murmurhash', t => {
  t.plan(1);
  const stub = {
    'murmurhash': () => { return 'murmurhash'; },
    'farmhash': { // eslint-disable-line
      hash32: () => { throw new Error(); }
    }
  };
  const hashFunction = proxyquire(modulePath, stub);
  t.equals(hashFunction(), 'murmurhash');
});
