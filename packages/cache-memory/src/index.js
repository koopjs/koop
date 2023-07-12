const _ = require('lodash');
const LRUCache = require('@alloc/quick-lru');

class Cache {
  static pluginName = 'Memory Cache';
  static type = 'cache';
  static version = require('../package.json').version;

  #cache;

  constructor(options) {
    this.#cache = new LRUCache({ maxSize: options?.size || 500 });
  }

  insert(key, geojson, options, callback) {
    this.#cache.set();
    this.#cache.set(key, normalizeGeojson(geojson), {
      maxAge: calculateMaxAge(options?.ttl),
    });
    callback(null);
  }

  retrieve(key, options, callback) {
    const cacheEntry = this.#cache.get(key);

    if (!cacheEntry) {
      return callback(null);
    }

    let data = cacheEntry;

    if (options?.pick) {
      data = _.pick(data, options.pick);
    } else if (options?.omit) {
      data = _.omit(data, options.omit);
    }

    callback(null, data);
  }

  delete(key, callback) {
    this.#cache.delete(key);
    callback(null);
  }
}

function normalizeGeojson(geojson) {
  if (geojson === undefined || geojson === null || Array.isArray(geojson)) {
    return {
      type: 'FeatureCollection',
      features: geojson || [],
      metadata: {},
    };
  }

  geojson.type = geojson.type || 'FeatureCollection';
  geojson.features = geojson.features || [];
  return _.cloneDeep(geojson);
}

function calculateMaxAge(ttl) {
  if (!ttl) {
    return;
  }

  return Date.now() + ttl * 1000;
}

module.exports = Cache;
