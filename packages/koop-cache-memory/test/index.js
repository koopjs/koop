const test = require('tape')
const Cache = require('../src')
const cache = new Cache()
const _ = require('lodash')
const geojson = {
  type: 'FeatureCollection',
  metadata: {
    name: 'Test',
    description: 'Test'
  },
  features: [
    {
      type: 'Feature',
      properties: {
        key: 'value'
      },
      geometry: {
        foo: 'bar'
      }
    }
  ]
}

test('Inserting and retreiving from the cache', t => {
  const now = Date.now()
  cache.insert('key', geojson, {ttl: 600})
  const cached = cache.retrieve('key')
  t.equal(cached.features[0].properties.key, 'value', 'retrieved features')
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata')
  t.equal(cached.metadata.expires <= now + 1000 * 600, true, 'expiration set correctly')
  t.equal(cached.metadata.updated >= now, true, 'updated set correctly')
  t.end()
})

test('Inserting and appending to the cache', t => {
  const now = Date.now()
  cache.insert('key2', geojson, {ttl: 600})
  cache.append('key2', geojson)
  const cached = cache.retrieve('key2')
  t.equal(cached.features.length, 2, 'retrieved all features')
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata')
  t.equal(cached.metadata.expires <= now + 1000 * 600, true, 'expiration set correctly')
  t.equal(cached.metadata.updated >= now, true, 'updated set correctly')
  t.end()
})

test('Updating an existing entry in the cache', t => {
  cache.insert('key3', geojson, {ttl: 600})
  const geojson2 = _.cloneDeep(geojson)
  geojson2.features[0].properties.key = 'test2'
  const now = Date.now()
  cache.update('key3', geojson2, {ttl: 1000})
  const cached = cache.retrieve('key3')
  t.equal(cached.features[0].properties.key, 'test2', 'retrieved only new features')
  t.equal(cached.features.length, 1, 'retrieved only new features')
  t.equal(cached.metadata.name, 'Test', 'retrieved original metadata')
  t.equal(cached.metadata.expires, now + 1000 * 1000, 'expiration updated correct;y')
  t.equal(cached.metadata.updated >= now, true, 'updated set correctly')
  t.end()
})

test('Inserting and deleting from the cache', t => {
  t.plan(2)
  cache.insert('key4', geojson)
  cache.delete('key4')
  cache.retrieve('key4', {}, (err, data) => {
    t.ok(err, 'Should return an error')
    t.equal(err.message, 'Resource not found', 'Error should have correct message')
  })
})
