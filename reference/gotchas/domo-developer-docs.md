---
description: Domo developer docs gotchas — JS-rendered pages and pro-code deployment workflow.
---
# Domo Developer Docs Gotchas

- **Developer docs are JS-rendered** — `developer.domo.com` pages return empty content when fetched via `fetch_webpage`. Need to find alternative sources or use mdrag RAG for developer content
- **Pro-code deployment workflow is a common DUG question** — users frequently ask about streamlining the IDE → `domo publish` → card → App Studio → share workflow. Direct access is possible via the app instance `launch-form` URL: `{instance}/api/apps/v1/instances/{app-instance-id}/launch-form` (found in browser dev tools Network tab when the app loads). Also supports filter params and `appData`. Streamlining options: use launch-form URL directly, go straight to App Studio (skip dashboard), reuse template App Studio apps, automate card creation via Domo API, use App Studio embed link as delivery mechanism
