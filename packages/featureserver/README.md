# FeatureServer

*An open source implementation of the GeoServices specification*

[![npm][npm-image]][npm-url]
## Usage
FeatureServer is the underlying dependency of the Koop Output-Geoservices plugin.  However, it can also be used on its own with Express.

### Example of direct usage with Express
```js
const express = require('express')
const app = express() // set up a basic express server
const FeatureServer = require('@koopjs/featureserver')
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

### Setting defaults at runtime
FeatureServer allows several defaults to be set at runtime via Express's `app.locals` method.  Specifically, you will need to set:

```js
app.locals.config = {
  featureServer: {
    // define default here
  }
}
```

If you are using FeatureServer as part of a Koop instance, the equivalent of Express's `app.locals` is `koop.server.locals`.

The follow properties can be set at runtime with the noted method:

```js
app.locals.config = {
  featureServer: {
    currentVersion: 11.01, // defaults to 10.51
    fullVersion: '11.0.1', // defaults to '10.5.1'
    serviceDescription: 'default service description',
    description: 'default layer description'
  }
}
```

## API
* [FeatureServer.route](#FeatureServer.route)
* [FeatureServer.query](#FeatureServer.query)
* [FeatureServer.serverInfo](#FeatureServer.serverInfo)
* [FeatureServer.layerInfo](#FeatureServer.layerInfo)
* [FeatureServer.layers](#FeatureServer.layers)
* [FeatureServer.generateRenderer](#FeatureServer.generateRenderer)
* [FeatureServer.authenticate](#FeatureServer.authenticate)
* [FeatureServer.error.authorize](#FeatureServer.error.authorize)
* [FeatureServer.authenticate](#FeatureServer.error.authenticate)
* [FeatureServer.queryRelatedRecords](#FeatureServer.queryRelatedRecords)

### FeatureServer.route
Pass in an `incoming request object`, an `outgoing response object`, a `geojson` object, and `options` and this function will route and return a geoservices compliant response

- Supports: '/FeatureServer', '/FeatureServer/layers', '/FeatureServer/:layer', '/FeatureServer/:layer/:method'
	- _Note_: only `query`, `info`, and `generateRenderer` are supported methods at this time.

```js
FeatureServer.route(req, res, data, options)
```

- **data** is either a geojson object extended with some additional properties or an object with a layers property which an array of extended geojson objects. These properties are optional and can be used to provide more specific metadata or to shortcut the built in filtering mechanism.

e.g.

```js
{
  type: 'FeatureCollection' // Static
  features: Array, // GeoJSON features
  statistics: Object, // pass statistics to an outStatistics request to or else they will be calculated from geojson features passed in
  metadata: {
    id: number, // The unique layer id.  If supplied for one layer, you should supply for all layers to avoid multiple layers having the same id.
    name: String, // The name of the layer
    description: String, // The description of the layer
    copyrightText: String, // The copyright text (layer attribution text)
    extent: Array, // valid extent array e.g. [[180,90],[-180,-90]]
    displayField: String, // The display field to be used by a client
    geometryType: String // REQUIRED if no features are returned with this object Point || MultiPoint || LineString || MultiLineString || Polygon || MultiPolygon
    idField: String, // unique identifier field,
    maxRecordCount: Number, // the maximum number of features a provider can return at once
    limitExceeded: Boolean, // whether or not the server has limited the features returned
    timeInfo: Object, // describes the time extent and capabilities of the layer,
    transform: Object, // describes a quantization transformation
    renderer: Object, // provider can over-ride default symbology of FeatureServer output with a renderer object. See https://developers.arcgis.com/web-map-specification/objects/simpleRenderer, for object specification.
    defaultVisibility: boolean, // The default visibility of this layer
    minScale: number, // The minScale value for this layer
    maxScale: number, // The maxScale value for this layer
    fields: [
     { // Subkeys are optional
       name: String,
       type: String, // 'Date' || 'Double' || 'Integer' || 'String'
       alias: String, // how should clients display this field name,
     }
    ]
  },
  capabilities: {
    quantization: Boolean // True if the provider supports quantization
  },
  filtersApplied: {
    all: Boolean // true if all post processing should be skipped
    geometry: Boolean, // true if a geometric filter has already been applied to the data
    where: Boolean, // true if a sql-like where filter has already been applied to the data
    offset: Boolean // true if the result offset has already been applied to the data,
    limit: Boolean // true if the result count has already been limited,
    projection: Boolean // true if the result data has already been projected
  }
  count: Number // pass count if the number of features in a query has been pre-calculated
}
```

or

```js
{
  layers: [
    {
      type: 'FeatureCollection'
      ...
    },
    {
      type: 'FeatureCollection'
      ...
    }
]
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
Generate version `10.51` Geoservices server info

```js
const server = {
  description: String // Describes the collection of layers below,
  copyrightText: String // Optional copyright text
  maxRecordCount: Number // the maximum number of features a provider can return at once,
  hasStaticData: Boolean // whether or not the server contains any data that is not changing
  hasAttachments: Boolean // whether or not the server contains any attachments for this layer
  layers: [{ // A collection of all the layers managed by the server
    type: 'FeatureCollection',
    metadata: {
      id: number, // The unique layer id.  If supplied for one layer, you should supply for all layers to avoid multiple layers having the same id.
      name: String, // The name of the layer
      description: String, // The description of the layer
      extent: Array, // valid extent array e.g. [[180,90],[-180,-90]]
      displayField: String, // The display field to be used by a client
      idField: String, // unique identifier field,
      geometryType: String, // REQUIRED if no features are returned with this object Point || MultiPoint || LineString || MultiLineString || Polygon || MultiPolygon
      maxRecordCount: Number, // the maximum number of features a provider can return at once
      limitExceeded: Boolean, // whether or not the server has limited the features returned
      timeInfo: Object, // describes the time extent and capabilities of the layer
      renderer: Object, // provider can over-ride default symbology of FeatureServer output with a renderer object. See https://developers.arcgis.com/web-map-specification/objects/simpleRenderer, for object specification.
      defaultVisibility: boolean, // The default visibility of this layer
      minScale: number, // The minScale value for this layer
      maxScale: number // The maxScale value for this layer
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
  }],
  tables: [{ // A collection of all the tables managed by the server
    type: 'FeatureCollection',
    metadata: {
      // see layer metadata
    }
  }],
  relationships: [{ // A collection of all relationships manged by the server
    id: number, // The unique relationship id.
    name: String, // The name of the relationship
  }]
}

FeatureServer.serverInfo(server)
```

### FeatureServer.layerInfo
Generate version `10.51` Geoservices information about a single layer
```js
FeatureServer.layerInfo(geojson, options)
```

Note that the layer info is modified with properties `metadata` and `capabilites` found at the top-level of the GeoJSON object.

|GeoJSON property| Layer info result|
|---|---|
|`metadata.id`| overrides default|
|`metadata.name`| overrides default|
|`metadata.description`| overrides default |
|`metadata.geometryType`| overrides value determined from data |
|`metadata.extent`| overrides value determined from data |
|`metadata.timeInfo`| overrides default |
|`metadata.maxRecordCount`| overrides default (2000) |
|`metadata.displayField`| overrides default (`OBJECTID`) |
|`metadata.objectIdField`| overrides default  (`OBJECTID`) |
|`metadata.hasStaticData`| overrides default (`false`) |
|`metadata.hasAttachments`| overrides default (`false`) |
|`metadata.renderer`| overrides default |
|`metadata.defaultVisibility`| overrides default |
|`metadata.minScale`| overrides default |
|`metadata.maxScale`| overrides default |
|`metadata.relationships` | overrides default |
|`capabilities.extract`|  when set to `true`, `Extract` added to `capabilites` (e.g., `capabilities: "Query,Extract"`) |
|`capabilities.quantization`| when set to `true`, `supportsCoordinatesQuantization: true` |

##### metadata.relationships
This defined the server managed relationships for the layer

e.g.

```js
const metadata = {
  //...
  relationships: [{ // A collection of all relationships manged by the server
    id: number, // The unique relationship id.
    name: String, // The name of the relationship
    relatedTableId: number, // Id of the layer/table related records are found
    cardinality: String, // esriRelCardinalityOneToMany | esriRelCardinalityManyToMany
    role: String, // esriRelRoleOrigin | esriRelRoleDestination
    keyField: String, // key field name in the related Table 
    composite: Boolean // likely to false
  }]
  //...
}
```

### FeatureServer.layers
Generate version `10.51` Geoservices information about one or many layers

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

### FeatureServer.authenticate
Pass in an outgoing response object and an authentication success object and this function will route and return a formatted authentication success response.

    FeatureServer.authenticate(res, auth, ssl = false)

* `auth` is the result of a successful authentication attempt that returns a token and expiration time
* `ssl` is a boolean flag indicating if token should always be passed back via HTTPS. Defaults to `false`

e.g.,
    
    const auth = {
      "token":"elS39KU4bMmZQgMXDuswgA14vavIp4mfpiqcWSr0qM6q4dFguTnnHddWqbpK5Mc3HsCN8XghlwawUUYApOOcxKNyg_9WqTofChJXxxD058_rL1HZkM5PDhUOh9YYQn1K",
      "expires":1524508236322
    }

    FeatureServer.authenticate(res, auth)

    {
      "token":"elS39KU4bMmZQgMXDuswgA14vavIp4mfpiqcWSr0qM6q4dFguTnnHddWqbpK5Mc3HsCN8XghlwawUUYApOOcxKNyg_9WqTofChJXxxD058_rL1HZkM5PDhUOh9YYQn1K",
      "expires":1524508236322,
      ssl: false
    }

### FeatureServer.error.authorize
Pass in an outgoing response object and this function will route and return a formattted authorization error.

    FeatureServer.error.authorize(res)

    {
      "error": {
        "code": 499,
        "message": "Token Required",
        "details": []
      }
    }

### FeatureServer.error.authenticate
Pass in an outgoing response object and this function will route and return a formatted authentication error.

    FeatureServer.error.authenticate(res)
    
    {
      "error": {
        "code": 400,
        "message": "Unable to generate token.",
        "details": ["Invalid username or password."]
      }
    }


[npm-image]: https://img.shields.io/npm/v/@koopjs/featureserver.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@koopjs/featureserver


### FeatureServer.queryRelatedRecords
Pass in `geojson` and `options`, and the function will return a valid queryRelatedRecords object. Required attributes within `options` are `objectIds` and `relationshipId`.

The `geojson` should be in the special FeatureCollection of FeatureCollections format to show the relationship between requested Features within the layer/table and the referenced relatinoship's features.
e.g. 

```js
  const geojson = {
    "type": "FeatureCollection",
    "features": [ // Array of FeatureCollections by objectId with the related records as features
      {
        "type": "FeatureCollection",
        "properties": {
          "OBJECTID": 37
        },
        "features": [
          {
            "type": "Feature",
            "geometry": {...},
            "properties": {...}
          }
        ]
      } 
    ]
  }
  
  const options = {
    objectIds: "37, 462", // comma separated string of object ids within the layer to get related records 
    relationshipId: 4, // relationship Id of the server manged relationship of the layer, see FeatureServer.layerInfo
  }

FeatureServer.queryRelatedRecords(geojson, options)
```

Output:

```js
{
  "geometryType": "esriGeometryPolygon",
  "spatialReference": {
    "wkid": 4267
  },
  "fields": [
    {
      "name": "OBJECTID", 
      "type": "esriFieldTypeOID", 
      "alias": "OBJECTID"
    }, 
    {
      "name": "FIELD1", 
      "type": "esriFieldTypeString", 
      "alias": "FIELD1", 
      "length": 25
    }
  ],
  "relatedRecordGroups": [
    {
      "objectId": 37,
      "relatedRecords": [
        {
          "attributes": {
            "OBJECTID": 5540,
            "FIELD1": "1000147595"
          },
          "geometry": {...}
        }
      ]
    }
  ]
}
```