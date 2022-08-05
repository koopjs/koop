const Util = require('util');
const EventEmitter = require('events');
const _ = require('lodash');
const { asCachableGeojson } = require('./helper');
const Readable = require('stream').Readable;

// Convenience to make callbacks optional in most functions
function noop() {}

class Cache extends EventEmitter {
  static name = 'Memory Cache';
  static type = 'cache';
  static version = require('../package.json').version;

  constructor(options = {}) {
    super();
    this.featuresStore = new Map();
    this.catalogStore = new Map();
  }

  insert(key, geojson, options = {}, callback = noop) {
    if (this.featuresStore.has(key)) {
      return callback(new Error('Cache key is already in use'));
    }
    const { features, ...rest } = asCachableGeojson(geojson);
    this.featuresStore.set(key, features);

    this.catalogInsert(key, rest, options, callback);
  }

  update(key, geojson, options = {}, callback = noop) {
    if (!this.featuresStore.has(key)) {
      return callback(new Error('Resource not found'));
    }
    const { features, ...rest } = asCachableGeojson(geojson);

    this.featuresStore.set(key, features);

    const existingCatalogEntry = this.catalogStore.get(key);

    const catalogEntry = rest || existingCatalogEntry;

    this.catalogUpdate(key, catalogEntry, callback);
  }

  upsert(key, geojson, options = {}, callback = noop) {
    if (this.featuresStore.has(key)) {
      this.update(key, geojson, options, callback);
    } else {
      this.insert(key, geojson, options, callback);
    }
  }

  append(key, geojson, options = {}, callback = noop) {
    const { features } = asCachableGeojson(geojson);
    const existingFeatures = this.featuresStore.get(key);
    const appendedFeatureArray = existingFeatures.concat(features);
    this.featuresStore.set(key, appendedFeatureArray);
    this.catalogUpdate(key, {
      cache: {
        updated: Date.now(),
      },
    });
    callback();
  }

  retrieve(key, options, callback = noop) {
    if (!this.featuresStore.has(key)) {
      return callback(new Error('Resource not found'));
    }
    const features = this.featuresStore.get(key);

    const geojsonWrapper = this.catalogStore.get(key);

    const geojson = { ...geojsonWrapper, features };

    callback(null, geojson);

    return geojson;
  }

  createStream(key, options = {}) {
    const features = this.featuresStore.get(key);
    return Readable.from(features);
  }

  delete(key, callback = noop) {
    if (!this.featuresStore.has(key)) {
      return callback(new Error('Resource not found'));
    }
    this.featuresStore.delete(key);
    const catalogEntry = this.catalogStore.get(key);
    this.catalogStore.set(key, {
      ...catalogEntry,
      _cache: {
        status: 'deleted',
        updated: Date.now(),
      },
    });
    callback();
  }

  catalogInsert(key, catalogEntry, options = {}, callback = noop) {
    if (this.catalogStore.has(key)) {
      return callback(new Error('Catalog key is already in use'));
    }
    const clonedEntry = _.cloneDeep(catalogEntry);

    _.set(clonedEntry, '_cache.updated', Date.now());

    if (options.ttl) {
      _.set(clonedEntry, '_cache.expires', Date.now() + options.ttl * 1000);
    }

    this.catalogStore.set(key, clonedEntry);

    callback();
  }

  catalogUpdate = function (key, update, options = {}, callback = noop) {
    if (!this.catalogStore.has(key)) {
      return callback(new Error('Resource not found'));
    }
    const existingCatalogEntry = this.catalogStore.get(key);
    const catalogEntry = {
      ...existingCatalogEntry,
      ..._.cloneDeep(update),
    };
    catalogEntry._cache.updated = Date.now();
    this.catalogStore.set(key, catalogEntry);
    callback();
  };

  catalogRetrieve(key, callback = noop) {
    if (!this.catalogStore.has(key)) {
      return callback(new Error('Resource not found'));
    }
    const catalogEntry = this.catalogStore.get(key);
    callback(null, catalogEntry);
    return catalogEntry;
  }

  catalogDelete(key, callback = noop) {
    if (this.featuresStore.has(key)) {
      return callback(
        new Error('Cannot delete catalog entry while data is still in cache')
      );
    }
    this.catalogStore.delete(key);
    callback();
  }
}

module.exports = Cache;
