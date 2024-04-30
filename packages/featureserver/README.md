# FeatureServer
![https://www.npmjs.com/package/@koopjs/featureserver](https://img.shields.io/npm/v/@koopjs/featureserver.svg?style=flat-square)
![coverage](https://raw.githubusercontent.com/koopjs/koop/master/packages/featureserver/coverage.svg)

*An open source implementation of the GeoServices specification*

## Usage
FeatureServer is the underlying dependency of the Koop Output-Geoservices plugin.  However, it can also be used on its own with Express.

### Example of direct usage with Express
```js
const express = require('express')
const app = express() // set up a basic express server
const FeatureServer = require('@koopjs/featureserver')
const cache = require('cache')


const handler = (req, res) => {
  cache.get(/* some geojson */, (err, data) => {
    if (err) res.status(500).json({error: err.message})
    else FeatureServer.query(req, res, data)
  })
}

app.route('/FeatureServer/:layer/query')
  .get(handler)
  .post(handler)
```

## API
* [FeatureServer.query](#featureserver.query)
* [FeatureServer.restInfo](#featureserver.serverInfo)
* [FeatureServer.serverInfo](#featureserver.serverInfo)
* [FeatureServer.layerInfo](#featureserver.layerInfo)
* [FeatureServer.layers](#featureserver.layers)
* [FeatureServer.generateRenderer](#featureserver.generateRenderer)
* [FeatureServer.queryRelatedRecords](#featureserver.queryRelatedRecords)
* [FeatureServer.setDefaults](#featureserver.setDefaults)

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

### FeatureServer.restInfo
Pass in a `data` object and the request object and return a response object that adheres to the specification of the `rest/info` response.  The `data` object may contain the `owningSystemUrl` and the `authInfo` object:
```js
{
  owningSystemUrl: 'https://domain.com/some/path'
  authInfo: {
    isTokenBasedSecurity: true,
    tokenServicesUrl: 'https://url/that/will/generate/a/token'
  }
}
```

The response will include the above information as well as the FeatureServer version numbers.

### FeatureServer.serverInfo
Generate Geoservices server info

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
Generate Geoservices information about a single layer
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
Generate Geoservices information about one or many layers

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

### FeatureServer.setDefaults
FeatureServer allows setting some server and layer metadata values that are returned by the `FeatureServer.serverInfo` and `FeatureServer.layerInfo` methods. You can use the `setDefaults` method with an object that follows the following schema, though it need not have all properties listed below.

```js
{
  currentVersion, // number; feature server version,
  fullVersion, // string; feature server full version
  maxRecordCount // number; max record count for queries
  server: {
    serviceDescription, // string; default serviceDescription returned in server metadata
    description, // string; default description returned in server metadata
    copyrightText, // string; default copyrightText return in server metadata
    hasStaticData, // boolean; 
    spatialReference, // ArcGIS spatial reference; https://developers.arcgis.com/web-map-specification/objects/spatialReference/
    initialExtent, // ArcGIS extent; https://developers.arcgis.com/web-map-specification/objects/extent/
    fullExtent // ArcGIS extent; https://developers.arcgis.com/web-map-specification/objects/extent/
  }),
  layer: {
    description, // string; default description returned in server metadata
    copyrightText, // string; default copyrightText return in server metadata
    extent // ArcGIS extent; https://developers.arcgis.com/web-map-specification/objects/extent/
  }
}
```

#### Examples:

If you are using FeatureServer directly (i.e., not via Koop):

```js
const FeatureServer = require('@koopjs/featureserver');
FeatureServer.setDefaults({ currentVersion: 99.0 })
```

If you are using FeatureServer as part of a Koop instance, FeatureServer is registered on instantiation. But you can pass the `geoservicesDefaults` option to the Koop constructor:

```js
const koop = new Koop({
  geoservicesDefaults: { 
    currentVersion: 99.0 // set your own version number
    fullVersion: '99.9.9'
    layer: {
      supportedQueryFormats: 'JSON' // allowed values include 'JSON', 'JSON,geojson'; default is 'JSON,geojson,PBF'
    }
  }
});
 
```