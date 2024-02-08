const test = require('tape');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const delay = promisify(setTimeout); 
const Cache = require('../src');
const cache = new Cache();

test('Inserting and retreiving from the cache', async (t) => {
  const geojson = getFeatureCollection();
  const key = uuidv4();
  await cache.insert(key, geojson, { ttl: 600 });
  try {
    const cached = await cache.retrieve(key, {});
    t.equal(cached.features[0].properties.fooz, 'ball', 'retrieved features');
    t.equal(cached.crs.type, 'name', 'retrieved coordinate reference system');
    t.equal(cached.metadata.name, 'Test', 'retrieved metadata');
  } catch (error) {
    t.fail(error.message);
  }
  t.end();
});

test('cache should expire entries, return null', async (t) => {
  const geojson = getFeatureCollection();
  const key = uuidv4();
  await cache.insert(key, geojson, { ttl: 1 });
  await delay(1500);
  const cached = await cache.retrieve(key, {});
  t.equals(cached, null);
  t.end();
});

test('Inserting and retreiving geojson from the cache', async (t) => {
  const geojson = getFeatureCollection();
  const key = uuidv4();
  await cache.insert(key, geojson, { ttl: 600 });
  const cached = await cache.retrieve(key, {});
  t.equal(cached.features[0].properties.fooz, 'ball', 'retrieved features');
  t.equal(cached.crs.type, 'name', 'retrieved coordinate reference system');
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata');
  t.end();
});

test('retrieve partial entry with pick option', async (t) => {
  const geojson = getFeatureCollection();
  const key = uuidv4();
  await cache.insert(key, geojson, { ttl: 600 });
  const cached =  await cache.retrieve(key, { pick: ['features'] });
  t.deepEqual(Object.keys(cached), ['features'], 'retrieved only features');
  t.end();
});

test('retrieve partial entry with omit option', async (t) => {
  const geojson = getFeatureCollection();
  const key = uuidv4();
  await cache.insert(key, geojson, { ttl: 600 });
  const cached =  await cache.retrieve(key, { omit: ['features'] });
  t.deepEqual(
    Object.keys(cached),
    ['type', 'crs', 'metadata'],
    'retrieved everything but features',
  );
  t.end();
});

test('Inserting and retreiving json from the cache', async (t) => {
  const key = uuidv4();
  await cache.insert(key, { layers: [], tables: [], count: 0 }, { ttl: 600 });
  const cached = await cache.retrieve(key, {});
  t.deepEquals(cached, { layers: [], tables: [], count: 0 });
  t.end();
});

test('Inserting and deleting from the cache', async (t) => {
  const geojson = getFeatureCollection();
  const key = uuidv4();
  await cache.insert(key, geojson, {});
  await cache.delete(key);
  const cached = await cache.retrieve(key, {});
  t.equals(cached, null);
  t.end();
});

test('Post-insert edits to geojson should not mutate cache', async (t) => {
  const geojson = getFeatureCollection();
  await cache.insert('key', geojson, { ttl: 600 });
  geojson.features[0].properties.key = 'fooz';
  const cached = await cache.retrieve('key', {});
  t.equal(cached.features[0].properties.fooz, 'ball', 'retrieved features');
  t.equal(cached.crs.type, 'name', 'retrieved coordinate reference system');
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata');
  t.end();
});

function getFeatureCollection() {
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
          fooz: 'ball',
        },
        geometry: {
          foo: 'bar',
        },
      },
    ],
  };
}
