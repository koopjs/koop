# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [3.1.3] - 2022-02-07
### Changed
* Bump FeatureServer to 3.3.2
## [3.1.2] - 2022-02-07
### Fixed
* make access of authInfo compatible with Node.js version lower than 14

## [3.1.1] - 2022-01-18
### Changed
* Peer dependency

## [3.1.0] - 2021-11-30
### Added
* `authInfo` defined by configuration

### Fixed
* Error handling

## [3.0.0] - 2020-02-18
### Changed
* Bump FeatureServer to 3.0.0

## [2.2.1] - 2020-12-14
### Changed
* Bump FeatureServer to 2.25.1

## [2.2.0] - 2020-12-14
### Changed
* Bump FeatureServer to 2.25.0 - better support for CRSs

## [2.1.0] - 2020-11-17
### Added
* Error logging if code is 500
* Replace message with Internal Server Error if 500 code

## [2.0.3] - 2020-10-19
### Fixed
* Only normalize error if it exists.

## [2.0.2] - 2020-10-15
### Fixed
* Only normalize error if it exists.

## [2.0.1] - 2020-10-15
### Fixed
* Ensure error codes are numbers before being passed on to handler; string codes result in unhandled errors.

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

[3.1.3]: https://github.com/koopjs/koop-output-geoservices/compare/v3.1.2...v3.1.3
[3.1.2]: https://github.com/koopjs/koop-output-geoservices/compare/v3.1.1...v3.1.2
[3.1.1]: https://github.com/koopjs/koop-output-geoservices/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/koopjs/koop-output-geoservices/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/koopjs/koop-output-geoservices/compare/v2.2.1...v3.0.0
[2.2.1]: https://github.com/koopjs/koop-output-geoservices/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/koopjs/koop-output-geoservices/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/koopjs/koop-output-geoservices/compare/v2.0.3...v2.1.0
[2.0.3]: https://github.com/koopjs/koop-output-geoservices/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/koopjs/koop-output-geoservices/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/koopjs/koop-output-geoservices/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/koopjs/koop-output-geoservices/compare/v1.5.2...v2.0.0
[1.5.2]: https://github.com/koopjs/koop-output-geoservices/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/koopjs/koop-output-geoservices/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/koopjs/koop-output-geoservices/compare/v1.4.2...v1.5.0
[1.4.2]: https://github.com/koopjs/koop-output-geoservices/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/koopjs/koop-output-geoservices/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/koopjs/koop-output-geoservices/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/koopjs/koop-output-geoservices/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/koopjs/koop-output-geoservices/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/koopjs/koop-output-geoservices/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/koopjs/koop-output-geoservices/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/koopjs/koop-output-geoservices/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/koopjs/koop-output-geoservices/releases/tag/v1.0.0
