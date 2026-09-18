---
description: Gotcha — Code Engine has two API surfaces (Product API vs App Framework); custom apps can't call /api endpoints.
---
# Code Engine Dual API Surfaces

**Source:** DUG thread 2026-09-17/18 — Ellibot question, Joseph Meyers (Domo) correction.

- **External calls**: `POST /api/codeengine/v2/packages/{packageId}/versions/{version}/functions/{functionName}`
  with `X-DOMO-Developer-Token`. OAuth client scopes do NOT apply (no Code Engine scope
  exists in the Create API Client dialog — that dialog only covers the api.domo.com REST surface).
- **Inside a custom app**: `domo.post('/domo/codeengine/v2/packages/{alias}', params)` where
  alias is manifest-wired. **Custom apps cannot call endpoints starting with `/api`** at all
  (Joseph Meyers, Domo). Session-inherited — no token.
- Path prefixes differ (`/api/codeengine` vs `/domo/codeengine`) — conflating them = 401/404.
- App Framework API doc: https://www.domo.com/docs/portal/API-Reference/app-framework-apis/Code-Engine-API

Full detail: knowledge-base repo `domo/gotchas/product-api-vs-oauth-client-auth-surfaces.md`
(committed 62d6a2b). Related: [[reference/gotchas/doc-url-hallucination.md]] (the wrong
doc link that prompted the correction).
