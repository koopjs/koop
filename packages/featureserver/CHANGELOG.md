# @koopjs/featureserver

## 7.1.4

### Patch Changes

- cleanup inefficient regexs
- Updated dependencies [accae0c]
  - @koopjs/winnow@4.0.4

## 7.1.3

### Patch Changes

- Updated dependencies [f90b4ac]
  - @koopjs/winnow@4.0.3

## 7.1.2

### Patch Changes

- wrap errors like ArcGIS server
- Updated dependencies [ba532e2]
  - @koopjs/winnow@4.0.2

## 7.1.1

### Patch Changes

- tolerate strings that begin with problematic characters

## 7.1.0

### Minor Changes

- add support for returnDistinctValues

### Patch Changes

- Updated dependencies [3097431]
  - @koopjs/winnow@4.0.1

## 7.0.0

### Major Changes

- drop support for Node 12

### Patch Changes

- Updated dependencies [98fe5ca]
  - @koopjs/winnow@4.0.0

## 6.1.0

### Minor Changes

set hasZ from feature metadata in query handler

## 6.0.1

### Patch Changes

- Updated dependencies [c2882fa]
  - @koopjs/winnow@3.1.1

## 6.0.0

### Major Changes

- BREAKING CHANGE: remove support for "limit" query param as it is not part of the Geoservices API specification
- add coercion of query params (empty string to undefined, "true"/"false" to bool, stringified JSON to JSON)
- merge body and query params into one set of request parameters

## 5.1.0

### Minor Changes

- use koop or other winston-based logger instead of console
- add a Logger singleton
- add a public `setLogger` method that can be used to override default logger or set level
- pass logger instance on to Winnow

### Patch Changes

- Updated dependencies [c1b0bce]
  - @koopjs/winnow@3.1.0

## 5.0.1

### Patch Changes

- Patch bumping for a clean release
- Updated dependencies [c7decc5]
  - @koopjs/winnow@3.0.1

## 5.0.0

### Major Changes

- scope repo to koop organization
- migrate to Koop monorepo
- move code to `/src` directory
- co-locate unit test files
- migrate to eslint

### Patch Changes

- Updated dependencies [0c8944e4]
  - @koopjs/winnow@3.0.0
