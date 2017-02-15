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
  cache.insert('key', geojson, {ttl: 600})
  const cached = cache.retrieve('key')
  t.equal(cached.features[0].properties.key, 'value', 'retrieved features')
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata')
  t.ok(cached.metadata.expires, 'expiration set')
  t.ok(cached.metadata.updated, 'updated set')
  t.end()
})

test('Inserting and retreiving from the cache using upsert when the cache is empty', t => {
  cache.upsert('keyupsert', geojson, {ttl: 600})
  const cached = cache.retrieve('keyupsert')
  t.equal(cached.features[0].properties.key, 'value', 'retrieved features')
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata')
  t.ok(cached.metadata.expires, 'expiration set')
  t.ok(cached.metadata.updated, 'updated set')
  t.end()
})

test('Inserting and retreiving from the cache using upsert when the cache is filled', t => {
  cache.insert('keyupsertupdate', geojson, {ttl: 600})
  const geojson2 = _.cloneDeep(geojson)
  geojson2.features[0].properties['key'] = 'updated'
  cache.upsert('keyupsertupdate', geojson2, {ttl: 600})
  const cached = cache.retrieve('keyupsertupdate')
  t.equal(cached.features[0].properties.key, 'updated', 'retrieved features')
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata')
  t.ok(cached.metadata.expires, 'expiration set')
  t.ok(cached.metadata.updated, 'updated set')
  t.end()
})

test('Inserting and retreiving from the cache callback style', t => {
  cache.insert('keyb', geojson, {ttl: 600}, (err) => {
    t.error(err, 'no error')
    const cached = cache.retrieve('keyb')
    t.equal(cached.features[0].properties.key, 'value', 'retrieved features')
    t.equal(cached.metadata.name, 'Test', 'retrieved metadata')
    t.ok(cached.metadata.expires, 'expiration set')
    t.ok(cached.metadata.updated, 'updated set')
    t.end()
  })
})

test('Inserting and appending to the cache', t => {
  cache.insert('key2', geojson, {ttl: 600})
  cache.append('key2', geojson)
  const cached = cache.retrieve('key2')
  t.equal(cached.features.length, 2, 'retrieved all features')
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata')
  t.ok(cached.metadata.expires, 'expiration set')
  t.ok(cached.metadata.updated, 'updated set')
  t.end()
})

test('Updating an existing entry in the cache', t => {
  cache.insert('key3', geojson, {ttl: 600})
  const geojson2 = _.cloneDeep(geojson)
  geojson2.features[0].properties.key = 'test2'
  cache.update('key3', geojson2, {ttl: 1000})
  const cached = cache.retrieve('key3')
  t.equal(cached.features[0].properties.key, 'test2', 'retrieved only new features')
  t.equal(cached.features.length, 1, 'retrieved only new features')
  t.equal(cached.metadata.name, 'Test', 'retrieved original metadata')
  t.ok(cached.metadata.expires, 'expiration set')
  t.ok(cached.metadata.updated, 'updated set')
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

test('Trying to call insert when something is already in the cache', t => {
  t.plan(2)
  cache.insert('key5', geojson)
  cache.insert('key5', geojson, {}, err => {
    t.ok(err, 'Should return an error')
    t.equal(err.message, 'Cache key is already in use', 'Error should have correct message')
  })
})

test('Trying to delete the catalog entry when something is still in the cache', t => {
  t.plan(2)
  cache.insert('key6', geojson)
  cache.catalog.delete('key6', err => {
    t.ok(err, 'Should return an error')
    t.equal(err.message, 'Cannot delete catalog entry while data is still in cache', 'Error should have correct message')
  })
})
