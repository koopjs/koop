# @koopjs/winnow

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
