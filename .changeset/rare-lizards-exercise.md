---
"@koopjs/featureserver": major
---

- Remove route module and refactor signatures of handlers; consumers can no longer use FeatureServer.route.  If using this directly with Express, you need to define each route and bind to the correct FeatureServer handler.
