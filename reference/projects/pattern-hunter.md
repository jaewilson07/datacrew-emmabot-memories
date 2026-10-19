---
description: pattern-hunter project status — M2 merged, crew-logger merged, green on CI; stalled post-Oct 6 due to crew capacity reallocation; planning specs filed Oct 12; EmmaBot owns merge checks + live testing.
---
# pattern-hunter

Status as of 2026-10-06 (M2):

- **M2 merged** — PR #38 (M2 contract, closes #22; verb rename #44; credentials-in-state guard #46) squash-merged to `main`. Post-merge CI green (532 → 617 after crew-logger).
- **crew-logger merged** — PR #47 (crew-logger wrappers, closes #31) squash-merged. Observed fixes from Opus adversarial review:
  - Default extractors no longer record arguments
  - Credentials without prefix (URL query, header dicts, DSN passwords) now redacted
  - One ERROR per failure (not per wrapped frame); log sink failure no longer masks caller's exception
  - Records redacted before being dropped below log floor
- **All merged PRs:** #30, #32, #33, #37, #38, #47 — post-merge CI green (617 passed, 4 skipped, 1 xfailed).
- **NOT deployed** — deploy #10 still blocked on #6, #21 handlers and MDRAG_APP_CREDENTIAL provisioning.
- **Deploy #10 must use the canonical `wiki.datacrew.space` host** for MDRAG_URL in Infisical (see [[reference/gotchas/environment-tooling.md]] — the `wikki.` host 301s and httpx clients treat it as an error).
- **Pre-existing container on bonker** (user 10001, port 8000, running since Oct 03) predates the merges — possibly a stale M0 deploy; investigate before/instead of assuming it's current.
- **Orchestrator-authentication decision** for #28 awaiting Jae's input (agents can't access /turn route; orchestrator-only).
- **Local checkout:** `~/GitHub/pattern-hunter`
- **Test harness env var:** `PATTERN_HUNTER_TEST_POSTGRES_DSN` (not `PATTERN_HUNTER_PG_DSN`) for Postgres-gated tests.

## Post-Oct 6 status (stalled)

- **Zero crew output** since Oct 6. Crew hit Claude weekly quota Oct 10 (~12:48pm MDT), builders can't resume until Oct 14 1am reset.
- Before the quota wall, crew was reassigned to other priorities: crew-dcs, redaction MVP, datacrew journals. Pattern-hunter hasn't seen commits since Oct 5.
- **hector-dcs GitHub Actions billing failure** identified (GitHub Free's 2,000 monthly Actions minutes exhausted ~Oct 10; no payment method on file). This also blocks crew-dcs CI. **Jae can check.**
- **Expired `gh` auth on cubby** initially degraded merge checks (401s); **HEALED** by Oct 15 (no longer an active issue).
- Post-Oct 14 quota reset: **zero activity resumed** — crew sessions ran but produced no pattern-hunter commits.
- **Issues #61–#67** filed Oct 12 (Agentic-App Principles SPEC + C1–C6), all `proposed` — planning documents, not PH work.
- **M2/M3 unstarted**; **#40** (`needs-triage`) still blocks **#8** (stage-run seam).
- **No open PRs** (main unmoved at `310f7dd` since Oct 6). Last issue activity: Oct 12.
- **Merge cadence:** reduced from daily to 2x/week during dormancy (Jae's resume decision sits since Oct 14, DMs unanswered; daily "nothing changed" is noise).
- **Live testing:** not started (no merged milestones to test).
