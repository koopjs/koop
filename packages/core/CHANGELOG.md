# @koopjs/koop-core

## 9.2.3

### Patch Changes

- @koopjs/output-geoservices@7.1.2

## 9.2.2

### Patch Changes

- ensure constructor options are optional

## 9.2.1

### Patch Changes

- @koopjs/output-geoservices@7.1.1

## 9.2.0

### Minor Changes

- allow FeatureServer server and layer metadata to be overriden with `geoservicesDefaults` option in the output's constructor

### Patch Changes

- Updated dependencies [8f67c70]
  - @koopjs/output-geoservices@7.1.0

## 9.1.1

### Patch Changes

- refactor provider registration

## 9.1.0

### Minor Changes

- make 'cache', 'before', and 'after' private model props
- add `cacheSize` option
- add `cacheTtl` option for provider registration

## 9.0.0

### Major Changes

- changed default memory cache; this should really only be used internally, but it is exposed as a public property in registered providers. Ff providers were directly using this cache and any of the removed methods, errors will occur. Such providers should stop using Koop's internal cache implement their own in the provider code

### Patch Changes

- Updated dependencies [e24092c]
  - @koopjs/cache-memory@5.0.0

## 8.0.11

### Patch Changes

- Updated dependencies [34d8317]
  - @koopjs/output-geoservices@7.0.0

## 8.0.10

### Patch Changes

- @koopjs/output-geoservices@6.0.8

## 8.0.9

### Patch Changes

- @koopjs/output-geoservices@6.0.7

## 8.0.8

### Patch Changes

- @koopjs/output-geoservices@6.0.6

## 8.0.7

### Patch Changes

- @koopjs/output-geoservices@6.0.5

## 8.0.6

### Patch Changes

- @koopjs/output-geoservices@6.0.4

## 8.0.5

### Patch Changes

- @koopjs/output-geoservices@6.0.3

## 8.0.4

### Patch Changes

- Updated dependencies [1e8df8d]
  - @koopjs/cache-memory@4.0.1

## 8.0.3

### Patch Changes

- use new \_cache metadata property when available

## 8.0.2

### Patch Changes

- @koopjs/output-geoservices@6.0.2

## 8.0.1

### Patch Changes

- @koopjs/output-geoservices@6.0.1

## 8.0.0

### Major Changes

- drop support for Node 12

### Patch Changes

- Updated dependencies [98fe5ca]
  - @koopjs/cache-memory@4.0.0
  - @koopjs/logger@5.0.0
  - @koopjs/output-geoservices@6.0.0

## 7.1.2

### Patch Changes

- Updated dependencies [6e2ce57]
  - @koopjs/logger@4.1.1
  - @koopjs/output-geoservices@5.2.5

## 7.1.1

### Patch Changes

- Updated dependencies [b8f21bd]
  - @koopjs/logger@4.1.0
  - @koopjs/output-geoservices@5.2.4

## 7.1.0

### Minor Changes

- support explicit options argument in provider Model constructor

## 7.0.2

### Patch Changes

- @koopjs/output-geoservices@5.2.3

## 7.0.1

### Patch Changes

- @koopjs/output-geoservices@5.2.2

## 7.0.0

### Major Changes

- BREAKING CHANGE: remove query param coercion (empty string to undefined, "true"/"false" to bool, stringified JSON to JSON) - this should be handled in output plugins or in Koop instance
- BREAKING CHANGE: remove merging of query and body parameters - this should be handled in output plugins or in Koop instance

### Patch Changes

- @koopjs/output-geoservices@5.2.1

## 6.1.2

### Patch Changes

- fix reference to geoservices package

## 6.1.1

### Patch Changes

- Updated dependencies [c1b0bce]
  - @koopjs/output-geoservices@5.2.0

## 6.1.0

### Minor Changes

- allow use of custom logger when passed in as part of configuration object

### Patch Changes

- Updated dependencies [2d8106f]
- Updated dependencies [2d8106f]
  - @koopjs/logger@4.0.0
  - @koopjs/output-geoservices@5.1.0

## 6.0.2

### Patch Changes

- Updated dependencies [9fe3053]
  - @koopjs/output-geoservices@5.0.0

## 6.0.1

### Patch Changes

- Patch bumping for a clean release
- Updated dependencies [c7decc5]
- Updated dependencies [c7decc5]
- Updated dependencies [c7decc5]
  - @koopjs/cache-memory@3.0.1
  - @koopjs/logger@3.0.1
  - @koopjs/output-geoservices@4.0.1

## 6.0.0

### Major Changes

- Removed default `datasets` plugin
- Removed default inclusion of LocalFS - 10-13-2022
- scope repo to koop organization
- migrate to Koop monorepo
- move code to `/src` directory
- co-locate unit test files
- migrate to eslint

### Patch Changes

- Updated dependencies [0c8944e4]
- Updated dependencies [0c8944e4]
- Updated dependencies [0c8944e4]
  - @koopjs/logger@3.0.0
  - @koopjs/output-geoservices@4.0.0
  - @koopjs/cache-memory@3.0.0
