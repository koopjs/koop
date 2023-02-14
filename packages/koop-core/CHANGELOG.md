# @koopjs/koop-core

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
