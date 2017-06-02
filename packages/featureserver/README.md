# FeatureServer

*An open source implementation of the GeoServices specification*

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

## Usage

This is meant to be used as a plugin to Express

### Example server
```js
const express = require('express')
const app = express() // set up a basic express server
const featureServer = require('featureserver')
const cache = require('cache')

// We only need one handler because FeatureServer.route is going to do all the work
const handler = (req, res) => {
  cache.get(/* some geojson */, (err, data) => {
    if (err) res.status(500).json({error: err.message})
    else FeatureServer.route(req, res, data)
  })
}

// Sets up all of the handled routes to support `GET` and `POST`
const routes = ['/FeatureServer', '/FeatureServer/layers', '/FeatureServer/:layer', '/FeatureServer/:layer/:method']

routes.forEach(route => {
  app.route(route)
  .get(handler)
  .post(handler)
})
```

## API

### FeatureServer.route
Pass in an `incoming request object`, an `outgoing response object` and `geojson` and this function will route and return a geoservices compliant response

Supports: '/FeatureServer', '/FeatureServer/layers', '/FeatureServer/:layer', '/FeatureServer/:layer/:method'

Note: only `query` and `info` are supported methods at this type

```js
FeatureServer.route(req, res, data, options)
```

Data is a geojson object extended with some additional properties. These properties are optional and can be used to provide more specific metadata or to shortcut the built in filtering mechanism.

e.g.
```js
{
  type: 'FeatureCollection'
  features: Array,
  statistics: Object, // pass statistics to an outStatistics request to or else they will be calculated from geojson features passed in
  metadata: {
    name: String, //
    description: String
    extent:  Object || Array // valid extent object or 2 coord array
    displayField: String // The display field to be used by a client
    id: String // unique identifier field
  },
  filtersApplied: {
    geometry: Boolean, // true if a geometric filter has already been applied to the data
    where: Boolean // true if a sql-like where filter has already been applied to the data
  }
  count: Number // pass count if the number of features in a query has been precalculated
}
```

### FeatureServer.query
Pass in `geojson` and a valid `geoservices query object` e.g. `where=OBJECTID>10` and the function will perform the query and return a valid geoservices query object

```js
FeatureServer.query(geojson, options)
```

### FeatureServer.serverInfo
Generate version `10.21` Geoservices server info
```js
const server = {
  name: 'Koop server',
  description: 'Layers translated by Koop',
  layers: [
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [125.6, 10.1]
          },
          properties: {
            name: 'Dinagat Islands'
          }
        }
      ]
    }
  ]
}

FeatureServer.serverInfo(server)
```

### FeatureServer.layerInfo
Generate version `10.21` Geoservices information about a single layer
```js
FeatureServer.layerInfo(geojson, options)
```

### FeatureServer.layersInfo
Generate version `10.21` Geoservices information about one or many layers

Can pass a single geojson object or an array of geojson objects
```js
FeatureServer.layersInfo([geojson], options)
```


[npm-image]: https://img.shields.io/npm/v/featureserver.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/featureserver
[travis-image]: https://img.shields.io/travis/FeatureServer/FeatureServer.svg?style=flat-square
[travis-url]: https://travis-ci.org/FeatureServer/FeatureServer
[greenkeeper-image]: https://badges.greenkeeper.io/FeatureServer/FeatureServer.svg
[greenkeeper-url]: https://greenkeeper.io/
