---
description: pattern-hunter project status — M2 merged, crew-logger merged; active with Renovate-driven dependency updates since Nov 15; python 3.15, uv 0.13.9, GH Actions v7/v10; blocked PRs #69 and #72.
---
# pattern-hunter

Status as of 2026-11-18:

- **M2 merged** — PR #38 (M2 contract, closes #22; verb rename #44; credentials-in-state guard #46) squash-merged to `main`. Post-merge CI green (532 → 617 after crew-logger).
- **crew-logger merged** — PR #47 (crew-logger wrappers, closes #31) squash-merged. Observed fixes from Opus adversarial review:
  - Default extractors no longer record arguments
  - Credentials without prefix (URL query, header dicts, DSN passwords) now redacted
  - One ERROR per failure (not per wrapped frame); log sink failure no longer masks caller's exception
  - Records redacted before being dropped below log floor
- **NOT deployed** — deploy #10 still blocked on #6, #21 handlers and MDRAG_APP_CREDENTIAL provisioning.
- **Deploy #10 must use the canonical `wiki.datacrew.space` host** for MDRAG_URL in Infisical (see [[reference/gotchas/environment-tooling.md]] — the `wikki.` host 301s and httpx clients treat it as an error).
- **Pre-existing container on bonker** (user 10001, port 8000, running since Oct 03) predates the merges — possibly a stale M0 deploy; investigate before/instead of assuming it's current.
- **Orchestrator-authentication decision** for #28 awaiting Jae's input (agents can't access /turn route; orchestrator-only).
- **Local checkout:** `~/GitHub/pattern-hunter`
- **Test harness env var:** `PATTERN_HUNTER_TEST_POSTGRES_DSN` (not `PATTERN_HUNTER_PG_DSN`) for Postgres-gated tests.
- **Collaborators:** jaewilson07/admin + alix-at-dc/write (added Nov 1).

## Current state (Nov 15–18, active via Renovate)

- **Renovate active** on pattern-hunter and KB repo (PR #71 merged Nov 16).
- **Merged PRs (Nov 15–18):**
  - PR #71 — Renovate config (squash-merged)
  - PR #73 — python 3.13→3.15 (CI green)
  - PR #75 — uv Docker tag v0.13.9
  - PR #76 — actions/checkout v7
  - PR #77 — actions/setup-python v7
  - PR #78 — astral-sh/setup-uv v10
- **Blocked PRs:**
  - **PR #69** (DRAFT, CI test FAIL on DAT-1703, ~29 days stale, zero reviews) → skip
  - **PR #72** (cl v1.6.0) — CI test FAIL + `renovate/artifacts` FAIL: local `domain_state-0.0.1` wheel can't be resolved during Renovate's artifact update. Requires manual intervention or upstream fix.
  - **KB repo PR #65** — `claude-review` Action fail (gh CLI repo-context loss from Claude Code CLI bump) → skip, no review.

## Open issues / milestones

- **Milestones #6–#9:** all OPEN, no movement since Oct 5 → no live testing.
- **#40** (`needs-triage`) still blocks **#8** (stage-run seam).

## Dormancy period (Oct 6 – Nov 14)

- Zero crew output Oct 6 – Nov 5 due to Claude quota exhaustion and credit debt (-1159).
- **hector-dcs GitHub Actions billing failure** identified (GitHub Free's 2,000 monthly Actions minutes exhausted ~Oct 10; no payment method on file). This also blocks crew-dcs CI. **Jae can check.**
- **Expired `gh` auth on cubby** — **HEALED by Nov 14 (DAT-2041 resolved)** — `gh auth` works directly now.
- **Infisical export route broken** on cubby — project ID `3fbb4296-d1a5-4e2d-b7b4-42214e4f1d1c` 404s, `INFISICAL_PROJECT_ID` env var empty. Needs infra review.
- Zero repo activity Oct 6 – Nov 13 (main at `451d969` from Oct 22).
- **Issues #61–#67** filed Oct 12 (Agentic-App Principles SPEC + C1–C6), all `proposed` — planning documents, not PH work.
- **Merge cadence:** reduced from daily to 2x/week during dormancy.
