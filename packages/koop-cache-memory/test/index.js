const test = require('tape');
const Cache = require('../src');
const cache = new Cache();
const _ = require('lodash');
const { asCachableGeojson } = require('../src/helper');

function getFeatures() {
  return {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: {
        type: 'EPSG:4326',
      },
    },
    metadata: {
      name: 'Test',
      description: 'Test',
    },
    features: [
      {
        type: 'Feature',
        properties: {
          key: 'value',
        },
        geometry: {
          foo: 'bar',
        },
      },
    ],
  };
}

test('Inserting and retreiving from the cache', (t) => {
  const geojson = getFeatures();
  cache.insert('key', geojson, { ttl: 600 });
  const cached = cache.retrieve('key');
  t.equal(cached.features[0].properties.key, 'value', 'retrieved features');
  t.equal(cached.crs.type, 'name', 'retrieved coordinate reference system');
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata');
  t.ok(cached._cache.expires, 'expiration set');
  t.ok(cached._cache.updated, 'updated set');
  t.end();
});

test('Upserting and streaming from the cache', (t) => {
  const geojson = getFeatures();
  cache.upsert('key', geojson, { ttl: 600 });
  const readstream = cache.createStream('key');
  readstream.on('data', (chunk) => {
    t.deepEquals(chunk, geojson.features[0]);
    t.end();
  });
});

test('Inserting and retreiving from the cache using upsert when the cache is empty', (t) => {
  const geojson = getFeatures();
  cache.upsert('keyupsert', geojson, { ttl: 600 });
  const cached = cache.retrieve('keyupsert');
  t.equal(cached.features[0].properties.key, 'value', 'retrieved features');
  t.equal(cached.crs.type, 'name', 'retrieved coordinate reference system');
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata');
  t.ok(cached._cache.expires, 'expiration set');
  t.ok(cached._cache.updated, 'updated set');
  t.end();
});

test('Inserting and retreiving from the cache using upsert when the cache is filled', (t) => {
  const geojson = getFeatures();
  cache.insert('keyupsertupdate', geojson, { ttl: 600 });
  const geojson2 = _.cloneDeep(geojson);
  geojson2.features[0].properties['key'] = 'updated';
  cache.upsert('keyupsertupdate', geojson2, { ttl: 600 });
  const cached = cache.retrieve('keyupsertupdate');
  t.equal(cached.features[0].properties.key, 'updated', 'retrieved features');
  t.equal(cached.crs.type, 'name', 'retrieved coordinate reference system');
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata');
  t.ok(cached._cache.expires, 'expiration set');
  t.ok(cached._cache.updated, 'updated set');
  t.end();
});

test('Inserting and retreiving from the cache callback style', (t) => {
  const geojson = getFeatures();
  cache.insert('keyb', geojson, { ttl: 600 }, (err) => {
    t.error(err, 'no error');
    const cached = cache.retrieve('keyb');
    t.equal(cached.features[0].properties.key, 'value', 'retrieved features');
    t.equal(cached.crs.type, 'name', 'retrieved coordinate reference system');
    t.equal(cached.metadata.name, 'Test', 'retrieved metadata');
    t.ok(cached._cache.expires, 'expiration set');
    t.ok(cached._cache.updated, 'updated set');
    t.end();
  });
});

test('Inserting and appending to the cache', (t) => {
  const geojson = getFeatures();
  cache.insert('key2', geojson, { ttl: 600 });
  cache.append('key2', geojson);
  const cached = cache.retrieve('key2');
  t.equal(cached.features.length, 2, 'retrieved all features');
  t.equal(cached.crs.type, 'name', 'retrieved coordinate reference system');
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata');
  t.ok(cached._cache.expires, 'expiration set');
  t.ok(cached._cache.updated, 'updated set');
  t.end();
});

test('Updating an existing entry in the cache', (t) => {
  const geojson = getFeatures();
  cache.insert('key3', geojson, { ttl: 600 });
  const geojson2 = _.cloneDeep(geojson);
  geojson2.features[0].properties.key = 'test2';
  cache.update('key3', geojson2, { ttl: 1000 });
  const cached = cache.retrieve('key3');
  t.equal(
    cached.features[0].properties.key,
    'test2',
    'retrieved only new features'
  );
  t.equal(cached.features.length, 1, 'retrieved only new features');
  t.equal(
    cached.crs.type,
    'name',
    'retrieved original coordinate reference system'
  );
  t.equal(cached.metadata.name, 'Test', 'retrieved original metadata');
  t.ok(cached._cache.expires, 'expiration set');
  t.ok(cached._cache.updated, 'updated set');
  t.end();
});

test('Inserting and deleting from the cache', (t) => {
  const geojson = getFeatures();
  t.plan(2);
  cache.insert('key4', geojson);
  cache.delete('key4');
  cache.retrieve('key4', {}, (err, data) => {
    t.ok(err, 'Should return an error');
    t.equal(
      err.message,
      'Resource not found',
      'Error should have correct message'
    );
  });
});

test('Trying to call insert when something is already in the cache', (t) => {
  const geojson = getFeatures();
  t.plan(2);
  cache.insert('key5', geojson);
  cache.insert('key5', geojson, {}, (err) => {
    t.ok(err, 'Should return an error');
    t.equal(
      err.message,
      'Cache key is already in use',
      'Error should have correct message'
    );
  });
});

test('Trying to delete the catalog entry when something is still in the cache', (t) => {
  const geojson = getFeatures();
  t.plan(2);
  cache.insert('key6', geojson);
  cache.catalogDelete('key6', (err) => {
    t.ok(err, 'Should return an error');
    t.equal(
      err.message,
      'Cannot delete catalog entry while data is still in cache',
      'Error should have correct message'
    );
  });
});

test('Retrieve catalog entry after its data has been deleted', (t) => {
  const geojson = getFeatures();
  t.plan(1);
  cache.insert('key6', geojson);
  cache.delete('key6');
  const catalogEntry = cache.catalogRetrieve('key6');
  t.deepEquals(_.omit(catalogEntry, '_cache'), {
    type: 'FeatureCollection',
    crs: { type: 'name', properties: { type: 'EPSG:4326' } },
    metadata: { name: 'Test', description: 'Test' },
  });
});

test('Delete the catalog entry after its data has been deleted', (t) => {
  const geojson = getFeatures();
  t.plan(2);
  cache.insert('key6', geojson);
  cache.delete('key6');
  cache.catalogDelete('key6');
  cache.catalogRetrieve('key6', (err) => {
    t.ok(err, 'Should return an error');
    t.equal(
      err.message,
      'Resource not found',
      'Error should have correct message'
    );
  });
});

test('Helper prepares geojson for cache', (t) => {
  const full = getFeatures();
  const features = full.features;
  const empty = {};
  const fullGeojson = asCachableGeojson(full);
  const featuresAsGeojson = asCachableGeojson(features);
  const emptyAsGeojson = asCachableGeojson(empty);
  const nullAsGeojson = asCachableGeojson(null);
  const undefinedAsGeojson = asCachableGeojson(undefined);
  t.equal(
    fullGeojson.features[0].properties.key,
    'value',
    'Full geojson stays geojson'
  );
  t.equal(
    featuresAsGeojson.features[0].properties.key,
    'value',
    'Features is converted to geojson'
  );
  t.equal(emptyAsGeojson.features.length, 0, 'Empty object becomes geojson');
  t.equal(nullAsGeojson.features.length, 0, 'Null object becomes geojson');
  t.equal(
    undefinedAsGeojson.features.length,
    0,
    'Undefined object becomes geojson'
  );
  t.end();
});

test('Post-insert edits to geojson should not mutate cache', (t) => {
  const geojson = getFeatures();
  cache.insert('key', geojson, { ttl: 600 });
  geojson.features[0].properties.key = 'fooz';
  const cached = cache.retrieve('key');
  t.equal(cached.features[0].properties.key, 'value', 'retrieved features');
  t.equal(cached.crs.type, 'name', 'retrieved coordinate reference system');
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata');
  t.ok(cached._cache.expires, 'expiration set');
  t.ok(cached._cache.updated, 'updated set');
  t.end();
});

test('Post-update edits to geojson should not mutate cache', (t) => {
  const geojson = getFeatures();
  const geojson2 = _.cloneDeep(geojson);
  geojson2.features[0].properties.key = 'test2';

  cache.insert('key3', geojson, { ttl: 600 });
  cache.update('key3', geojson2, { ttl: 1000 });
  geojson.features[0].properties.key = 'fooz';
  const cached = cache.retrieve('key3');
  t.equal(
    cached.features[0].properties.key,
    'test2',
    'retrieved unmutated feature'
  );
  t.end();
});
