# @koopjs/output-geoservices

## 7.1.0

### Minor Changes

- allow server and layer metadata defaults to be overriden with `defaults` option in the output's constructor

### Patch Changes

- Updated dependencies [8f67c70]
  - @koopjs/featureserver@8.1.0

## 7.0.0

### Major Changes

- remove usage of config module
- add error handling for pull-data errors and auth errors

### Patch Changes

- Updated dependencies [34d8317]
  - @koopjs/featureserver@8.0.0

## 6.0.8

### Patch Changes

- Updated dependencies [8671389]
  - @koopjs/featureserver@7.1.7

## 6.0.7

### Patch Changes

- Updated dependencies [713e1e3]
  - @koopjs/featureserver@7.1.6

## 6.0.6

### Patch Changes

- Updated dependencies [faf732d]
  - @koopjs/featureserver@7.1.5

## 6.0.5

### Patch Changes

- Updated dependencies [accae0c]
  - @koopjs/featureserver@7.1.4

## 6.0.4

### Patch Changes

- @koopjs/featureserver@7.1.3

## 6.0.3

### Patch Changes

- Updated dependencies [7693bd6]
  - @koopjs/featureserver@7.1.2

## 6.0.2

### Patch Changes

- Updated dependencies [ee4b416]
  - @koopjs/featureserver@7.1.1

## 6.0.1

### Patch Changes

- Updated dependencies [3097431]
  - @koopjs/featureserver@7.1.0

## 6.0.0

### Major Changes

- drop support for Node 12

### Patch Changes

- Updated dependencies [98fe5ca]
  - @koopjs/featureserver@7.0.0
  - @koopjs/logger@5.0.0

## 5.2.5

### Patch Changes

- Updated dependencies [6e2ce57]
  - @koopjs/logger@4.1.1

## 5.2.4

### Patch Changes

- Updated dependencies [b8f21bd]
  - @koopjs/logger@4.1.0

## 5.2.3

### Patch Changes

- Updated dependencies [66623dc]
  - @koopjs/featureserver@6.1.0

## 5.2.2

### Patch Changes

- @koopjs/featureserver@6.0.1

## 5.2.1

### Patch Changes

- Updated dependencies [352d2fd]
  - @koopjs/featureserver@6.0.0

## 5.2.0

### Minor Changes

- use koop or other winston-based logger instead of console
- pass logger on to FeatureServer

### Patch Changes

- Updated dependencies [c1b0bce]
  - @koopjs/featureserver@5.1.0

## 5.1.0

### Minor Changes

- allow custom logger from output-plugin registration options

### Patch Changes

- Updated dependencies [2d8106f]
  - @koopjs/logger@4.0.0

## 5.0.0

### Major Changes

- remove FeatureServer routes that do not include `/rest/services`. This is technically a breaking change but should not affect any Koop applications that are specifically used with ArcGIS clients, as they only use routes with `/rest/services`.

## 4.0.1

### Patch Changes

- Patch bumping for a clean release
- Updated dependencies [c7decc5]
- Updated dependencies [c7decc5]
  - @koopjs/featureserver@5.0.1
  - @koopjs/logger@3.0.1

## 4.0.0

### Major Changes

- migrate to Koop monorepo
- move code to `/src` directory
- co-locate unit test files
- migrate to eslint

### Patch Changes

- Updated dependencies [0c8944e4]
- Updated dependencies [0c8944e4]
  - @koopjs/logger@3.0.0
  - @koopjs/featureserver@5.0.0
