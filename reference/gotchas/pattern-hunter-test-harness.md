---
description: pattern-hunter merge-check gotchas — Postgres-gated tests need PATTERN_HUNTER_TEST_POSTGRES_DSN (wrong name looks like a PR defect), fresh worktrees need wheels/ copied in, and create_app_from_env requires DATABASE_URL/MDRAG_URL/MDRAG_APP_CREDENTIAL.
---
# pattern-hunter Test Harness / Merge-Check Gotchas

Verified while running the Postgres-gated test suite for pattern-hunter merge checks (`~/GitHub/pattern-hunter`):

- **Postgres DSN env var is `PATTERN_HUNTER_TEST_POSTGRES_DSN`, NOT `PATTERN_HUNTER_PG_DSN`.** Using the wrong name fails the suite with 13 failed / 37 errors, all raising `TestPostgresMissingError: PATTERN_HUNTER_TEST_POSTGRES_DSN is not set` — this looks like a PR defect but is a harness error. Correct invocation:
  ```
  PATTERN_HUNTER_REQUIRE_POSTGRES=1 PATTERN_HUNTER_TEST_POSTGRES_DSN="postgresql://postgres:ph@localhost:<port>/postgres" uv run pytest -q
  ```
- **Fresh git worktrees fail `uv sync`** — `wheels/` is gitignored and contains a local `domain_state` wheel. Copy it in before syncing: `cp -r wheels <worktree>/` from the main checkout.
- **`create_app_from_env` (live smoke tests) requires `DATABASE_URL`, `MDRAG_URL`, and `MDRAG_APP_CREDENTIAL`** — raises KeyError on purpose, no defaults. `DB_SCHEMA` is optional.
