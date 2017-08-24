# Winnow

*Winnow* is made for applying sql to geojson in memory. It is useful for working against geojson objects but also has built-in primitives for piping streams.

[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![js-standard-style][standard-img]][standard-url]
[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

# API
## `winnow.query`
Build and apply a query to a feature collection object or an array of features

```javascript
const features = Object
const options = {
  where: String // A sql where statement
  geometry: Object // GeoJSON or Esri geometry Object
  spatialPredicate: String // ST_Within || ST_Contains || ST_Intersects
  fields: Array // Set of fields to select from feature properties
  aggregates: Object // Describes the set of aggregations to perform on fields
  groupBy: Array // Set of fields for grouping statistics
  limit: Number // number of results to return
  offset: Number // number of return features to offset
  order: Array // Set of fields or aggregates by which to order results
  projection: Number || String // An EPSG code, an OGC WKT or an ESRI WKT used to convert geometry
  toEsri: Boolean // return Esri feature collection
  geometryPrecision: Number // number of digits to appear after decimal point for geometry
  classification: Object // GeoJSON or geoservices classification Object
}
winnow.query(features, options)
// Returns the set of features that match the query
```

### `where`
A sql where statement.

- `'Trunk_Diameter > 10'`
- `'Trunk_Diameter > 10 AND Genus like 'Quercus%'`
- `(Genus like '%Quercus%' OR Common_Name like '%Live Oak%') AND Street_Type like '%AVE%'`


### `geometry`
A GeoJSON or Esri Geometry Object
```javascript
// GeoJSON Polygon
{
  type: 'Polygon',
  coordinates: [[[-118.163, 34.162], [-118.108, 34.162], [-118.108, 34.173], [-118.163, 34.173], [-118.163, 34.162]]],
}

// Esri Envelope (aka Bounding box)
{
 xmin: -13155799.066536672,
 ymin: 4047806.77771083,
 xmax: -13143569.142011061,
 ymax: 4050673.16627152,
 spatialReference: {
   wkid: 102100
 }
}
```
### `spatialPredicate`
Specifies the relationship between the passed-in geometry and the features in the data

- ST_Within: Features in the data must be completely within the passed-in geometry
- ST_Contains: Features in the data must completely contain the passed-in geometry
- ST_Intersects: Features in the data must intersect the passed-in geometry

Can also specify the esri-style predicates `esriSpatialRelWithin, esriSpatialRelContains, esriSpatialRelIntersects`

### `fields`
An array that specifies fields should be returned from each features properties or attributes. Will also accept a comma-delimited string.

e.g. `[Trunk_Diameter, Common_Name, Genus]`

### `aggregates`
An array that specifies aggregations to apply across all features or properties. Must specify at least a type and a field. Providing a name for the aggregation is optional

Types: `[sum, avg, count, max, min, first, last]`

e.g:
```javascript
[
  {
    type: 'sum',
    field: 'Trunk_Diameter',
    name: 'Total_Trunk_Diameter'
  },
  {
    type: 'avg',
    field: 'Trunk_Diameter'
  }
]
```

### `groupBy`
An array of fields used to group the results. Must be used with aggregates. Note this will not return any geometry

### `limit`
The total number of results to return

### `offset`
The amount to offset returned features (e.g., `10` will skip the first 10 returned features). `limit` is required to used `offset`.

### `order`
An array of fields use to sort the output

### `projection`
Can be an epsg code, an ogc wkt or an esri wkt. This parameter controls how the geometry will be projected to another coordinate system.

### `toEsri`
If true, the object returned will be an esri feature collection.

Winnow will automatically determine field types from the first feature passed in. If a given attribute is null, Winnow will assume it is a string.

You can also pass in a metadata object that describes the fields in the feature collection. This is recommended if you know your schema ahead of time

e.g.

```javascript
{
  type: 'FeatureCollection',
  features: [],
  metadata: {
    fields: [
      {
        name: 'SomeDateField',
        type: 'Date'
      },
      {
        name: 'SomeDoubleField',
        type: 'Double'
      },
      {
        name: 'SomeIntegerField',
        type: 'Integer'
      },
      {
        name: 'SomeStringField',
        type: 'String'
      }
    ]
  }
}
```

### `geometryPrecision`
A number for geometry precision. Geometry values will be truncated to the supplied decimal place.

### `classification`
An object for classification aggregation. Classification ouputs an array of breaks on features. There are two supported classification types: _Class Breaks_ and _Unique Value_. Classification supports input from FeatureServer's [generateRenderer](https://github.com/FeatureServer/FeatureServer#generateRenderer) _classificationDef_.

##### `Class Breaks`
_Class Breaks_ is used to classify numeric data based on a number of breaks and a statistical method. Features can also be normalized before being classified.

```javascript
{
  *type: 'classes',
  *field: '<field1>',
  *method: 'equalInterval' | 'naturalBreaks' | 'quantile' | 'std',
  *breakCount: 7,
   normType: 'field' | 'log' | 'percent',
   normField: '<field2>' // mandatory if normType === 'field'
}
*required
```
e.g. An example feature collection has a field called _field1_ ranging in value from 0 - 29.

Input:

```javascript
{
  type: 'classes',
  field: 'field1',
  method: 'equalInterval',
  breakCount: 5,
}
```

Output (array of class intervals):

```javascript
[ [0-5],
  [6-11],
  [12-17],
  [18-23],
  [24-29] ]
```

##### `Unique Value`
_Unique Value_ is used to classify data based on a unique field(s). The output is an array of objects for each unique value combination. Each object contains an instance count, and the classifying unqiue field names and values.

```javascript
{
  *type: 'unique',
  *fields: ['<field1>', '<field2>', '<field3>'] // up to three fields
}
*required
```

e.g. An example feature collection has unique fields called _employeeID_ and _customerID_.

Input:

```javascript
{
  type: 'unique',
  fields: ['employeeID', 'customerID']
}
```

Output (array of instance objects):

```javascript
[
  {count: 3, employeeID: 'A', customerID: 'M'},
  {count: 1, employeeID: 'A', customerID: 'N'},
  {count: 1, employeeID: 'B', customerID: 'M'},
  {count: 2, employeeID: 'B', customerID: 'N'},
  {count: 2, employeeID: 'B', customerID: 'O'},
  {count: 1, employeeID: 'C', customerID: 'O'},
]
```

## `winnow.prepareQuery`
Returns a function that can be applied directly to a feature collection object, an array of features, or a single feature. Useful when you want to pass a stream of features through a filter.

```javascript
const options = {
  where: String,
  geometry: Object,
  spatialPredicate: String,
  fields: Array,
  aggregates: Array
}
const filter = winnow.prepareQuery(options)
filter(geojson)
// returns the set of feature that match the query
```

## `winnow.querySql`
Execute sql directly against the query engine.

- Replace any variables with ?
 - Table name should always be replaced by ?
 - Non-string values always be replaced by ?


 ```javascript
 const statement = 'Select * from ? where Genus in ?'
 const data = geojson
 const genus = ['Quercus']
 winnow.querySql(statement, [geojson, genus])
 // returns all features that match the query
 ```

## `winnow.prepareSql`
Pass in a statement and return a filter than can be applied to a feature collection object, an array of features or a single feature. Variables work in the same way as `winnow.sql`

```javascript
const statement = 'Select Trunk_Diameter from ? where Trunk_Diameter > 100'
const filter = winnow.prepareSql(statement)
filter(geojson)
// returns all the features that match the query
```
# Issues

Find a bug or want to request a new feature? Please let us know by submitting an [issue](https://github.com/FeatureServer/winnow/issues).

# Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/contributing).

# License

[Apache 2.0](LICENSE)

[npm-img]: https://img.shields.io/npm/v/winnow.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/winnow
[travis-img]: https://img.shields.io/travis/koopjs/winnow/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/koopjs/winnow
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[greenkeeper-image]: https://badges.greenkeeper.io/koopjs/winnow.svg
[greenkeeper-url]: https://greenkeeper.io/
