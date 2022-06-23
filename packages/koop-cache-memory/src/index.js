const Util = require('util')
const EventEmitter = require('events')
const _ = require('lodash')
const { asCachableGeojson } = require('./helper')
const Readable = require('stream').Readable

// Convenience to make callbacks optional in most functions
function noop() { }

function Cache(options = {}) {
  this.store = new Map()
  this.catalog.store = new Map()
  this.catalog.dataStore = this.store
}

Cache.name = 'Memory Cache'
Cache.type = 'cache'
Cache.version = require('../package.json').version

Util.inherits(Cache, EventEmitter)

Cache.prototype.insert = function (key, geojson, options = {}, callback = noop) {
  if (this.store.has(key)) return callback(new Error('Cache key is already in use'))
  geojson = asCachableGeojson(geojson);
  this.store.set(key, geojson)
  const metadata = geojson.metadata;
  if (options.ttl) metadata.expires = Date.now() + (options.ttl * 1000)
  this.catalog.insert(key, geojson.metadata, callback)
}

Cache.prototype.upsert = function (key, geojson, options = {}, callback = noop) {
  if (this.store.has(key)) {
    this.update(key, geojson, options, callback)
  } else {
    this.insert(key, geojson, options, callback)
  }
}

Cache.prototype.update = function (key, geojson, options = {}, callback = noop) {
  if (!this.store.has(key)) return callback(new Error('Resource not found'))
  geojson = asCachableGeojson(geojson);
  this.store.set(key, geojson)
  const existingMetadata = this.catalog.store.get(key)
  const metadata = geojson.metadata || existingMetadata
  if (options.ttl) metadata.expires = Date.now() + (options.ttl * 1000)
  this.catalog.update(key, metadata, callback)
}

Cache.prototype.append = function (key, geojson, options = {}, callback = noop) {
  geojson = asCachableGeojson(geojson);
  const existing = this.store.get(key)
  existing.features = existing.features.concat(geojson.features)
  this.catalog.update(key, { updated: Date.now() })
  callback()
}

Cache.prototype.retrieve = function (key, options, callback = noop) {
  if (!this.store.has(key)) return callback(new Error('Resource not found'))
  const geojson = this.store.get(key)
  geojson.metadata = this.catalog.store.get(key)
  callback(null, geojson)
  return geojson
}

Cache.prototype.createStream = function (key, options = {}) {
  const geojson = this.store.get(key)
  return Readable.from(geojson.features)
}

Cache.prototype.delete = function (key, callback = noop) {
  if (!this.store.has(key)) return callback(new Error('Resource not found'))
  this.store.delete(key)
  const metadata = this.catalog.store.get(key)
  metadata.status = 'deleted'
  metadata.updated = Date.now()
  this.catalog.store.set(key, metadata)
  callback()
}

Cache.prototype.catalog = {}

Cache.prototype.catalog.insert = function (key, metadata, callback = noop) {
  if (this.store.has(key)) return callback(new Error('Catalog key is already in use'))
  metadata.updated = Date.now()
  this.store.set(key, metadata)
  callback()
}

Cache.prototype.catalog.update = function (key, update, callback = noop) {
  if (!this.store.has(key)) return callback(new Error('Resource not found'))
  const existing = this.store.get(key)
  const metadata = _.merge(existing, update)
  metadata.updated = Date.now()
  this.store.set(key, metadata)
  callback()
}

Cache.prototype.catalog.retrieve = function (key, callback = noop) {
  if (!this.store.has(key)) return callback(new Error('Resource not found'))
  const metadata = this.store.get(key)
  callback(null, metadata)
  return metadata
}

Cache.prototype.catalog.delete = function (key, callback = noop) {
  if (this.dataStore.has(key)) return callback(new Error('Cannot delete catalog entry while data is still in cache'))
  this.store.delete(key)
  callback()
}

module.exports = Cache
