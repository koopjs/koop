# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Added
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

[1.0.1]: https://github.com/dmfenton/winnow/compare/v1.0.0..v1.0.1
[1.0.0]: https://github.com/dmfenton/winnow/compare/v1.0.0-alpha..v1.0.0
[1.0.0-alpha]: https://github.com/dmfenton/winnow/releases/tag/v1.0.0-alpha
