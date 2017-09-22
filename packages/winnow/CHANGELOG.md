# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.12.3] - 09-22-2017
### Fixed
* Do not throw error on geometries that cannot be projected

## [1.12.2] - 08-30-2017
### Fixed
* Do not project non-numeric coordinates

## [1.12.1] - 08-18-2017
### Fixed
* handle NaN, null, undefined, '' values when classifying
* properly handle offset

## [1.12.0] - 08-14-2017
### Added
- Basic WFS support: bbox query and geojson output

## [1.11.2] 08-08-2017
### Fixed
* where clause ignores `1=1` condition when other conditions present

## [1.11.1] 08-03-2017
### Fixed
* added is sql operator
* added sql checks for 0 value and Esri geometry

## [1.11.0] 08-03-2017
### Added
* Support for creating class and unique value breaks

## [1.10.7] 07-17-2017
### Fixed
* Where clause handles multiple conditions

## [1.10.6] 07-07-2017
### Fixed
* Correct typo with idField setting

## [1.10.5] - 07-06-2017
### Fixed
* Query doesn't throw an error when no feature results found

## [1.10.4] - 06-28-2017
### Fixed
* Query ignores projection parameter when getting an aggregate

## [1.10.3] - 06-26-2017
### Fixed
Deep clone for dates since mutating dates has down stream consequences if reused
* correct typo: winnow.sql => winnow.querySql

## [1.10.2] - 06-20-2017
### Fixed
* Do not overwrite existing OID

## [1.10.1] - 06-16-2017
### Fixed
* Add object ids to on limit queries when `options.toEsri` is true

## [1.10.0] - 06-15-2017
### Added
* Detect field types if they are not passed in with `geojson.metadata`
* Translate ISO Date Strings to Unix Timestamps when `options.toEsri` is true
* Add Object IDs if there is no ID field set with `options.toEsri` is true

## [1.9.0] - 05-24-2017
### Added
* Support outSR for polygons and lines
* Support selected geometry precision

## [1.8.8] - 04-26-2017
### Fixed
* Handle possible exception when field domains are null

## [1.8.7] - 04-13-2017
### Fixed
* Handle esri-style date queries

## [1.8.6] - 04-13-2017
### Fixed
* Handle esri domains that are null

## [1.8.5] - 04-12-2017
### Added
* Handle esri style geometries with web mercator as a wkt

## [1.8.4] - 03-28-2017
### Changed
* Refactor CVD code, handle more types

## [1.8.3] - 03-27-2017
### Fixed
* Handle coded value domains with esriFields passed in

## [1.8.2] - 03-24-2017
### Fixed
* Properly reproject input geometries that have multiple polygons

## [1.8.1] - 03-17-2017
### Fixed
* Return correct features for envelope queries with an inSR and spatialReference specified on the envelope

## [1.8.0] - 03-14-2017
### Added
* Support all esri geometry types
* Support `inSR` geoservices parameter

## [1.7.1] - 03-13-2017
### Fixed
* Disable alasql sqlCache to prevent memory leak

## [1.7.0] - 02-27-2017
### Added
* Support for geometry filters specified as strings

## [1.6.0] - 02-27-2017
### Added
* Support for geometry filters specified as arrays

## [1.5.4] - 02-14-2017
### Changed
* Bring in code from terraformer-arcgis-parser, modify to remove spatialReference

### Fixed
* Projected esri geometries no longer contain incorrect spatial reference objects

## [1.5.3] - 02-14-2017
### Fixed
* Handle outSR when it's just a number

## [1.5.2] - 02-10-2017
### Fixed
* Rebuild

## [1.5.1] - 02-10-2017
### Fixed
* OutSR parameter handles latestWkid and wkt

## [1.5.0] - 02-10-2017
### Added
* Support for geometry projections and the esri `outSR` parameter

## [1.4.2] - 02-06-2017
### Fixed
* Rebuild

## [1.4.1] - 02-06-2017
### Fixed
* Correctly handle esri style options.outFields and options.where

## [1.4.0] - 02-06-2017
* Support resultRecordCount and resultOffset

## [1.3.0] - 02-06-2017
### Added
* Support groupBy/groupByFieldsForStatistics
* Support for order/orderByFields

### Changed
* Remove support for options as JSON strings

### Fixed
* Escape statistics out name

## [1.2.2] - 02-01-2017
### Fixed
* Handle case when geometry is null and `toEsri` is true

## [1.2.1] - 10-14-2016
### Fixed
* Can now handle multiPolygons with empty coords array

## [1.2.0] - 07-26-2016
### Added
* Support calling functions on fields like `UPPER`

## [1.1.0] - 05-11-2016
### Added
* Options `toEsri` causes Winnow to return an esri feature collection
* Support esri-style spatial predicates
* Support esri-style aggregations

### Changed
* Default spatial predicate to ST_Intersects

### Fixed
* Support fields like `total precip`
* downcased `var` and `stddev` work
* within and contains were flipped

## [1.0.1] - 03-29-2016
### Fixed
* Handle esri-style envelopes without a spatialReference

## [1.0.0] - 02-25-2016
### Added
* New prepared query options
* Field aggregations
* Field selections

### Changed
* spatialPredicate moved from geometry object to options object

## [1.0.0-alpha] - 02-19-2016
### Added
* Initial release

[1.12.3]: https://github.com/featureserver/winnow/compare/v1.12.2...v1.12.3
[1.12.2]: https://github.com/featureserver/winnow/compare/v1.12.1...v1.12.2
[1.12.1]: https://github.com/featureserver/winnow/compare/v1.12.0...v1.12.1
[1.12.0]: https://github.com/featureserver/winnow/compare/v1.12.0...v1.11.2
[1.11.2]: https://github.com/featureserver/winnow/compare/v1.11.1...v1.11.2
[1.11.1]: https://github.com/featureserver/winnow/compare/v1.11.0...v1.11.1
[1.11.0]: https://github.com/featureserver/winnow/compare/v1.10.7...v1.11.0
[1.10.7]: https://github.com/featureserver/winnow/compare/v1.10.6...v1.10.7
[1.10.6]: https://github.com/featureserver/winnow/compare/v1.10.5...v1.10.6
[1.10.5]: https://github.com/featureserver/winnow/compare/v1.10.4...v1.10.5
[1.10.4]: https://github.com/featureserver/winnow/compare/v1.10.3...v1.10.4
[1.10.3]: https://github.com/featureserver/winnow/compare/v1.10.2...v1.10.3
[1.10.2]: https://github.com/featureserver/winnow/compare/v1.10.1...v1.10.2
[1.10.1]: https://github.com/featureserver/winnow/compare/v1.10.0...v1.10.1
[1.10.0]: https://github.com/featureserver/winnow/compare/v1.9.0...v1.10.0
[1.9.0]: https://github.com/featureserver/winnow/compare/v1.9.0...v1.8.8
[1.8.8]: https://github.com/featureserver/winnow/compare/v1.8.7...v1.8.8
[1.8.7]: https://github.com/featureserver/winnow/compare/v1.8.7...v1.8.6
[1.8.6]: https://github.com/featureserver/winnow/compare/v1.8.5...v1.8.6
[1.8.5]: https://github.com/featureserver/winnow/compare/v1.8.5...v1.8.4
[1.8.4]: https://github.com/featureserver/winnow/compare/v1.8.3...v1.8.4
[1.8.3]: https://github.com/featureserver/winnow/compare/v1.8.3...v1.8.2
[1.8.2]: https://github.com/featureserver/winnow/compare/v1.8.1...v1.8.2
[1.8.1]: https://github.com/featureserver/winnow/compare/v1.8.1...v1.8.0
[1.8.0]: https://github.com/featureserver/winnow/compare/v1.7.1...v1.8.0
[1.7.1]: https://github.com/featureserver/winnow/compare/v1.7.1...v1.7.0
[1.7.0]: https://github.com/featureserver/winnow/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/featureserver/winnow/compare/v1.6.0...v1.5.4
[1.5.4]: https://github.com/featureserver/winnow/compare/v1.5.3...v1.5.4
[1.5.3]: https://github.com/featureserver/winnow/compare/v1.5.2...v1.5.3
[1.5.2]: https://github.com/featureserver/winnow/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/featureserver/winnow/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/featureserver/winnow/compare/v1.4.2...v1.5.0
[1.4.2]: https://github.com/featureserver/winnow/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/featureserver/winnow/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/featureserver/winnow/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/featureserver/winnow/compare/v1.2.2...v1.3.0
[1.2.2]: https://github.com/featureserver/winnow/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/featureserver/winnow/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/featureserver/winnow/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/featureserver/winnow/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/featureserver/winnow/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/featureserver/winnow/compare/v1.0.0-alpha...v1.0.0
[1.0.0-alpha]: https://github.com/featureserver/winnow/releases/tag/v1.0.0-alpha
