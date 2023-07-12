---
'@koopjs/koop-core': major
---

- changed default memory cache; this should really only be used internally, but it is exposed as a public property in registered providers. Ff providers were directly using this cache and any of the removed methods, errors will occur. Such providers should stop using Koop's internal cache implement their own in the provider code

