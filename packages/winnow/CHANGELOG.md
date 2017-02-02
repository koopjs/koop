# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
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
* Options `toEsri` causes Winnow to return an esri feature collectio
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

[1.2.1]: https://github.com/dmfenton/winnow/compare/v1.2.0..v1.2.1
[1.2.0]: https://github.com/dmfenton/winnow/compare/v1.1.0..v1.2.0
[1.1.0]: https://github.com/dmfenton/winnow/compare/v1.0.1..v1.1.0
[1.0.1]: https://github.com/dmfenton/winnow/compare/v1.0.0..v1.0.1
[1.0.0]: https://github.com/dmfenton/winnow/compare/v1.0.0-alpha..v1.0.0
[1.0.0-alpha]: https://github.com/dmfenton/winnow/releases/tag/v1.0.0-alpha
