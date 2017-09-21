# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.4.4] 09-21-17
### Fixed
* Limit to max record count

## [2.4.3] 08-23-2017
### Fixed
* Don't throw an exception when response includes only tables
* Allow geometryType to be passed in for layer responses

## [2.4.2] 08-22-2017
### Fixed
* check isNaN instead of falsy for extent validity

## [2.4.1] 08-22-2017
### Fixed
* Don't bomb out /FeatureServer calls when metadata with no extent is passed in

## [2.4.0] 08-04-2017
### Added
* Support for generateRenderer

## [2.3.12] 07-18-2017
### Fixed
* Query returns correct fields when outFields specified

## [2.3.11] - 2017-07-08
### Fixed
* ObjectID Fields set to esriFieldTypeOID

## [2.3.10] - 2017-07-07
### Fixed
* Added package details from [2.3.9]

## [2.3.9] - 2017-07-07
### Fixed
* Import function error in dist

## [2.3.8] - 2017-07-07
### Fixed
* Save id property when rendering layer
### Changed
* Reorganize templates.js into individual render functions
* Renamed renderStatistics to renderStats for render function consistency

## [2.3.7] - 2017-07-06
### Fixed
- supportsPagination => true

## [2.3.6] - 2017-06-28
### Fixed
* fixed out statistics when statistics are passed in

## [2.3.5] - 2017-06-28
### Fixed
* Date fields are properly converted while using statistics

## [2.3.4] - 2017-06-26
### Fixed
* Date fields show up in webmap viewer

## [2.3.3] - 2017-06-20
### Fixed
* Use indexOf instead of includes to compile to es5

## [2.3.2] - 2017-06-16
### Fixed
* correct typo: esrifieldTypeInteger => esriFieldTypeInteger
* object ids no longer undefined on limit queries

## [2.3.1] - 2017-06-15
### Fixed
* Serialize date fields as UNIX timestamps
* Response when objectids query is for a single feature

## [2.3.0] - 2017-06-05
### Added
* Server metadata supports `hasStaticData` and `maxRecordCount`

## [2.2.0] - 2017-06-05
### Added
* Support displayField, timeInfo, maxRecordCount, idField

## [2.1.0] - 2017-06-02
### Added
* Support for passing a server extent e.g. [[-180, -90], [180, 90]]
* Support passed geometryType passed in layer metadata

## [2.0.0] - 2017-06-01
### Added
* /FeatureServer supports multiple layers

### Breaking
* rename `serviceInfo` => `serverInfo`
* remove `serviceInfo` public API
* rename `layers` => `layersInfo`

## [1.3.4] - 2017-04-03
### Fix
* OBJECTID is in the fields array only layer request

## [1.3.3] - 2017-03-28
### Fixed
* OID rewrite is now correct

## [1.3.2] - 2017-03-28
### Changed
* Better way of handling oid overwrite

## [1.3.1] - 2017-03-28
### Fixed
* Don't overwrite OBJECTID field if it already exists

## [1.3.0] - 2017-03-16
### Added
* Support for `f=geojson`

## [1.2.5] - 2017-02-28
### Fixed
* Prevent exception on queries with no features

## [1.2.4] - 2017-02-27
### Fixed
* Prevent object ids from being reshuffled on similar requests

## [1.2.3] - 2017-02-27
### Fixed
* Correct response on /FeatureServer endpoint

## [1.2.2] - 2017-02-14
### Fixed
* Set geometry type correctly on query

## [1.2.1] - 2017-02-14
### Fixed
* Correctly compute spatialReference field

## [1.2.0] - 2017-02-10
### Added
* Support for `outSR`

## [1.1.1] - 2017-02-09
### Fixed
* Features are serialized correctly

## [1.1.0] - 2017-02-06
### Changed
* Enable orderByFields

## [1.0.10] - 2017-02-06
### Fixed
* Create correct response for group by statistics

## [1.0.9] - 2017-02-06
### Added
* Handle JSON parameters in all query options

## [1.0.8] - 2017-02-02
### Fixed
* Exclude features from layer info response

## [1.0.7] - 2017-02-02
### Fixed
* Coerce all query parameters to true or false before any function is executed

## [1.0.6] - 2017-02-01
### Fixed
* Pre es6 compatiblity

## [1.0.5] - 2017-02-01
### Fixed
* Build error

## [1.0.4] - 2017-02-01
### Changed
* Reorganize templates

## [1.0.3] - 2017-02-01
### Fixed
* Dont overwrite templates/index in compile step

## [1.0.2] - 2017-01-31
### Fixed
* Geometry query is parsed as json

## [1.0.1] - 2017-01-31
### Fixed
* Remove Standard from deps
* Fix reference errors in query

## [1.0.0] - 2017-01-25
* Initial Release

[2.4.4]: https://github.com/koopjs/featureserver/compare/v2.4.3...v2.4.4
[2.4.3]: https://github.com/koopjs/featureserver/compare/v2.4.2...v2.4.3
[2.4.2]: https://github.com/koopjs/featureserver/compare/v2.4.1...v2.4.2
[2.4.1]: https://github.com/koopjs/featureserver/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/featureserver/featureserver/compare/v2.3.12...v2.4.0
[2.3.12]: https://github.com/featureserver/featureserver/compare/v2.3.11...v2.3.12
[2.3.11]: https://github.com/featureserver/featureserver/compare/v2.3.10...v2.3.11
[2.3.10]: https://github.com/featureserver/featureserver/compare/v2.3.9...v2.3.10
[2.3.9]: https://github.com/featureserver/featureserver/compare/v2.3.8...v2.3.9
[2.3.8]: https://github.com/featureserver/featureserver/compare/v2.3.7...v2.3.8
[2.3.7]: https://github.com/featureserver/featureserver/compare/v2.3.6...v2.3.7
[2.3.6]: https://github.com/featureserver/featureserver/compare/v2.3.5...v2.3.6
[2.3.5]: https://github.com/featureserver/featureserver/compare/v2.3.4...v2.3.5
[2.3.4]: https://github.com/featureserver/featureserver/compare/v2.3.3...v2.3.4
[2.3.3]: https://github.com/featureserver/featureserver/compare/v2.3.2...v2.3.3
[2.3.2]: https://github.com/featureserver/featureserver/compare/v2.3.1...v2.3.2
[2.3.1]: https://github.com/featureserver/featureserver/compare/v2.3.1...v2.3.0
[2.3.0]: https://github.com/featureserver/featureserver/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/featureserver/featureserver/compare/v2.2.0...v2.1.0
[2.1.0]: https://github.com/featureserver/featureserver/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/featureserver/featureserver/compare/v2.0.0...v1.3.4
[1.3.4]: https://github.com/featureserver/featureserver/compare/v1.3.3...v1.3.4
[1.3.3]: https://github.com/featureserver/featureserver/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/featureserver/featureserver/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/featureserver/featureserver/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/featureserver/featureserver/compare/v1.2.5...v1.3.0
[1.2.5]: https://github.com/featureserver/featureserver/compare/v1.2.5...v1.2.4
[1.2.4]: https://github.com/featureserver/featureserver/compare/v1.2.3...v1.2.4
[1.2.3]: https://github.com/featureserver/featureserver/compare/v1.2.3...v1.2.2
[1.2.2]: https://github.com/featureserver/featureserver/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/featureserver/featureserver/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/featureserver/featureserver/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/featureserver/featureserver/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/featureserver/featureserver/compare/v1.0.10...v1.1.0
[1.0.10]: https://github.com/featureserver/featureserver/compare/v1.0.9...v1.0.10
[1.0.9]: https://github.com/featureserver/featureserver/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/featureserver/featureserver/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/featureserver/featureserver/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/featureserver/featureserver/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/featureserver/featureserver/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/featureserver/featureserver/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/featureserver/featureserver/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/featureserver/featureserver/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/featureserver/featureserver/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/featureserver/featureserver/releases/tag/v1.0.0
