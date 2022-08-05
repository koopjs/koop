# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.1] - 2022-08-05
### Fixed
* default options object on catalog methods

## [2.0.0] - 2022-08-04
### Fixed
* items in the cache no longer mutable by other post-caching manipulation

### Changed
* Moved to class syntax and removed prototype-namespacing of catalog methods (breaking, since public methods, but not breaking for usage in koop-core)

## [1.2.0] - 2022-06-23
### Changed
* Fixed an issue where some geojson properties (like `crs`) were lost in the caching procedure

## [1.1.2] - 2022-04-15
### Changed
* Remove buble build

## [1.1.1] - 2022-04-15
### Changed
* Replace highland with node stream Readable
* Move to @koopjs

## [1.1.0] - 2017-02-15
### Added
* Upsert API

## [1.0.2] - 2017-02-13
### Fixed
* Remove double callback in cache insert

## [1.0.1] - 2017-02-13
### Changed
* Build NPM package without src or test

## [1.0.0] - 2017-02-13
* Initial Release

[1.2.0]: https://github.com/koopjs/koop-cache-memory/releases/tag/v1.2.0
[1.1.2]: https://github.com/koopjs/koop-cache-memory/releases/tag/v1.1.2
[1.1.1]: https://github.com/koopjs/koop-cache-memory/releases/tag/v1.1.1
[1.1.0]: https://github.com/koopjs/koop-cache-memory/releases/tag/v1.1.0
[1.0.2]: https://github.com/koopjs/koop-cache-memory/releases/tag/v1.0.2
[1.0.1]: https://github.com/koopjs/koop-cache-memory/releases/tag/v1.0.1
[1.0.0]: https://github.com/koopjs/koop-cache-memory/releases/tag/v1.0.0
