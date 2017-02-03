# Project Goal
*Winnow* is made for applying sql to geojson in memory. It is useful for working against geojson objects but also has built-in primitives for piping streams.

[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![js-standard-style][standard-img]][standard-url]

[npm-img]: https://img.shields.io/npm/v/winnow.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/winnow
[travis-img]: https://img.shields.io/travis/dmfenton/winnow/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dmfenton/winnow
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/

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

### `outStatistics`
Like aggregates but follows esri's query API

e.g:
```javascript
[
  {
    statisticType: 'sum',
    onStatisticField: 'Trunk_Diameter',
    outStatisticFieldName: 'Total_Trunk_Diameter'
  },
  {
    statisticType: 'avg',
    onStatisticField: 'Trunk_Diameter'
  }
]
```

### `toEsri`
If true, the object returned will be an esri feature collection

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

## `winnow.sql`
Execute sql directly against the query engine.

- Replace any variables with ?
 - Table name should always be replaced by ?
 - Non-string values always be replaced by ?


 ```javascript
 const statement = 'Select * from ? where Genus in ?'
 const data = geojson
 const genus = ['Quercus']
 winnow.sql(statement, [geojson, genus])
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

Find a bug or want to request a new feature? Please let us know by submitting an [issue](https://github.com/dmfenton/winnow/issues).

# Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/contributing).

# License

[Apache 2.0](LICENSE)
