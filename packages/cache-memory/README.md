# Koop Memory Cache
[![npm version][npm-img]][npm-url]
![coverage](./coverage.svg)

This is a LRU cache with ttl (time to live) expiry. It expects cache items to be GeoJSON feature collections. It is based on [quick-lru](https://github.com/sindresorhus/quick-lru). 

Cache eviction occurs in two ways:
1. if the cache grows to a number of items greater than the cache's defined size, the least recently inserted or accessed item is evicted
2. if a item is accessed and it has gone past its ttl period, it is evicted
## Usage

### Stand-alone instantiation:

```js
const Cache = require('@koopjs/cache-memory');
const cache = new Cache({ size: 1000 });
```

### As a Koop cache plugin
This is the default cache for [Koop](https://github.com/koopjs/koop) so you won't need to instantiate it yourself. If you really wanted to, it would look like this:

```js
const Koop = require('koop')
const koop = new Koop()
const cache = require('@koopjs/cache-memory')
koop.register(cache, { size: 1000 })
```
#### Options
`size`: the maximum number of items to store in the queue before evicting the least recently used item.

## Cache API
The cache is a JavaScript object that lives in-memory. It is used to store geojson features.

### `insert`
Insert geojson into the cache.


```js
const geojson = {
  type: 'FeatureCollection',
  features: [],
  metadata: { 
    name: 'Example GeoJSON',
    description: 'This is geojson that will be stored in the cache'
  }
}

const options = {
  ttl: 1000 // The TTL option is measured in seconds, it will be used to set the `maxAge` property in the LRU cache
}

cache.insert('key', geojson, options, err => {
  // This function will call back with an error if one occurs
})
```

### `retrieve`
Retrieve a cached feature collection.

```js
const options = {
  pick: [] // an array of keys used to return a subset of the feature collections root level properties
  omit
} 

cache.retrieve('key', options, (err, geojson) => {
  /* This function will callback with an error or the data cached with the passed key. It will return undefined if not found or expired.
  {
    type: 'FeatureCollection',
    features: [],
    metadata: {}
  }
  */
})
```

### `delete`
Remove a feature collection from the cache

```js
cache.delete('key', err => {
  // This function will call back with an error if one occurs
})
```

[npm-img]: https://img.shields.io/npm/v/@koopjs/cache-memory.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@koopjs/cache-memory