# @koopjs/output-geoservices

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
