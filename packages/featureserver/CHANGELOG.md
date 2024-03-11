# @koopjs/featureserver

## 8.5.3

### Patch Changes

- allow exceededTransferLimit to be set by provider metadata
- Updated dependencies [95160a7]
  - @koopjs/winnow@5.0.0

## 8.5.2

### Patch Changes

- allow proper PBF encoding of string OID values

## 8.5.1

### Patch Changes

- changes to JSON specification sent to PBF encoder

## 8.5.0

### Minor Changes

- allow supportedQueryFormats override from provider metadata

## 8.4.0

### Minor Changes

- allow supportedQueryFormats to be overridden with geoservice defaults

## 8.3.3

### Patch Changes

- allow + as whitespace equivalent in where param

## 8.3.2

### Patch Changes

- Updated dependencies [ff596ff]
  - @koopjs/winnow@4.3.0

## 8.3.1

### Patch Changes

Fix schema for quantizationParameter

## 8.3.0

### Minor Changes

- add support for PBF output on query endpoint

## 8.2.0

### Minor Changes

- add owningSystemUrl to restInfo response

## 8.1.9

### Patch Changes

- handle SQL date types in field defs

## 8.1.8

### Patch Changes

- prevent log message when OBJECTID found in data
- Updated dependencies [2e50b96]
  - @koopjs/winnow@4.2.1

## 8.1.7

### Patch Changes

- Updated dependencies [f400c85]
  - @koopjs/winnow@4.2.0

## 8.1.6

### Patch Changes

- add type check to callback sanitization

## 8.1.5

### Patch Changes

- allow null or empty strings as overrides for description, service description, copyrightText

## 8.1.4

### Patch Changes

- rename log-manager files
- Updated dependencies [de597a6]
  - @koopjs/winnow@4.1.4

## 8.1.3

### Patch Changes

- logger needs to be acquired at request time
- Updated dependencies [8bdc90d]
  - @koopjs/winnow@4.1.3

## 8.1.2

### Patch Changes

- Updated dependencies [260c898]
  - @koopjs/winnow@4.1.2

## 8.1.1

### Patch Changes

- Updated dependencies [1e94ba5]
  - @koopjs/winnow@4.1.1

## 8.1.0

### Minor Changes

- all server and layer metadata defaults to be overriden with setDefaults method

## 8.0.0

### Major Changes

- remove authentication and authorization handling and move to output-geoservices

## 7.1.7

### Patch Changes

- move filtering of objectIds to winnow dependency
- Updated dependencies [8671389]
  - @koopjs/winnow@4.1.0

## 7.1.6

### Patch Changes

- fix: coerce POST body parameters

## 7.1.5

### Patch Changes

- date parser fix
- add logger
- Updated dependencies [faf732d]
  - @koopjs/winnow@4.0.5

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
