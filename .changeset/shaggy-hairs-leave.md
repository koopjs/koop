---
'@koopjs/cache-memory': major
---

- removed methods not used by Koop (all catalog methods, update, upsert, append, stream); these methods complicated code without adding any functionality to Koop itself; the reduced set of methods (insert, retrieve, delete) are easier to implement and maintain, and we can reduce the cache spec to solely these methods which will make it easier to develop other cache pluging
