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
const FeatureServer = require('featureserver')
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
Pass in an `incoming request object`, an `outgoing response object`, a `geojson` object, and `options` and this function will route and return a geoservices compliant response

- Supports: '/FeatureServer', '/FeatureServer/layers', '/FeatureServer/:layer', '/FeatureServer/:layer/:method'
	- _Note_: only `query`, `info`, and `generateRenderer` are supported methods at this time.

```js
FeatureServer.route(req, res, data, options)
```

- **data** is a geojson object extended with some additional properties. These properties are optional and can be used to provide more specific metadata or to shortcut the built in filtering mechanism.

e.g.

```js
{
  type: 'FeatureCollection' // Static
  features: Array, // GeoJSON features
  statistics: Object, // pass statistics to an outStatistics request to or else they will be calculated from geojson features passed in
  metadata: {
    name: String, // The name of the layer
    description: String, // The description of the layer
    extent: Array, // valid extent array e.g. [[180,90],[-180,-90]]
    displayField: String, // The display field to be used by a client
    geometryType: String // REQUIRED if no features are returned with this object Point || MultiPoint || LineString || MultiLineString || Polygon || MultiPolygon
    idField: String, // unique identifier field,
    maxRecordCount: Number, // the maximum number of features a provider can return at once
    timeInfo: Object // describes the time extent and capabilities of the layer,
    fields: [
     { // Subkeys are optional
       name: String,
       type: String, // 'Date' || 'Double' || 'Integer' || 'String'
       alias: String, // how should clients display this field name,
     }
    ]
  },
  filtersApplied: {
    geometry: Boolean, // true if a geometric filter has already been applied to the data'
    where: Boolean // true if a sql-like where filter has already been applied to the data
  }
  count: Number // pass count if the number of features in a query has been pre-calculated
}
```
- **options** is an object that dictates method actions. See `FeatureServer.query` and `FeatureServer.generateRenderer` for more details.

### FeatureServer.query
Pass in `geojson` and `options` (a valid [geoservices query object](https://geoservices.github.io/query.html)), and the function will perform the query and return a valid geoservices query object. The in addition to input `statistics: {}`, following is an example of _all_ query `options` that can be passed into the query route: '/FeatureServer/:layer/query'

e.g.

```js
const options = {
  where: `1=1`,
  objectIds: '1,2,3',
  geometry: {
    xmin: -110, ymin: 30, xmax: -106, ymax: 50,
    spatialReference: { wkid: 4326 },
  },
  geometryType: 'esriGeometryEnvelope',
  spatialRel: 'esriSpatialRelContains',
  outFields: '*',
  returnGeometry: true,
  outSR: 102100, // output spatial reference
  returnIdsOnly: true,
  returnCountOnly: true,
  orderByFields: 'Full/Part_COUNT DESC',
  groupByFieldsForStatistics: 'Full/Part',
  outStatistics: {
  	statisticType: 'count',
  	onStatisticField: '<field>',
  	outStatisticFieldName: 'name'
  },
  returnDistinctValues: true,
  resultOffset: 0,
  resultRecordCount: 0,
  f: 'pjson'
}

FeatureServer.query(geojson, options)
```

### FeatureServer.serverInfo
Generate version `10.21` Geoservices server info

```js
const server = {
  description: String // Describes the collection of layers below,
  maxRecordCount: Number // the maximum number of features a provider can return at once,
  hasStaticData: Boolean // whether or not the server contains any data that is not changing
  layers: [{ // A collection of all the layers managed by the server
    type: 'FeatureCollection',
    metadata: {
      name: String, // The name of the layer
      description: String // The description of the layer
      extent: Array // valid extent array e.g. [[180,90],[-180,-90]]
      displayField: String // The display field to be used by a client
      idField: String // unique identifier field,
      geometryType: String // REQUIRED if no features are returned with this object Point || MultiPoint || LineString || MultiLineString || Polygon || MultiPolygon
      maxRecordCount: Number // the maximum number of features a provider can return at once
      timeInfo: Object // describes the time extent and capabilities of the layer
    }
    features: [// If all the metadata provided above is provided features are optional.
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [125.6, 10.1]
        },
        properties: {
          name: 'Dinagat Islands'
        }
      }]
    }
  }]
}

FeatureServer.serverInfo(server)
```

### FeatureServer.layerInfo
Generate version `10.21` Geoservices information about a single layer
```js
FeatureServer.layerInfo(geojson, options)
```

### FeatureServer.layers
Generate version `10.21` Geoservices information about one or many layers

Can pass a single geojson object or an array of geojson objects
```js
FeatureServer.layers(geojson, options)
```

### FeatureServer.generateRenderer
Pass in `geojson` and `options`, and the function will return a valid generateRenderer object. Two `classificationDef` classification types are supported, _classBreaksDef_ and _uniqueValueDef_.

_classBreaksDef_ is used to classify numeric data based on a number of breaks and a statistical method. Features can also be normalized before being classified. _uniqueValueDef_ is used to classify data based on a unique field(s). If classification breaks are not supplied through in `statistics`, they will be generated using `classificationDef` options. The output is a _generateRenderer_ object.

##### classBreaksDef
In addition to class breaks as input `statistics: []`, the following is an example of _all_ classBreaksDef `options` that can be passed into the generateRenderer route: '/FeatureServer/:layer/generateRenderer'

e.g.

```js
const options = {
 *'classificationDef': {
   *'type': 'classBreaksDef',
   *'classificationField': '<field1>',
   *'classificationMethod': 'esriClassifyEqualInterval' | 'esriClassifyNaturalBreaks' | 'esriClassifyQuantile' | 'esriClassifyStandardDeviation',
   *'breakCount': 9,
    'normalizationType': 'esriNormalizeByField' | 'esriNormalizeByLog' | 'esriNormalizeByPercentOfTotal',
    'normalizationField': '<field2>' // mandatory if 'normalizationType' === 'esriNormalizeByField'
    'baseSymbol': {
      'type': 'esriSMS',
      'style': 'esriSMSCircle',
      'width': 2
    },
    'colorRamp': {
      'type': 'algorithmic',
      'fromColor': [115,76,0,255],
      'toColor': [255,25,86,255],
      'algorithm': 'esriHSVAlgorithm'
    }
  },
  'where': '<field2> > 39'
}

FeatureServer.generateRender(geojson, options)

*required
```

Output:

```js
{
  type: 'classBreaks',
  field: '<field1>',
  classificationMethod: 'esriClassifyEqualInterval',
  minValue: 0,
  classBreakInfos: [
    {
      classMinValue: 0,
      classMaxValue: 5,
      label: '0-5',
      description: '',
      symbol: {
        type: 'esriSMS',
        style: 'esriSMSCircle',
        width: 2,
        color: [115, 76, 0]
      }
    },
    {
      classMinValue: 6,
      classMaxValue: 11,
      label: '6-11',
      description: '',
      symbol: {
        type: 'esriSMS',
        style: 'esriSMSCircle',
        width: 2,
        color: [156, 67, 0]
      }
    },
    ...
  ]
}
```

##### uniqueValueDef
The following is an example of _all_ uniqueValueDef `options` that can be passed into the generateRenderer route: '/FeatureServer/:layer/generateRenderer'

e.g.

```js
const options = {
 *'classificationDef': {
   *'type': 'uniqueValueDef',
   *'uniqueValueFields': ['Genus', '<field2>', '<field3>'],
   *'fieldDelimiter': ', '
    'baseSymbol': {
      'type': 'esriSMS',
      'style': 'esriSMSCircle',
      'width': 2
    },
    'colorRamp': {
      'type': 'algorithmic',
      'fromColor': [115,76,0,255],
      'toColor': [255,25,86,255],
      'algorithm': 'esriHSVAlgorithm'
    }
  },
  'where': 'latitude > 39'
}

FeatureServer.generateRender(geojson, options)

*required
```

Output:

```js
{
  type: 'uniqueValue',
  field1: 'Genus',
  field2: '',
  field3: '',
  fieldDelimiter: ', ',
  defaultSymbol: {},
  defaultLabel: '',
  uniqueValueInfos: [
    {
      value: 'MAGNOLIA',
      count: 5908,
      label: 'MAGNOLIA',
      description: '',
      symbol: {
        type: 'esriSMS',
        style: 'esriSMSCircle',
        width: 2,
        color: [115, 76, 0]
  	   }
    },
    {
      value: 'QUERCUS',
      count: 12105,
      label: 'QUERCUS',
      description: '',
      symbol: {
        type: 'esriSMS',
        style: 'esriSMSCircle',
        width: 2,
        color: [116, 76, 0]
  	  }
   },
   ...
  ]
```

[npm-image]: https://img.shields.io/npm/v/featureserver.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/featureserver
[travis-image]: https://img.shields.io/travis/koopjs/FeatureServer.svg?style=flat-square
[travis-url]: https://travis-ci.org/koopjs/FeatureServer
[greenkeeper-image]: https://badges.greenkeeper.io/koopjs/FeatureServer.svg
[greenkeeper-url]: https://greenkeeper.io/
