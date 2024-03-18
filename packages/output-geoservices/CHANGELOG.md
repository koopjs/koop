# @koopjs/output-geoservices

## 8.1.11

### Patch Changes

- Updated dependencies [032d3f1]
  - @koopjs/featureserver@8.5.5

## 8.1.10

### Patch Changes

- @koopjs/featureserver@8.5.4

## 8.1.9

### Patch Changes

- Updated dependencies [95160a7]
  - @koopjs/featureserver@8.5.3

## 8.1.8

### Patch Changes

- Updated dependencies [969d956]
  - @koopjs/featureserver@8.5.2

## 8.1.7

### Patch Changes

- Updated dependencies [cebed95]
  - @koopjs/featureserver@8.5.1

## 8.1.6

### Patch Changes

- Updated dependencies [c61b9ad]
  - @koopjs/featureserver@8.5.0

## 8.1.5

### Patch Changes

- Updated dependencies [b26ec67]
  - @koopjs/featureserver@8.4.0

## 8.1.4

### Patch Changes

- Updated dependencies [bf48f36]
  - @koopjs/featureserver@8.3.3

## 8.1.3

### Patch Changes

- @koopjs/featureserver@8.3.2

## 8.1.2

### Patch Changes

- Updated dependencies [e3e99df]
  - @koopjs/featureserver@8.3.1

## 8.1.1

### Patch Changes

- Updated dependencies [5d7cc53]
  - @koopjs/featureserver@8.3.0

## 8.1.0

### Minor Changes

- use model.pull without callback

## 8.0.0

### Major Changes

- change generateToken route so it matches latest pattern in ArcGIS
- add option "useHttpForTokenUrl" to use http protocol on the authInfo.tokenServicesUrl returned by rest/info route

### Patch Changes

- Updated dependencies [86e2028]
  - @koopjs/featureserver@8.2.0

## 7.1.9

### Patch Changes

- Updated dependencies [a52ea4f]
  - @koopjs/featureserver@8.1.9

## 7.1.8

### Patch Changes

- Updated dependencies [2e50b96]
  - @koopjs/featureserver@8.1.8

## 7.1.7

### Patch Changes

- @koopjs/featureserver@8.1.7

## 7.1.6

### Patch Changes

- Updated dependencies [b8aa6f2]
  - @koopjs/featureserver@8.1.6

## 7.1.5

### Patch Changes

- Updated dependencies [50d8202]
  - @koopjs/featureserver@8.1.5

## 7.1.4

### Patch Changes

- Updated dependencies [de597a6]
  - @koopjs/featureserver@8.1.4

## 7.1.3

### Patch Changes

- Updated dependencies [8bdc90d]
  - @koopjs/featureserver@8.1.3

## 7.1.2

### Patch Changes

- @koopjs/featureserver@8.1.2

## 7.1.1

### Patch Changes

- @koopjs/featureserver@8.1.1

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
