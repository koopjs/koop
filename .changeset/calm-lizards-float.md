---
'@koopjs/output-geoservices': major
---

- remove FeatureServer routes that do not include `/rest/services. This is technically a breaking change but should not affect any Koop applications that are specifically used with ArcGIS clients, as they only use routes with `/rest/services`.
