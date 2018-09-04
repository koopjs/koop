# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2018-09-04
### Changed
* Pass Express request object as argument in calls to `this.model.authorize` and `this.model.authenticate`

## [1.5.2] - 2018-06-08
### Fixed
* Simplify acquisition of authentication specification from Model.

## [1.5.1] - 2018-05-30
### Fixed
* Bumped FeatureServer version to 2.15.0

## [1.5.0] - 2018-05-29
### Added
* Use `https` as the default protocol when constructing the `tokenServicesUrl` in the `featureServerRestInfo` handler. Default is overridden when an `useHttp` property is defined on the result of `authenticationSpecification()` or when an environment variable `KOOP_AUTH_HTTP=true`
* Added base-url fragment to `tokenServicesUrl`

## [1.4.2] - 2018-05-23
### Fixed
* missed FeatureServer handling of authentication error

## [1.4.1] - 2018-05-22
### Fixed
* convert `async/await` to promises 

## [1.4.0] - 2018-05-22
### Added 
* handling of authorization and authentication errors

### Fixed
* Bump FeatureServer version to 2.14.1 in order to support added authentication handling

## [1.3.0] - 2018-05-17
### Added
* Call model function `authenticationSpecification` (if exists) in the `rest/info` handler and pass data to FeatureServer
* Add route `rest/generateToken` and pass on to associated handler which in turn calls model's `authenticate` function

### Fixed
* Bumped koop-core peer dependency to 3.6.1
* Bumped featureserver dependency to 2.13.0

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

[2.0.0]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.5.2...v2.0.0
[1.5.2]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.4.2...v1.5.0
[1.4.2]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/koopjs/koop-featureserver-plugin/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/koopjs/koop-featureserver-plugin/releases/tag/v1.0.0
