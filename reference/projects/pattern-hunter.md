---
description: pattern-hunter project status — M1 merged and green on CI, not yet deployed; deploy blockers and the stale pre-merge container on bonker.
---
# pattern-hunter

Status as of 2026-10-06 (M1):

- **PRs #33, #30, #32, #37 all squash-merged to `main`** — post-merge CI green (477 passed).
- **NOT deployed** — deploy #10 is blocked on #6, #21 handlers and MDRAG_APP_CREDENTIAL provisioning.
- **Deploy #10 must use the canonical `wiki.datacrew.space` host** for MDRAG_URL in Infisical (see [[reference/gotchas/environment-tooling.md]] — the `wikki.` host 301s and httpx clients treat it as an error).
- **Pre-existing container on bonker** (user 10001, port 8000, running since Oct 03) predates the merges — possibly a stale M0 deploy; investigate before/instead of assuming it's current.
- **Local checkout:** `~/GitHub/pattern-hunter`
