# @koopjs/winnow

## 5.0.1

### Patch Changes

- debug-log idField warnings due to data-type and integer range separately

## 5.0.0

### Major Changes

- change collection.metadata.limitExceeded to collection.metadata.exceededTransferLimit

## 4.3.0

### Minor Changes

- swap stringhash for murmurhash

## 4.2.1

### Patch Changes

- alter log message for max safe integer range

## 4.2.0

### Minor Changes

- allow string attributes as objectIds parameter for filtering

## 4.1.4

### Patch Changes

- rename log-manager files

## 4.1.3

### Patch Changes

- logger needs to be acquired at request time

## 4.1.2

### Patch Changes

- fix filtering by objectIds option

## 4.1.1

### Patch Changes

- need logger dep for stand alone usage

## 4.1.0

### Minor Changes

- add an objectIds parameter, so that filtering by object can occur at query time

## 4.0.5

### Patch Changes

- fix inefficient regex

## 4.0.4

### Patch Changes

- cleanup inefficient regexs

## 4.0.3

### Patch Changes

- transform ISO dates to epoch time after hashing

## 4.0.2

### Patch Changes

- fix regressed WHERE support

## 4.0.1

### Patch Changes

- add option for DISTINCT value query

## 4.0.0

### Major Changes

- drop support for Node 12

## 3.1.1

### Patch Changes

- convert fixture to js module

## 3.1.0

### Minor Changes

- use koop or other winston-based logger instead of console
- add a Logger singleton
- add a public `setLogger` method that can be used to override default logger or set level

## 3.0.1

### Patch Changes

- Patch bumping for a clean release

## 3.0.0

### Major Changes

- scoped repo to koop organization
- migrate to Koop monorepo
- move code to `/src` directory
- co-locate unit test files
- migrate to eslint
