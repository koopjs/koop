const test = require('tape');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const delay = promisify(setTimeout); 
const Cache = require('../src');
const cache = new Cache();
const insert = promisify(cache.insert).bind(cache);
const retrieve = promisify(cache.retrieve).bind(cache);
const deleteMethod = promisify(cache.delete).bind(cache);

test('Inserting and retreiving from the cache', async (t) => {
  const geojson = getFeatureCollection();
  const key = uuidv4();
  await insert(key, geojson, { ttl: 600 });
  try {
    const cached = await retrieve(key, {});
    t.equal(cached.features[0].properties.fooz, 'ball', 'retrieved features');
    t.equal(cached.crs.type, 'name', 'retrieved coordinate reference system');
    t.equal(cached.metadata.name, 'Test', 'retrieved metadata');
  } catch (error) {
    t.fail(error.message);
  }
  t.end();
});

test('cache should expire entries, return undefined', async (t) => {
  const geojson = getFeatureCollection();
  const key = uuidv4();
  await insert(key, geojson, { ttl: 1 });
  await delay(1500);
  const cached = await retrieve(key, {});
  t.equals(cached, undefined);
  t.end();
});

test('Inserting and retreiving from the cache', async (t) => {
  const geojson = getFeatureCollection();
  const key = uuidv4();
  await insert(key, geojson, { ttl: 600 });
  const cached = await retrieve(key, {});
  t.equal(cached.features[0].properties.fooz, 'ball', 'retrieved features');
  t.equal(cached.crs.type, 'name', 'retrieved coordinate reference system');
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata');
  t.end();
});

test('retrieve partial entry with pick option', async (t) => {
  const geojson = getFeatureCollection();
  const key = uuidv4();
  await insert(key, geojson, { ttl: 600 });
  const cached =  await retrieve(key, { pick: ['features'] });
  t.deepEqual(Object.keys(cached), ['features'], 'retrieved only features');
  t.end();
});

test('retrieve partial entry with omit option', async (t) => {
  const geojson = getFeatureCollection();
  const key = uuidv4();
  await insert(key, geojson, { ttl: 600 });
  const cached =  await retrieve(key, { omit: ['features'] });
  t.deepEqual(
    Object.keys(cached),
    ['type', 'crs', 'metadata'],
    'retrieved everything but features',
  );
  t.end();
});

test('Inserting and deleting from the cache', async (t) => {
  const geojson = getFeatureCollection();
  const key = uuidv4();
  await insert(key, geojson, {});
  await deleteMethod(key);
  const cached = await retrieve(key, {});
  t.equals(cached, undefined);
  t.end();
});

test('Inserting object with additional properties', async (t) => {
  const key = uuidv4();
  const serverInfo = {
    layers: [getFeatureCollection()],
    crs: 'crs-info',
    metadata: {
      name: 'Test',
      description: 'Test',
    },
  };
  await insert(key, serverInfo, { ttl: 600 });
  const cached = await retrieve(key, {});
  t.ok(cached.layers, 'has layers');
  t.ok(cached.layers[0].type === 'FeatureCollection', 'has layers property');
  t.equal(cached.metadata.name, 'Test', 'retrieved metadata');
  t.end();
});

test('Caching a feature array as feature collection', async (t) => {
  const key = uuidv4();
  const { features } = getFeatureCollection();
  await insert(key, features, { ttl: 600 });
  const cached = await retrieve(key, {});
  t.deepEquals(cached.features, features,);
  t.equal(cached.type, 'FeatureCollection');
  t.deepEquals(cached.metadata, {});
  t.end();
});

test('Caching an empty object as feature collection', async (t) => {
  const key = uuidv4();
  await insert(key, {}, { ttl: 600 });
  const cached = await retrieve(key, {});
  t.equal(cached.type, 'FeatureCollection');
  t.deepEquals(cached.features, []);
  t.end();
});

test('Caching a null object as feature collection', async (t) => {
  const key = uuidv4();
  await insert(key, null, { ttl: 600 });
  const cached = await retrieve(key, {});
  t.equal(cached.type, 'FeatureCollection');
  t.end();
});

test('Caching a undefined as feature collection', async (t) => {
  const key = uuidv4();
  await insert(key, undefined, { ttl: 600 });
  const cached = await retrieve(key, {});
  t.equal(cached.type, 'FeatureCollection');
  t.deepEquals(cached.features, []);
  t.end();
});

test('Post-insert edits to geojson should not mutate cache', async (t) => {
  const geojson = getFeatureCollection();
  await insert('key', geojson, { ttl: 600 });
  geojson.features[0].properties.key = 'fooz';
  const cached = await retrieve('key', {});
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
