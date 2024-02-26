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

  async insert(key, data, options) {
    this.#cache.set(key, data, {
      maxAge: calculateMaxAge(options?.ttl),
    });
    return;
  }

  async retrieve(key, options) {
    const cacheEntry = this.#cache.get(key);

    if (!cacheEntry) {
      return null;
    }

    let data = cacheEntry;

    if (options?.pick) {
      data = _.pick(data, options.pick);
    } else if (options?.omit) {
      data = _.omit(data, options.omit);
    }

    return data;
  }

  async delete(key) {
    this.#cache.delete(key);
    return;
  }
}

function calculateMaxAge(ttl) {
  if (!ttl) {
    return;
  }

  return Date.now() + ttl * 1000;
}

module.exports = Cache;
