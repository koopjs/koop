---
'@koopjs/koop-core': major
---

- BREAKING CHANGE: remove query param coercion (empty string to undefined, "true"/"false" to bool, stringified JSON to JSON) - this should be handled in output plugins or in Koop instance
- BREAKING CHANGE: remove merging of query and body parameters - this should be handled in output plugins or in Koop instance