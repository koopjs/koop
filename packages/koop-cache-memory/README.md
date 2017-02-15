# Koop Memory Cache

## Usage

This is the default cache for (Koop)[https://github.com/koopjs/koop] so you won't need to instantiate yourself. If you really wanted to, it would look like this:

```js
const Koop = require('koop')
const koop = new Koop()
const cache = require('koop-cache-memory')
koop.register(cache)
```

## Cache API
The cache is a javascript object that lives in-memory. It is used to store geojson features

### `insert`
Insert geojson into the cache

Note: A metadata entry will be created automatically. It can be populated from an object on the inserted geojson.

```js
const geojson = {
  type: 'FeatureCollection',
  features: [],
  metadata: { // Metadata is an arbitrary object that will be stored in the catalog under the same key as the geojson
    name: 'Example GeoJSON',
    description: 'This is geojson that will be stored in the cache'
  }
}

const options = {
  ttl: 1000 // The TTL option is measured in seconds, it will be used to set the `expires` field in the catalog entry
}

cache.insert('key', geojson, options, err => {
  // This function will call back with an error if there is already data in the cache using the same key
})
```

### `append`
Add features to an existing geojson feature collection in the cache
Note:

```js
const geojson = {
  type: 'FeatureCollection',
  features: []
}
cache.append('key', geojson, err => {
  // This function will call back with an error if the cache key does not exist
})
```

### `update`
Update a cached feature collection with new features.
This will completely replace the features that are in the cache, but the metadata doc will remain in the catalog.

```js
const geojson = {
  type: 'FeatureCollection',
  features: []
}

const options = {
  ttl: 1000
}
cache.update('key', geojson, options, err => {
  // This function will call back with an error if the cache key does not exist
})
```

### `upsert`
Update a cached feature collection with new features or insert if the features are not there.

```js
const geojson = {
  type: 'FeatureCollection',
  features: []
}

const options = {
  ttl: 1000
}

cache.upsert('key', geojson, options, err => {
  // This function will call back with an error if the cache key does not exist
})
```

### `retrieve`
Retrieve a cached feature collection

```js
const options = {} // For now there are no options on retrieve. This is meant for compatibility with the general cache API
cache.retrieve('key', options, (err, geojson) => {
  /* This function will call back with an error if there is no geojson in the cache
  The geojson returned will contain the metadata document from the catalog
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
  // This function will call back with an error if there was nothing to delete
})
```

### `createStream`
Create a stream of features from the cache

```js
cache.createStream('key', options)
.pipe(/* do something with the stream of geojson features emitted one at a time */)
```

## Catalog API
The catalog stores metadata about items that are in the cache.

### `catalog.insert`
Add an arbitrary metadata document to the cache.
Note: This is called automatically by `insert`

```js
const metadata = {
  name: 'Standalone metadata',
  status: 'Processing',
  description: 'Metadata that is not attached to any other data in the cache'
}

cache.catalog.insert('key', metadata, err => {
  // this function will call back with an error if there is already a metadata document using the same key
})
```

### `catalog.update`
Update a metadata entry

```js
const original = {
  name: 'Doc',
  status: 'Processing'
}
cache.catalog.insert('key', original)

const update = {
  status: 'Cached'
}

cache.catalog.update('key', update, err => {
  // this function will call back with an error if there is no metadata in the catalog using that key
})

cache.catalog.retrieve('key', (err, metadata) => {
  /*
    Updates are merged into the existing metadata document
    Return value will be:
    {
      name: 'Doc',
      status: 'Cached'
    }
  */
})
```

### `catalog.retrieve`
Retrieve a metadata entry from the catalog

```js
cache.catalog.retrieve('key', (err, metadata) => {
  // This function will call back with an error if there is no metadata stored under the given key
  // Or else it will call back with the stored metadata doc
})
```

### `catalog.delete`
Remove a catalog entry from the catalog
Note: This cannot be called if data is in the cache under the same key

```js
cache.catalog.delete('key', err => {
  // This function will call back with an error if there is nothing to delete or if there is still data in the cache using the same key
})
```
