# FeatureServer
*An open source implementation of the GeoServices specification*

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
FeatureServer.route(req, res, options)
```

### FeatureServer.query
Pass in `geojson` and a valid `geoservices query object` e.g. `where=OBJECTID>10` and the function will perform the query and return a valid geoservices query object

```js
FeatureServer.query(geojson, options)
```

### FeatureServer.serverInfo
Generate version `10.21` Geoservices-like server info
```js
FeatureServer.serverInfo()
```

### FeatureServer.layerInfo
Generate version `10.21` Geoservices-like information about a single layer
```js
FeatureServer.layerInfo(geojson, options)
```

### FeatureServer.layers
Generate version `10.21` Geoservices-like information about one or many layers

Can pass a single geojson object or an array of geojson objects
```js
FeatureServer.layers(geojson, options)
```
