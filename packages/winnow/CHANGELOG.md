# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Added
* Allow input geospatial data that does not use the WGS84 coordinate system. Input coordinate system can be defined with the `inputCrs` options or defined on the GeoJSON collection via the `crs` path.
* Add `outputCrs` option as an alias for the `projection` option as it is a better description of the option's value and compliments `inputCrs`.
* Add WKT lookup for spatial reference ids passed as `inputCrs`, `outputCrs` (formerly `projection`), `inputSR`, or geometry-filter `wkid`/`latestWkid`

## [2.1.1] - 11-11-2020
### Fixed
* Fixes a bug in the "envelope-intersects" operation.  Research indicates that the Esri envelope-intersects operation should check that an "Envelope of Query Geometry Intersects Envelope of Target Geometry" (see [here](http://resources.esri.com/help/9.3/ArcGISDesktop/ArcObjects/esriGeoDatabase/esriSpatialRelEnum.htm)).
* Handle sql-escape single quotes in where parameter, e.g. `where=food=bar''s`

### Added
* Adds support for the `!=` operator in the hashed OBJECTID comparison.

## [2.1.0] - 10-06-2020
### Added
* Use environment variable to force javascript hashing of feature for OBJECTID. OBJECTID_FEATURE_HASH=javascript

## [2.0.2] - 09-23-2020
### Fixed
* Farmhash was not working on Heroku, now can gracefully fallback on systems without a working Farmhash binary.

## [2.0.1] - 09-10-2020
### Fixed
* Version bump for flopped release and publish

## [2.0.0] - 09-08-2020
### Changed
* Drop support for older Node by remove Babel compile.
* Remove `src` directory and replace with `lib`.
* Move methods from `index.js` to their own files.
* Rename/reorganize files for clarity and to prevent collisions caused by moving methods out of `index.js`.

## [1.16.13] - 06-16-2020
### Changed
* update from `terraformer` to `@terraformer/spatial`

## [1.16.12] - 03-06-2020
### Fixed
* Fix returning null dates instead of 0.

## [1.16.11] - 11-05-2019
### Changed
* Version bump

## [1.16.10] - 11-05-2019
### Fixed
* Fix SQL generated when using group by with where clause.
* Split comma delimited group by fields

## [1.16.9] - 08-02-2019
### Fixed
* ST_Within had geometry targets reversed. Now tests that feature is within filter.

## [1.16.8] - 06-21-2019
### Fixed
* turf.js centroid function assignment

### Changed
* more descriptive message about `idField` value not conforming

## [1.16.7] - 06-11-2019
### Fixed
* Support for using OBJECTID in `where` even when OBJECTIDs are generated on-the-fly in Winnow

## [1.16.6] - 03-25-2019
### Changed
* Geometry envelopes are constructed in counter-clockwise ring

## [1.16.5] - 11-28-2018
### Changed
* Removed workaround for adding and `OBJECTID` field even when metadata `idField` is set

## [1.16.4] - 09-13-2018
### Fixed
* Parse comma delimited `orderByFields` parameter and trim any white space.

### Changed
* Show warnings when `NODE_ENV !== 'production'` AND `KOOP_WARNINGS !== 'suppress'`

## [1.16.3] - 07-30-2018
### Fixed
* Remove dependency on node-srs
* In `normalizeSR`, add WKT lookups for uncommon WKIDs so that valid WKIDs are not considered unknown and redefined
* In `normalizeSR`, add check for WGS_1984_Web_Mercator_Auxiliary_Sphere and return 3857 when found

## [1.16.2] - 07-11-2018
### Fixed
* Make farmhash an optional dependency due to its need for compilation, which some environments may not support

## [1.16.1] - 07-05-2018
### Fixed
* Ensure OBJECTID is omitted from query results when options specifically exclude it (e.g., `returnIdsOnly=true`)
* Moved `esriFy` function to SQL, which now allows ORDER BY, LIMIT, OFFSET to also be applied via SQL.

## [1.16.0] - 06-29-2018
### Added
* Add normalization of a `option.sourceSR`; this option identifies the CRS of the source data and defaults to 'EPSG:4326';
* If `option.sourceSR` is defined and geometry filter is defined, the geometry filter is reprojected to the CRS of the source
* Use srs npm to validate WKT CRS
* Added additional polygon projection tests

## [1.15.3] - 06-04-2018
### Fixed
* Handle `inSR` options that arrive as objects

## [1.15.2] - 05-03-2018
### Added
* Warning when `idField` used for OBJECTID assignement is not an integer or is out-of-range.

## [1.15.1] - 05-02-2018
### Fixed
* assignment of OBJECTID had used the `idField` of a query result rather that the raw feature; thus, assignment could not occur unless the `idField` was returned by the SELECT. Alter to use raw feature's `idField`

## [1.15.0] - 04-20-2018
### Added
* support for `esriSpatialRelEnvelopeIntersects`

### Fixed
* coordinates not projected when latitude or longitude is 0

## [1.14.0] - 04-17-2018
### Fixed
* OBJECTID collisions when a provider's `idField` is unspecified.  Now creating a numeric hash for each raw feature

## [1.13.0] - 04-04-2018
### Added
* Add support for date comparisons in WHERE filter with timestamp Syntax and BETWEEN operator

### Fixed
* Exclusion of date fields from response when not requested with `outFields` option
* Attempted property access of null feature in `ST_Intersects` function

## [1.12.7] - 04-03-2018
### Fixed
* Ensure geometry is omitted from query results when option `returnGeometry: false`

### Added
* RELEASE.md and linked to it from README.md

## [1.12.6] - 12-05-2017
### Fixed
* Exception when feature is null
* Parsing of complex where clauses

## [1.12.5] - 10-27-2017
### Fixed
* Converting polygons from geojson to esri json

## [1.12.4] - 10-5-2017
### Changed
* Add metadata.limitExceeded true/false on limit queries to denote whether the limit restricted the number of features returned

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

[2.1.1]: https://github.com/featureserver/winnow/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/featureserver/winnow/compare/v2.0.2...v2.1.0
[2.0.2]: https://github.com/featureserver/winnow/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/featureserver/winnow/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/featureserver/winnow/compare/v1.16.13...v2.0.0
[1.16.13]: https://github.com/featureserver/winnow/compare/v1.16.12...v1.16.13
[1.16.12]: https://github.com/featureserver/winnow/compare/v1.16.11...v1.16.12
[1.16.11]: https://github.com/featureserver/winnow/compare/v1.16.10...v1.16.11
[1.16.10]: https://github.com/featureserver/winnow/compare/v1.16.9...v1.16.10
[1.16.9]: https://github.com/featureserver/winnow/compare/v1.16.8...v1.16.9
[1.16.8]: https://github.com/featureserver/winnow/compare/v1.16.7...v1.16.8
[1.16.7]: https://github.com/featureserver/winnow/compare/v1.16.6...v1.16.7
[1.16.6]: https://github.com/featureserver/winnow/compare/v1.16.5...v1.16.6
[1.16.5]: https://github.com/featureserver/winnow/compare/v1.16.4...v1.16.5
[1.16.4]: https://github.com/featureserver/winnow/compare/v1.16.3...v1.16.4
[1.16.3]: https://github.com/featureserver/winnow/compare/v1.16.2...v1.16.3
[1.16.2]: https://github.com/featureserver/winnow/compare/v1.16.1...v1.16.2
[1.16.1]: https://github.com/featureserver/winnow/compare/v1.16.0...v1.16.1
[1.16.0]: https://github.com/featureserver/winnow/compare/v1.15.3...v1.16.0
[1.15.3]: https://github.com/featureserver/winnow/compare/v1.15.2...v1.15.3
[1.15.2]: https://github.com/featureserver/winnow/compare/v1.15.1...v1.15.2
[1.15.1]: https://github.com/featureserver/winnow/compare/v1.15.0...v1.15.1
[1.15.0]: https://github.com/featureserver/winnow/compare/v1.14.0...v1.15.0
[1.14.0]: https://github.com/featureserver/winnow/compare/v1.13.0...v1.14.0
[1.13.0]: https://github.com/featureserver/winnow/compare/v1.12.7...v1.13.0
[1.12.7]: https://github.com/featureserver/winnow/compare/v1.12.6...v1.12.7
[1.12.6]: https://github.com/featureserver/winnow/compare/v1.12.5...v1.12.6
[1.12.5]: https://github.com/featureserver/winnow/compare/v1.12.4...v1.12.5
[1.12.4]: https://github.com/featureserver/winnow/compare/v1.12.3...v1.12.4
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
