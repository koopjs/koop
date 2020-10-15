const hashFixture = require('./hash-fixture.json')
const USE_JAVASCRIPT_HASHING = process.env.OBJECTID_FEATURE_HASH === 'javascript'
const stringHash = require('string-hash')

function getHashFunction () {
  if (USE_JAVASCRIPT_HASHING) return stringHash

  // Try to use farmhash, fallback to JavaScript only hashing library
  try {
    const hashFunction = require('farmhash').hash32
    hashFunction(JSON.stringify(hashFixture))
    return hashFunction
  } catch (e) {
    return stringHash
  }
}

module.exports = getHashFunction()
