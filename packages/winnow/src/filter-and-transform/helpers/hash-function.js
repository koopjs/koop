const hashFixture = require('./hash-fixture');
const USE_JAVASCRIPT_HASHING =
  process.env.OBJECTID_FEATURE_HASH === 'javascript';
const murmurhash = require('murmurhash');

function getHashFunction() {
  if (USE_JAVASCRIPT_HASHING) {
    return murmurhash;
  }

  // Try to use farmhash, fallback to native JavaScript hashing library
  try {
    const hashFunction = require('farmhash').hash32;
    hashFunction(JSON.stringify(hashFixture));
    return hashFunction;
  } catch (e) {
    // eslint-disable-line
    console.info(
      'Using murmurhash as default hasher for OBJECTID auto-generate.',
    );
    return murmurhash;
  }
}

module.exports = getHashFunction();
