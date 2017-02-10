# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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

[1.5.2]: https://github.com/dmfenton/winnow/compare/v1.5.1..v1.5.2
[1.5.1]: https://github.com/dmfenton/winnow/compare/v1.5.0..v1.5.1
[1.5.0]: https://github.com/dmfenton/winnow/compare/v1.4.2..v1.5.0
[1.4.2]: https://github.com/dmfenton/winnow/compare/v1.4.1..v1.4.2
[1.4.1]: https://github.com/dmfenton/winnow/compare/v1.4.0..v1.4.1
[1.4.0]: https://github.com/dmfenton/winnow/compare/v1.3.0..v1.4.0
[1.3.0]: https://github.com/dmfenton/winnow/compare/v1.2.2..v1.3.0
[1.2.2]: https://github.com/dmfenton/winnow/compare/v1.2.1..v1.2.2
[1.2.1]: https://github.com/dmfenton/winnow/compare/v1.2.0..v1.2.1
[1.2.0]: https://github.com/dmfenton/winnow/compare/v1.1.0..v1.2.0
[1.1.0]: https://github.com/dmfenton/winnow/compare/v1.0.1..v1.1.0
[1.0.1]: https://github.com/dmfenton/winnow/compare/v1.0.0..v1.0.1
[1.0.0]: https://github.com/dmfenton/winnow/compare/v1.0.0-alpha..v1.0.0
[1.0.0-alpha]: https://github.com/dmfenton/winnow/releases/tag/v1.0.0-alpha
