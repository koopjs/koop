# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
###Added
* Call model function `authenticationSpecification` (if exists) in the `rest/info` handler and pass data to FeatureServer

### Fixed
* Route intended to be `$namespace/rest/info` was being generated as `$namespace/:host/:id/rest/info`.  Added additional parameters to route object (`hosts` and `disableIdParams`) that allow koop-core to override provider settings to prevent unwanted parameter addition.

## [1.2.0] - 2018-04-27
### Added
* Duplicate FeatureServer routes with `rest/services` included between $namespace and $providerParams placeholders. Placeholder get replaced by provider-specific data registration when paired with koop-core ^3.6.0
* New route `$namespace/rest/info`, for provider-specific server info

## [1.1.2] - 2018-01-09
### Changed
* Use error.code if available

## [1.1.1] - 2017-03-03
### Fixed
* Plugin name is logged correctly at Koop startup

## [1.1.0] - 2017-03-03
### Added
* Support providers using implicit caching

### Changed
* Rename to Koop-Output-Geoservices

## [1.0.0] - 2017-01-25
* Initial Release

[1.2.0]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/koopjs/koop-featureserver-plugin/releases/tag/v1.0.0
