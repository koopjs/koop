---
'@koopjs/featureserver': major
---

- remove support for "limit" query param as it is not part of the Geoservices API specification
- add coercion of query params (empty string to undefined, "true"/"false" to bool, stringified JSON to JSON)
- merge body and query params into one set of request parameters