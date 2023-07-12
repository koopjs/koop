# @koopjs/cache-memory

## 5.0.0

### Major Changes

- removed methods not used by Koop (all catalog methods, update, upsert, append, stream); these methods complicated code without adding any functionality to Koop itself; the reduced set of methods (insert, retrieve, delete) are easier to implement and maintain, and we can reduce the cache spec to solely these methods which will make it easier to develop other cache pluging

## 4.0.1

### Patch Changes

- update cache expire time when updating the cache

## 4.0.0

### Major Changes

- drop support for Node 12

## 3.0.1

### Patch Changes

- Patch bumping for a clean release

## 3.0.0

### Major Changes

- migrate to Koop monorepo
- move code to `/src` directory
- co-locate unit test files
- migrate to eslint
